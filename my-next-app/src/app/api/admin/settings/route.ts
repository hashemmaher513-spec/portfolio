import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { SiteSettings } from "@/models";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    await requireAdmin();
    await connectToDatabase();
    const settings = await SiteSettings.findOne().lean();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    await connectToDatabase();
    const data = await req.json();

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(data);
    } else {
      settings = await SiteSettings.findByIdAndUpdate(settings._id, data, { new: true });
    }

    revalidatePath("/ar");
    revalidatePath("/en");

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
