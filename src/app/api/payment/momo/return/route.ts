import { NextRequest, NextResponse } from "next/server";
import { verifyMoMoReturn } from "@/lib/payment";

/**
 * GET /api/payment/momo/return
 * MoMo redirects the user here after payment
 */
export async function GET(request: NextRequest) {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const result = verifyMoMoReturn(searchParams);

  console.log("[MoMo Return]", result);

  if (result.success) {
    const successUrl = new URL("/checkout/success", request.url);
    successUrl.searchParams.set("orderId", result.orderId);
    successUrl.searchParams.set("txnId", result.transactionId);
    successUrl.searchParams.set("method", "momo");
    return NextResponse.redirect(successUrl);
  }

  const checkoutUrl = new URL("/checkout", request.url);
  checkoutUrl.searchParams.set(
    "error",
    result.message || "Thanh toán MoMo thất bại"
  );
  return NextResponse.redirect(checkoutUrl);
}
