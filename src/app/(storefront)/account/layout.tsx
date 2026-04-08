import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tài khoản",
  description: "Quản lý tài khoản, đơn hàng và thông tin cá nhân tại ShopVN.",
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
