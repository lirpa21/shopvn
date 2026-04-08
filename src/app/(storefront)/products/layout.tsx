import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tất cả sản phẩm",
  description:
    "Khám phá bộ sưu tập sản phẩm đa dạng tại ShopVN. Lọc theo danh mục, giá cả, sắp xếp theo xu hướng mới nhất.",
  openGraph: {
    title: "Tất cả sản phẩm — ShopVN",
    description:
      "Khám phá hàng nghìn sản phẩm chất lượng. Lọc theo danh mục, khoảng giá, sắp xếp dễ dàng.",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
