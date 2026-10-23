import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Theme } from "@/models";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    await requireAdmin();
    await connectToDatabase();
    const theme = await Theme.findOne().lean();
    return NextResponse.json({ success: true, theme });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    await connectToDatabase();
    const data = await req.json();

    let theme = await Theme.findOne();
    if (!theme) {
      theme = await Theme.create(data);
    } else {
      theme = await Theme.findByIdAndUpdate(theme._id, data, { new: true });
    }

    revalidatePath("/ar");
    revalidatePath("/en");

    return NextResponse.json({ success: true, theme });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
