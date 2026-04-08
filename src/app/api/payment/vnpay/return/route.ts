import { NextRequest, NextResponse } from "next/server";
import { verifyVNPayReturn } from "@/lib/payment";

/**
 * GET /api/payment/vnpay/return
 * VNPay redirects the user here after payment
 */
export async function GET(request: NextRequest) {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const result = verifyVNPayReturn(searchParams);

  console.log("[VNPay Return]", result);

  if (result.success) {
    // Payment successful — redirect to success page
    const successUrl = new URL("/checkout/success", request.url);
    successUrl.searchParams.set("orderId", result.orderId);
    successUrl.searchParams.set("txnId", result.transactionId);
    successUrl.searchParams.set("method", "vnpay");
    return NextResponse.redirect(successUrl);
  }

  // Payment failed — redirect to checkout with error
  const checkoutUrl = new URL("/checkout", request.url);
  checkoutUrl.searchParams.set(
    "error",
    result.message || "Thanh toán thất bại"
  );
  return NextResponse.redirect(checkoutUrl);
}
