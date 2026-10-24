import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"];

export async function POST(request: Request) {
  // Only SuperAdmin can upload images to the server
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ ok: false, message: "Unauthorized. SuperAdmin required." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ ok: false, message: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { ok: false, message: "Invalid file type. Only JPEG, PNG, WebP, GIF, and SVG images are accepted." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { ok: false, message: "File exceeds 10MB limit." },
        { status: 413 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Determine extension safely
    const originalExt = path.extname(file.name).toLowerCase();
    const safeExt = originalExt || (file.type === "image/png" ? ".png" : file.type === "image/webp" ? ".webp" : ".jpg");
    const sanitizedBase = path.basename(file.name, originalExt).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 30);
    const fileName = `upload-${Date.now()}-${sanitizedBase || "img"}${safeExt}`;
    const filePath = path.join(uploadsDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const fileUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      ok: true,
      message: "Image uploaded successfully",
      url: fileUrl,
      fileName,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ ok: false, message: "Failed to upload image" }, { status: 500 });
  }
}

