import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Project } from "@/models";
import { revalidatePath } from "next/cache";

// GET all projects (including hidden ones for admin)
export async function GET() {
  try {
    await requireAdmin();
    await connectToDatabase();
    const projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ success: true, projects });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}

// POST create project
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    await connectToDatabase();
    const data = await req.json();

    if (!data.slug || !data.title?.ar || !data.coverImage) {
      return NextResponse.json(
        { success: false, error: "العنوان العربي والـ slug وصورة الغلاف مطلوبة" },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await Project.findOne({ slug: data.slug.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "الرابط الدائم (slug) مستخدم بالفعل، اختر اسماً آخر" },
        { status: 400 }
      );
    }

    const newProject = await Project.create({
      ...data,
      slug: data.slug.toLowerCase().trim(),
    });

    // Revalidate public cache as required by PRD FR-CACHE-002
    revalidatePath("/ar");
    revalidatePath("/en");
    revalidatePath(`/ar/projects/${newProject.slug}`);
    revalidatePath(`/en/projects/${newProject.slug}`);

    return NextResponse.json({ success: true, project: newProject });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT update project
export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    await connectToDatabase();
    const data = await req.json();

    if (!data._id) {
      return NextResponse.json({ success: false, error: "معرف المشروع مطلوب" }, { status: 400 });
    }

    const updated = await Project.findByIdAndUpdate(data._id, data, { new: true });

    revalidatePath("/ar");
    revalidatePath("/en");
    if (updated?.slug) {
      revalidatePath(`/ar/projects/${updated.slug}`);
      revalidatePath(`/en/projects/${updated.slug}`);
    }

    return NextResponse.json({ success: true, project: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE project
export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "معرف المشروع مطلوب" }, { status: 400 });
    }

    const deleted = await Project.findByIdAndDelete(id);

    revalidatePath("/ar");
    revalidatePath("/en");
    if (deleted?.slug) {
      revalidatePath(`/ar/projects/${deleted.slug}`);
      revalidatePath(`/en/projects/${deleted.slug}`);
    }

    return NextResponse.json({ success: true, message: "تم حذف المشروع بنجاح" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
