/**
 * Upload an image via the /api/upload-image proxy (avoids browser CORS restrictions).
 * Server-side the proxy forwards to anh.moe using ANH_MOE_API_KEY from env.
 */
export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("source", file);

  const res = await fetch("/api/upload-image", {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    throw new Error(`Image upload failed (HTTP ${res.status})`);
  }

  const data = await res.json();

  if (!data.url) {
    throw new Error(data.error ?? "Image upload failed");
  }

  return data.url as string;
}

