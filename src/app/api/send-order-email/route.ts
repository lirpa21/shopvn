import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import {
  generateOrderConfirmationEmail,
  type OrderEmailData,
} from "@/lib/email-template";

export async function POST(request: NextRequest) {
  try {
    const body: OrderEmailData = await request.json();

    // Validate required fields
    if (!body.customerEmail || !body.orderNumber) {
      return NextResponse.json(
        { error: "Missing required fields: customerEmail, orderNumber" },
        { status: 400 }
      );
    }

    // Generate email HTML
    const html = generateOrderConfirmationEmail(body);

    // Send email
    const result = await sendEmail({
      to: body.customerEmail,
      subject: `Xác nhận đơn hàng ${body.orderNumber} — ShopVN`,
      html,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
    });
  } catch (error) {
    console.error("[API] Send order email error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
