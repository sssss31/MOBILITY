import { getD1, type D1Database } from "./d1-compat";
import { ADMIN_COOKIE, adminEmail, verifySessionToken } from "./auth";
import { defaultCategories, defaultContent, defaultProducts, starterPosts } from "./default-data";

export type AdminIdentity={userId:string;email:string};
export class HttpError extends Error{constructor(public status:number,message:string){super(message)}}
export const now=()=>new Date().toISOString();
export const makeId=(prefix:string)=>`${prefix}_${crypto.randomUUID()}`;
export function database():D1Database{return getD1()}
export function json(data:unknown,status=200){return Response.json(data,{status,headers:{"cache-control":"no-store"}})}
export async function readBody(request:Request){try{return await request.json() as Record<string,unknown>}catch{throw new HttpError(400,"Invalid JSON body")}}
export function clean(value:unknown,max=2000){return String(value??"").trim().slice(0,max)}

export async function seedDefaults(){
  const db=database(),stamp=now(),statements=[];
  for(const [index,c] of defaultCategories.entries()) statements.push(db.prepare("INSERT OR IGNORE INTO categories (id,slug,name,description,image,published,display_order,created_at,updated_at) VALUES (?,?,?,?,?,1,?,?,?)").bind(`cat_${c.slug}`,c.slug,c.name,c.description,c.image,index,stamp,stamp));
  for(const [index,p] of defaultProducts.entries()) statements.push(db.prepare("INSERT OR IGNORE INTO products (id,slug,name,category,image,description,overview,featured,published,display_order,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,1,?,?,?)").bind(`prod_${p[0]}`,p[0],p[1],p[2],p[3],p[4],p[4],p[5],index,stamp,stamp));
  for(const [key,value] of Object.entries(defaultContent)) statements.push(db.prepare("INSERT OR IGNORE INTO site_content (key,value,updated_at) VALUES (?,?,?)").bind(key,value,stamp));
  for(const [index,p] of starterPosts.entries()) statements.push(db.prepare("INSERT OR IGNORE INTO blog_posts (id,slug,title,excerpt,body,category,status,medically_reviewed,created_at,updated_at) VALUES (?,?,?,?,?,?,'draft',0,?,?)").bind(`post_${index}`,p.slug,p.title,p.excerpt,"Editorial draft. Medical review is required before publication.",p.category,stamp,stamp));
  await db.batch(statements);
}

function readCookie(request:Request,name:string):string|null{
  const header=request.headers.get("cookie");
  if(!header)return null;
  for(const part of header.split(";")){
    const [k,...v]=part.trim().split("=");
    if(k===name)return decodeURIComponent(v.join("="));
  }
  return null;
}

export async function requireAdmin(request:Request):Promise<AdminIdentity>{
  const token=readCookie(request,ADMIN_COOKIE);
  if(!(await verifySessionToken(token)))throw new HttpError(401,"Sign in is required");
  return {userId:"owner",email:adminEmail()};
}

export async function audit(admin:AdminIdentity,action:string,entityType:string,entityId:string,details:unknown){await database().prepare("INSERT INTO audit_logs (id,user_id,action,entity_type,entity_id,details,created_at) VALUES (?,?,?,?,?,?,?)").bind(makeId("audit"),admin.userId,action,entityType,entityId,JSON.stringify(details),now()).run()}
export async function notifyLead(payload:Record<string,string>){const apiKey=process.env.RESEND_API_KEY;if(!apiKey)return false;const recipient=process.env.NOTIFICATION_EMAIL||defaultContent.email;const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{authorization:`Bearer ${apiKey}`,"content-type":"application/json"},body:JSON.stringify({from:"MobilityOne Website <onboarding@resend.dev>",to:[recipient],subject:`New MobilityOne ${payload.type}: ${payload.reference}`,text:Object.entries(payload).map(([k,v])=>`${k}: ${v}`).join("\n")})});return response.ok}
export function handleError(error:unknown){if(error instanceof HttpError)return json({error:error.message},error.status);console.error(error);return json({error:"Unexpected server error"},500)}
