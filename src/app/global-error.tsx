"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="vi">
      <body className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center max-w-md p-8">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-2 font-heading">
            Đã xảy ra lỗi
          </h2>
          <p className="text-muted-foreground mb-6">
            Xin lỗi về sự bất tiện. Vui lòng thử lại hoặc quay lại trang chủ.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={reset} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Thử lại
            </Button>
            <Button variant="outline" onClick={() => (window.location.href = "/")}>
              Trang chủ
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
