import { NextResponse } from "next/server";
import { generateOrderConfirmationEmail } from "@/lib/email-template";

/**
 * GET /api/email-preview
 * Preview the order confirmation email template in browser
 * Only available in development mode
 */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 404 });
  }

  const sampleData = {
    orderNumber: "SV20260408A1B2",
    customerName: "Nguyễn Văn A",
    customerEmail: "nguyenvana@email.com",
    items: [
      {
        title: "Áo Polo Premium Cotton",
        quantity: 2,
        price: 450000,
        variant: "Đen / L",
        image: "",
      },
      {
        title: "Giày chạy bộ Ultra Boost",
        quantity: 1,
        price: 1890000,
        variant: "Trắng / 42",
        image: "",
      },
      {
        title: "Serum Vitamin C 20% Brightening",
        quantity: 1,
        price: 380000,
        image: "",
      },
    ],
    subtotal: 3170000,
    shippingFee: 0,
    discount: 50000,
    total: 3120000,
    paymentMethod: "momo",
    shippingAddress: {
      name: "Nguyễn Văn A",
      phone: "0912 345 678",
      address: "123 Nguyễn Huệ, Quận 1",
      province: "TP. Hồ Chí Minh",
    },
    estimatedDelivery: "1-2 ngày làm việc",
    orderDate: "08/04/2026, 10:30",
  };

  const html = generateOrderConfirmationEmail(sampleData);

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
