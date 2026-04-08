import { NextRequest, NextResponse } from "next/server";
import {
  createPayment,
  type PaymentMethodId,
} from "@/lib/payment";

/**
 * POST /api/payment/create
 * Create a payment session for the given order
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { method, orderId, amount, orderInfo, customerName, customerEmail } =
      body as {
        method: PaymentMethodId;
        orderId: string;
        amount: number;
        orderInfo: string;
        customerName?: string;
        customerEmail?: string;
      };

    if (!method || !orderId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: method, orderId, amount" },
        { status: 400 }
      );
    }

    // Get client IP
    const forwarded = request.headers.get("x-forwarded-for");
    const ipAddress = forwarded
      ? forwarded.split(",")[0].trim()
      : "127.0.0.1";

    const result = await createPayment(method, {
      orderId,
      amount,
      orderInfo: orderInfo || `Thanh toán đơn hàng ${orderId}`,
      customerName,
      customerEmail,
      ipAddress,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Payment creation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentUrl: result.paymentUrl,
      transactionId: result.transactionId,
      message: result.message,
    });
  } catch (error) {
    console.error("[API] Payment create error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
