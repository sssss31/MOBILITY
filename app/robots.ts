import type { MetadataRoute } from "next";
export default function robots():MetadataRoute.Robots{return{rules:{userAgent:"*",allow:"/",disallow:["/admin/","/api/admin/"]},sitemap:"https://mobilityone-medical-marketplace.bronzyfinch3.chatgpt.site/sitemap.xml"}}
