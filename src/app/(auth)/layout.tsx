import Link from "next/link";
import { Store } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-secondary/30">
      {/* Minimal header */}
      <header className="p-6">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center group-hover:scale-105 transition-transform">
            <Store className="h-4 w-4 text-accent-foreground" />
          </div>
          <span className="text-xl font-bold font-heading">
            Shop<span className="gradient-text">VN</span>
          </span>
        </Link>
      </header>

      {/* Centered content */}
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        {children}
      </main>

      {/* Minimal footer */}
      <footer className="p-6 text-center text-xs text-muted-foreground">
        © 2026 ShopVN. Tất cả quyền được bảo lưu.
      </footer>
    </div>
  );
}
