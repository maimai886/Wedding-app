// Phones shoot 12 MP+; guests on venue Wi-Fi should not upload that. Each picture is scaled down and
// re-encoded in the browser before upload.
export interface Prepared { src: string; width: number; height: number; bytes: number }

export const MAX_EDGE = 1600;

export function fitWithin(w: number, h: number, max = MAX_EDGE) {
  const k = Math.min(1, max / Math.max(w, h));
  return { width: Math.round(w * k), height: Math.round(h * k) };
}

export async function prepareImage(file: File, max = MAX_EDGE, quality = 0.82): Promise<Prepared> {
  if (!file.type.startsWith("image/")) throw new Error(`${file.name} 不是圖片`);
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const { width, height } = fitWithin(bitmap.width, bitmap.height, max);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const src = canvas.toDataURL("image/jpeg", quality);
  return { src, width, height, bytes: Math.round((src.length - 23) * 0.75) };
}

export const formatBytes = (n: number) => (n > 1_000_000 ? `${(n / 1_000_000).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1000))} KB`);
