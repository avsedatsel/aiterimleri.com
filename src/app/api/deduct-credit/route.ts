import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  if (!token) {
    return NextResponse.json({ error: "Token gerekli." }, { status: 400 });
  }
  const secret = process.env.SANAL_DRONE_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Yapılandırma hatası." }, { status: 500 });
  }
  const res = await fetch("https://orabura.com.tr/api/video-token/use", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-sanal-drone-secret": secret,
    },
    body: JSON.stringify({ token }),
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
