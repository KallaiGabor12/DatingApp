import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { Readable } from "stream";

export const runtime = "nodejs";

/**
 * App-route handler to stream files from `public/uploads/...`.
 * Works both in dev and production builds.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const resolved = await params;
  const raw = resolved?.path;
  if (!raw || raw.length === 0) return new NextResponse("Missing path", { status: 400 });

  // Flatten and sanitize segments
  const segments = (Array.isArray(raw) ? raw : [raw])
    .flatMap((s) => String(s).split("/"))
    .map((s) => decodeURIComponent(s))
    .filter(Boolean)
    .filter((s) => s !== "." && s !== "..");

  // Ensure we look under uploads/... (requests come as /api/uploads/...) so parts are e.g. ["references","file.jpg"]
  const parts = segments[0] === "uploads" ? segments : ["uploads", ...segments];

  const publicDirs = [
    path.join(process.cwd(), "public"),
    path.join(process.cwd(), "prodbuild", "public"),
    path.join(process.cwd(), "build", "public"),
    path.join(process.cwd(), ".next", "dev", "server", "app", "public"),
  ];

  const candidates = publicDirs.map((d) => path.join(d, ...parts));

  if (process.env.NODE_ENV !== "production") {
    console.debug("[uploads route] process.cwd():", process.cwd());
    console.debug("[uploads route] checking candidates:");
    candidates.forEach((c) => console.debug("  -", c));
  }

  let filePath: string | null = null;
  for (const candidate of candidates) {
    const pubDir = path.normalize(path.dirname(candidate));
    const candNorm = path.normalize(candidate);
    // ensure candidate remains inside its public dir
    if (!candNorm.startsWith(pubDir + path.sep) && candNorm !== pubDir) continue;
    try {
      await fs.promises.access(candNorm, fs.constants.R_OK);
      filePath = candNorm;
      break;
    } catch {
      // not available, try next
    }
  }

  if (!filePath) {
    if (process.env.NODE_ENV !== "production") console.error("[uploads route] file not found in candidates");
    return new NextResponse("Not found", { status: 404 });
  }

  const stat = await fs.promises.stat(filePath);

  const ext = path.extname(filePath).toLowerCase();
  const mimeMap: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".jfif": "image/jpeg",
    ".svg": "image/svg+xml",
    ".bmp": "image/bmp",
    ".avif": "image/avif",
    ".ico": "image/x-icon",
  };

  const contentType = mimeMap[ext] || "application/octet-stream";

  const nodeStream = fs.createReadStream(filePath);
  const webStream = Readable.toWeb(nodeStream as any) as unknown as ReadableStream;

  const headers: Record<string, string> = {
    "Content-Type": contentType,
    "Content-Length": String(stat.size),
    "Cache-Control": "public, max-age=0, must-revalidate",
  };

  return new NextResponse(webStream, { status: 200, headers });
}