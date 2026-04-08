import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bộ sưu tập",
  description:
    "Duyệt qua các bộ sưu tập sản phẩm theo danh mục tại ShopVN. Thời trang, điện tử, gia dụng và nhiều hơn nữa.",
  openGraph: {
    title: "Bộ sưu tập — ShopVN",
    description:
      "Duyệt qua các bộ sưu tập sản phẩm theo danh mục. Thời trang, điện tử, gia dụng.",
  },
};

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
