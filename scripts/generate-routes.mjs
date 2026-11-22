import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist');
const template = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const origin = 'https://mobilityone-medical-marketplace.bronzyfinch3.chatgpt.site';
const routes = [
  ['products','Prosthetic & Orthotic Products | MobilityOne','Explore MobilityOne prosthetic limbs, orthotic braces, foot supports and silicone prostheses in Gurugram.'],
  ['categories','Mobility Solution Categories | MobilityOne','Browse upper-limb, lower-limb, orthotic, foot-support and silicone mobility solution categories.'],
  ['about','About MobilityOne | Prosthetics & Orthotics Gurugram','Learn about MobilityOne’s consultation-led approach to prosthetic and orthotic mobility solutions.'],
  ['consultation','Book a Prosthetic Consultation | MobilityOne','Request a consultation with MobilityOne for prosthetic, orthotic and fitting guidance in Gurugram.'],
  ['contact','Contact MobilityOne Gurugram','Call, WhatsApp or email MobilityOne for prosthetic and orthotic product enquiries.'],
  ['faqs','MobilityOne FAQs','Answers about MobilityOne products, consultation, fittings and enquiries.'],
  ['admin','MobilityOne Admin Portal','MobilityOne content management portal.'],
  ['privacy-policy','Privacy Policy | MobilityOne','Read the MobilityOne website privacy information.'],
  ['terms','Terms & Conditions | MobilityOne','Read the MobilityOne website terms and conditions.'],
  ['shipping-returns','Shipping & Returns | MobilityOne','Read important MobilityOne shipping, handover and returns information.']
];
const products = [
  ['artificial-hands','Artificial Hands'],['silicone-artificial-hand','Silicone Artificial Hand'],['silicone-finger-hand-prosthesis','Silicone Finger / Hand Prosthesis'],['artificial-silicone-finger','Artificial Silicone Finger'],['below-knee-artificial-leg','Below-Knee Artificial Leg'],['carbon-fibre-prosthetic-foot','Carbon Fibre Prosthetic Foot'],['knee-ankle-foot-orthosis','KAFO Brace'],['hip-knee-ankle-foot-orthosis','HKAFO Orthosis'],['ptb-brace','PTB Brace'],['knee-gaiter','Knee Gaiter'],['dennis-brown-splint','Dennis Brown Splint'],['mermaid-splint','Mermaid Splint'],['ankle-foot-orthosis','Ankle Foot Orthosis (AFO)'],['ucbl-orthosis','UCBL Orthosis']
];
for (const [slug,name] of products) routes.push([`products/${slug}`,`${name} | MobilityOne`,`Explore ${name} information and contact MobilityOne in Gurugram for availability, fitting and consultation guidance.`]);

for (const [route,title,description] of routes) {
  const dir = path.join(root, route);
  fs.mkdirSync(dir, {recursive:true});
  let html = template
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${description}">`)
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${origin}/${route}/">`);
  if (route === 'admin') html = html.replace('</head>','  <meta name="robots" content="noindex,nofollow">\n</head>');
  fs.writeFileSync(path.join(dir,'index.html'),html);
}

const urls = ['',...routes.filter(([r])=>r!=='admin').map(([r])=>r+'/')];
fs.writeFileSync(path.join(root,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`  <url><loc>${origin}/${u}</loc></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(root,'robots.txt'),`User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: ${origin}/sitemap.xml\n`);

