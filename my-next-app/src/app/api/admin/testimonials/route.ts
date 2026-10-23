import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Testimonial } from "@/models";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    await requireAdmin();
    await connectToDatabase();
    const testimonials = await Testimonial.find().sort({ order: 1 }).lean();
    return NextResponse.json({ success: true, testimonials });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    await connectToDatabase();
    const data = await req.json();

    const testimonial = await Testimonial.create(data);
    revalidatePath("/ar");
    revalidatePath("/en");

    return NextResponse.json({ success: true, testimonial });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    await connectToDatabase();
    const data = await req.json();

    const testimonial = await Testimonial.findByIdAndUpdate(data._id, data, { new: true });
    revalidatePath("/ar");
    revalidatePath("/en");

    return NextResponse.json({ success: true, testimonial });
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

    await Testimonial.findByIdAndDelete(id);
    revalidatePath("/ar");
    revalidatePath("/en");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
