import { NextResponse } from "next/server";
import { ADMIN_COOKIE, createSessionToken, sessionCookieOptions, verifyAdminPassword } from "@/lib/auth";

export async function POST(request: Request) {
  let password: string | undefined;
  try {
    const body = (await request.json()) as { password?: unknown };
    if (typeof body?.password === "string") password = body.password;
  } catch {
    // fall through — treated as missing password
  }
  try {
    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 503 });
  }
  let token: string;
  try {
    token = await createSessionToken();
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 503 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token, sessionCookieOptions());
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "", sessionCookieOptions(0));
  return response;
}
