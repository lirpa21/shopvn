import { NextRequest, NextResponse } from "next/server";
import { verifyVNPayReturn } from "@/lib/payment";

/**
 * GET /api/payment/vnpay/ipn
 * VNPay IPN (Instant Payment Notification) — server-to-server callback
 * VNPay calls this URL to confirm payment status
 */
export async function GET(request: NextRequest) {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const result = verifyVNPayReturn(searchParams);

  console.log("[VNPay IPN]", result);

  if (result.success) {
    // TODO: Update order status in database
    // await db.order.update({ where: { id: result.orderId }, data: { status: 'paid' } });

    return NextResponse.json({
      RspCode: "00",
      Message: "Confirm Success",
    });
  }

  return NextResponse.json({
    RspCode: "97",
    Message: "Invalid Checksum",
  });
}
