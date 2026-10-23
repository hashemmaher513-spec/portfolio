import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Admin } from "@/models";
import { verifyPassword, createSessionToken, setAdminSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "البريد الإلكتروني وكلمة المرور مطلوبان" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      // General error message as required by PRD FR-ADM-001 (don't reveal whether email or pass was wrong)
      return NextResponse.json(
        { success: false, error: "بيانات الدخول غير صحيحة" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "بيانات الدخول غير صحيحة" },
        { status: 401 }
      );
    }

    // Create JWT Session token
    const token = await createSessionToken({
      email: admin.email,
      role: "admin",
    });

    await setAdminSessionCookie(token);

    return NextResponse.json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
    });
  } catch (error: any) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء تسجيل الدخول" },
      { status: 500 }
    );
  }
}
