import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
// 20 MB limit
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 });
  }

  const incoming = await req.formData();
  const file = incoming.get("source");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const apiKey = process.env.ANH_MOE_API_KEY ?? "anh.moe_public_api";

  const form = new FormData();
  form.append("source", file);
  form.append("format", "json");

  const upstream = await fetch("https://anh.moe/api/1/upload", {
    method: "POST",
    headers: { "X-API-Key": apiKey },
    body: form,
  });

  const data = await upstream.json();

  if (!upstream.ok || data.status_code !== 200) {
    return NextResponse.json(
      { error: data.status_txt ?? "Upload failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({ url: data.image.url as string });
}
