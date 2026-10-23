import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { uploadBufferToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "لم يتم تحديد أي ملف" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // If Cloudinary is configured and active, upload directly to Cloudinary
    if (process.env.MEDIA_STORAGE_PROVIDER === "cloudinary" && isCloudinaryConfigured()) {
      const isVideo = file.type.startsWith("video/");
      const result = await uploadBufferToCloudinary(buffer, {
        folder: "portfolio",
        resourceType: isVideo ? "video" : "image",
      });

      return NextResponse.json({
        success: true,
        url: result.secureUrl,
        publicId: result.publicId,
        format: result.format,
        bytes: result.bytes,
      });
    }

    // Fallback: local storage
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(uploadsDir, safeName);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${safeName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      publicId: safeName,
      bytes: file.size,
    });
  } catch (error: any) {
    console.error("Upload handler error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "فشل رفع الملف" },
      { status: 500 }
    );
  }
}
