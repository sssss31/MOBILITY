import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/auth";
import { AdminPortal } from "./portal";
import { AdminLogin } from "./login";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin Portal", robots: { index: false, follow: false } };
export default async function AdminPage() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  let authed = false;
  try {
    authed = await verifySessionToken(token);
  } catch {
    authed = false;
  }
  if (!authed) return <AdminLogin />;
  return <AdminPortal displayName="Administrator" />;
}
