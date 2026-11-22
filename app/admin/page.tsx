import type { Metadata } from "next";
import { requireChatGPTUser } from "@/app/chatgpt-auth";
import { AdminPortal } from "./portal";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Admin Portal",robots:{index:false,follow:false}};
export default async function AdminPage(){const user=await requireChatGPTUser("/admin");return <AdminPortal displayName={user.displayName}/>}
