import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thanh toán",
  description: "Hoàn tất đơn hàng của bạn tại ShopVN. Thanh toán nhanh, an toàn.",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
