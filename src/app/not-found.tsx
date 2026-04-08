import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center py-20 px-4">
      <div className="text-center max-w-lg">
        {/* 404 number with gradient */}
        <div className="relative mb-6">
          <span className="text-[160px] font-black leading-none tracking-tighter gradient-text opacity-80">
            404
          </span>
        </div>

        <h1
          className="text-3xl font-bold mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Trang không tìm thấy
        </h1>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã được di
          chuyển.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="gap-2 w-full sm:w-auto">
              <Home className="w-4 h-4" />
              Về trang chủ
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <Search className="w-4 h-4" />
              Tìm sản phẩm
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
