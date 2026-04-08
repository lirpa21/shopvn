import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/payment/momo/ipn
 * MoMo IPN (Instant Payment Notification) — server-to-server callback
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("[MoMo IPN]", {
      orderId: body.orderId,
      resultCode: body.resultCode,
      transId: body.transId,
      amount: body.amount,
    });

    if (body.resultCode === 0) {
      // Payment successful
      // TODO: Update order status in database
      // await db.order.update({ where: { id: body.orderId }, data: { status: 'paid', transactionId: body.transId } });

      return NextResponse.json({ status: 0 });
    }

    // Payment failed
    return NextResponse.json({ status: 1 });
  } catch (error) {
    console.error("[MoMo IPN] Error:", error);
    return NextResponse.json({ status: 1 }, { status: 500 });
  }
}
