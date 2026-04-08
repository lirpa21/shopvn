import type { Metadata } from "next";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";

export const metadata: Metadata = {
  title: "Mua sắm trực tuyến",
  description:
    "Khám phá hàng nghìn sản phẩm chất lượng với giá tốt nhất tại ShopVN. Giao hàng nhanh, đổi trả dễ dàng.",
  openGraph: {
    title: "ShopVN — Mua sắm trực tuyến",
    description:
      "Khám phá hàng nghìn sản phẩm chất lượng với giá tốt nhất. Giao hàng nhanh, đổi trả dễ dàng.",
  },
};
export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
