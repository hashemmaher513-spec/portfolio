import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Message } from "@/models";

export async function GET() {
  try {
    await requireAdmin();
    await connectToDatabase();
    const messages = await Message.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, messages });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();
    await connectToDatabase();
    const { id, read, archived } = await req.json();

    const update: any = {};
    if (typeof read === "boolean") update.read = read;
    if (typeof archived === "boolean") update.archived = archived;

    const updated = await Message.findByIdAndUpdate(id, update, { new: true });
    return NextResponse.json({ success: true, message: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "معرف الرسالة مطلوب" }, { status: 400 });
    }

    await Message.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "تم حذف الرسالة بنجاح" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
