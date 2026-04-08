"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Package,
  MapPin,
  CreditCard,
  ArrowRight,
  Copy,
  Check,
  ShoppingBag,
  Truck,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/format";

interface OrderInfo {
  orderNumber: string;
  total: number;
  itemCount: number;
  paymentMethod: string;
  shippingName: string;
  shippingAddress: string;
}

const paymentMethodLabels: Record<string, string> = {
  cod: "Thanh toán khi nhận hàng",
  momo: "Ví MoMo",
  vnpay: "VNPay",
  shopeepay: "ShopeePay",
  zalopay: "ZaloPay",
  bank_qr: "QR Ngân hàng",
};

export default function CheckoutSuccessPage() {
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem("lastOrder");
    if (data) {
      setOrder(JSON.parse(data));
    }
  }, []);

  const handleCopyOrder = () => {
    if (!order) return;
    navigator.clipboard?.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-xl font-bold mb-2">
            Không tìm thấy đơn hàng
          </h1>
          <p className="text-muted-foreground mb-6">
            Bạn chưa có đơn hàng nào gần đây.
          </p>
          <Button render={<Link href="/products" />}>
            Tiếp tục mua sắm
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-4">
          <Link
            href="/"
            className="text-xl font-bold font-heading"
          >
            Shop<span className="gradient-text">VN</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
        {/* Success Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4, type: "spring", bounce: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4"
          >
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl sm:text-3xl font-bold font-heading"
          >
            Đặt hàng thành công! 🎉
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground mt-2 max-w-md mx-auto"
          >
            Cảm ơn bạn đã mua sắm tại ShopVN. Đơn hàng của bạn đang được xử
            lý.
          </motion.p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card rounded-2xl border overflow-hidden"
        >
          {/* Order Number Banner */}
          <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-transparent px-5 sm:px-6 py-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                  Mã đơn hàng
                </p>
                <p className="text-lg sm:text-xl font-bold font-heading text-accent mt-0.5">
                  {order.orderNumber}
                </p>
              </div>
              <button
                onClick={handleCopyOrder}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-background hover:bg-secondary text-sm transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Đã sao chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Sao chép
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="px-5 sm:px-6 py-5 space-y-5">
            {/* Order Summary Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <Package className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Sản phẩm</p>
                  <p className="font-medium text-sm">
                    {order.itemCount} sản phẩm
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <CreditCard className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Phương thức thanh toán
                  </p>
                  <p className="font-medium text-sm">
                    {paymentMethodLabels[order.paymentMethod] ||
                      order.paymentMethod}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Giao đến</p>
                  <p className="font-medium text-sm">{order.shippingName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {order.shippingAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tổng thanh toán</p>
                  <p className="font-bold text-lg text-accent">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Expected Delivery */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/60">
              <Truck className="h-5 w-5 text-accent shrink-0" />
              <div>
                <p className="text-sm font-medium">
                  Dự kiến giao hàng
                </p>
                <p className="text-xs text-muted-foreground">
                  {order.shippingAddress.includes("TP. Hồ Chí Minh") ||
                  order.shippingAddress.includes("Hà Nội")
                    ? "1-2 ngày làm việc"
                    : "3-5 ngày làm việc"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 space-y-3"
        >
          <Button
            className="w-full h-12 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground text-base font-semibold gap-2"
            render={<Link href="/products" />}
          >
            Tiếp tục mua sắm
            <ArrowRight className="h-4 w-4" />
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-10 rounded-xl gap-2"
              render={<Link href="/" />}
            >
              Về trang chủ
            </Button>
            <Button
              variant="outline"
              className="h-10 rounded-xl gap-2"
              onClick={() => {
                window.location.href = "tel:19006868";
              }}
            >
              <Phone className="h-4 w-4" />
              Liên hệ hỗ trợ
            </Button>
          </div>
        </motion.div>

        {/* Helpful Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          <p>
            Bạn sẽ nhận được email xác nhận đơn hàng (nếu đã cung cấp).
          </p>
          <p className="mt-1">
            Mọi thắc mắc vui lòng liên hệ hotline{" "}
            <a
              href="tel:19006868"
              className="text-accent font-medium hover:underline"
            >
              1900 6868
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
