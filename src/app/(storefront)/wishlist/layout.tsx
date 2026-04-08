import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yêu thích",
  description:
    "Danh sách sản phẩm yêu thích của bạn tại ShopVN. Lưu lại và mua sắm những sản phẩm bạn quan tâm.",
};

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
