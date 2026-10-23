import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Section } from "@/models";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    await requireAdmin();
    await connectToDatabase();
    const sections = await Section.find().sort({ order: 1 }).lean();
    return NextResponse.json({ success: true, sections });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    await connectToDatabase();
    const { sections } = await req.json();

    if (!Array.isArray(sections)) {
      return NextResponse.json({ success: false, error: "قائمة الأقسام غير صالحة" }, { status: 400 });
    }

    // Update each section in bulk
    const updateOps = sections.map((sec: any, index: number) =>
      Section.findByIdAndUpdate(sec._id, {
        visible: sec.visible,
        order: index,
        title: sec.title,
        subtitle: sec.subtitle,
      })
    );

    await Promise.all(updateOps);

    revalidatePath("/ar");
    revalidatePath("/en");

    return NextResponse.json({ success: true, message: "تم تحديث ترتيب وظهور الأقسام بنجاح" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
