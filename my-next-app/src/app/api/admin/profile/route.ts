import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Profile } from "@/models";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    await requireAdmin();
    await connectToDatabase();
    const profile = await Profile.findOne().lean();
    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    await connectToDatabase();
    const data = await req.json();

    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create(data);
    } else {
      profile = await Profile.findByIdAndUpdate(profile._id, data, { new: true });
    }

    revalidatePath("/ar");
    revalidatePath("/en");

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
