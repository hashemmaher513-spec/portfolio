import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Message } from "@/models";

// In-memory rate limiting map: ip -> timestamps
const rateLimitMap = new Map<string, number[]>();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown-ip";
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 10;

    const timestamps = rateLimitMap.get(ip) || [];
    const validTimestamps = timestamps.filter((t) => now - t < windowMs);

    if (validTimestamps.length >= maxRequests) {
      return NextResponse.json(
        { success: false, error: "تم تجاوز الحد الأقصى للمحاولات. يرجى الانتظار قليلاً." },
        { status: 429 }
      );
    }

    validTimestamps.push(now);
    rateLimitMap.set(ip, validTimestamps);

    const body = await req.json();
    const { name, email, subject, message, _hp_website_confirm, locale } = body;

    // Honeypot check: If the hidden honeypot field is filled by a bot, silently reject
    if (_hp_website_confirm) {
      return NextResponse.json({ success: true, message: "Message received." });
    }

    // Validation rules from PRD FR-PUB-030
    if (!name || name.trim().length < 2 || name.trim().length > 80) {
      return NextResponse.json(
        { success: false, error: locale === "en" ? "Name must be between 2 and 80 characters." : "الاسم يجب أن يكون بين حرفين و 80 حرفاً." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: locale === "en" ? "Please enter a valid email address." : "يرجى إدخال بريد إلكتروني صحيح." },
        { status: 400 }
      );
    }

    if (!message || message.trim().length < 10 || message.trim().length > 3000) {
      return NextResponse.json(
        { success: false, error: locale === "en" ? "Message must be between 10 and 3000 characters." : "الرسالة يجب أن تكون بين 10 و 3000 حرف." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newMessage = await Message.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject ? subject.trim().slice(0, 120) : "استفسار من الموقع",
      body: message.trim(),
    });

    // Send email notification to admin asynchronously (failure will not block response)
    import("@/lib/email").then(({ sendAdminNotification }) => {
      sendAdminNotification({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject?.trim(),
        message: message.trim(),
      }).catch((e) => console.error("Notification trigger error:", e));
    });

    const successMessage =
      locale === "en"
        ? "Thank you! Your message has been sent successfully. I will get back to you soon."
        : "شكراً لك! تم إرسال رسالتك بنجاح وسأقوم بالرد عليك في أقرب وقت.";

    return NextResponse.json({
      success: true,
      message: successMessage,
      id: newMessage._id,
    });
  } catch (error: any) {
    console.error("Contact submission error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة لاحقاً." },
      { status: 500 }
    );
  }
}
