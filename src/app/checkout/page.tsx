"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  CreditCard,
  ClipboardCheck,
  ShoppingBag,
  Check,
  Truck,
  Shield,
  Banknote,
  QrCode,
  Wallet,
  Smartphone,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCartStore } from "@/stores/cart-store";
import { useCheckoutStore, type PaymentMethod } from "@/stores/checkout-store";
import { useCouponStore } from "@/stores/coupon-store";
import { formatPrice, generateOrderNumber } from "@/lib/format";
import CouponInput from "@/components/storefront/CouponInput";

// Vietnamese provinces (simplified)
const provinces = [
  "TP. Hồ Chí Minh",
  "Hà Nội",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bạc Liêu",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Định",
  "Bình Dương",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cao Bằng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Tĩnh",
  "Hải Dương",
  "Hậu Giang",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Long An",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Phú Yên",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Tiền Giang",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
];

const paymentMethods: {
  id: PaymentMethod;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    id: "cod",
    name: "Thanh toán khi nhận hàng",
    description: "Thanh toán bằng tiền mặt khi nhận hàng",
    icon: <Banknote className="h-5 w-5" />,
    color: "text-emerald-600",
  },
  {
    id: "momo",
    name: "Ví MoMo",
    description: "Thanh toán qua ví điện tử MoMo",
    icon: <Wallet className="h-5 w-5" />,
    color: "text-pink-600",
  },
  {
    id: "vnpay",
    name: "VNPay",
    description: "Thanh toán qua cổng VNPay",
    icon: <CreditCard className="h-5 w-5" />,
    color: "text-blue-600",
  },
  {
    id: "shopeepay",
    name: "ShopeePay",
    description: "Thanh toán qua ví ShopeePay",
    icon: <Smartphone className="h-5 w-5" />,
    color: "text-orange-600",
  },
  {
    id: "zalopay",
    name: "ZaloPay",
    description: "Thanh toán qua ví ZaloPay",
    icon: <Wallet className="h-5 w-5" />,
    color: "text-sky-600",
  },
  {
    id: "bank_qr",
    name: "QR Ngân hàng",
    description: "Quét mã QR chuyển khoản ngân hàng",
    icon: <QrCode className="h-5 w-5" />,
    color: "text-violet-600",
  },
];

const steps = [
  { id: 1, label: "Thông tin", icon: MapPin },
  { id: 2, label: "Thanh toán", icon: CreditCard },
  { id: 3, label: "Xác nhận", icon: ClipboardCheck },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const {
    step,
    shipping,
    paymentMethod,
    setStep,
    setShipping,
    setPaymentMethod,
    reset,
  } = useCheckoutStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Show payment error from gateway redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    if (error) {
      toast.error(decodeURIComponent(error));
      window.history.replaceState({}, "", "/checkout");
    }
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/products");
    }
  }, [items, router]);

  const { appliedCoupon, discountAmount, removeCoupon } = useCouponStore();
  const isFreeShipping = useCouponStore((s) => s.isFreeShipping());

  if (items.length === 0) return null;

  const sub = subtotal();
  const shippingFee = isFreeShipping ? 0 : sub >= 500000 ? 0 : 30000;
  const total = sub - discountAmount + shippingFee;

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!shipping.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ tên";
    if (!shipping.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    else if (!/^(0[3-9]\d{8})$/.test(shipping.phone.trim()))
      newErrors.phone = "Số điện thoại không hợp lệ";
    if (shipping.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email))
      newErrors.email = "Email không hợp lệ";
    if (!shipping.province) newErrors.province = "Vui lòng chọn tỉnh/thành";
    if (!shipping.address.trim())
      newErrors.address = "Vui lòng nhập địa chỉ";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    setStep(Math.min(step + 1, 3));
  };

  const handleBack = () => {
    setStep(Math.max(step - 1, 1));
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    const orderNumber = generateOrderNumber();
    const shippingAddr = `${shipping.address}, ${shipping.ward ? shipping.ward + ", " : ""}${shipping.district ? shipping.district + ", " : ""}${shipping.province}`;

    // Store order info for success page (before any redirect)
    sessionStorage.setItem(
      "lastOrder",
      JSON.stringify({
        orderNumber,
        total,
        discount: discountAmount,
        couponCode: appliedCoupon?.code || null,
        itemCount: items.length,
        paymentMethod,
        shippingName: shipping.fullName,
        shippingAddress: shippingAddr,
      })
    );

    // ─── Payment Gateway Integration ───
    const isOnlinePayment = ["vnpay", "momo", "bank_qr", "shopeepay", "zalopay"].includes(paymentMethod);

    if (isOnlinePayment) {
      try {
        const res = await fetch("/api/payment/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            method: paymentMethod,
            orderId: orderNumber,
            amount: total,
            orderInfo: `Thanh toán đơn hàng ${orderNumber} - ShopVN`,
            customerName: shipping.fullName,
            customerEmail: shipping.email,
          }),
        });

        const data = await res.json();

        if (data.success && data.paymentUrl) {
          // Redirect to payment gateway
          window.location.href = data.paymentUrl;
          return;
        }

        if (data.success && !data.paymentUrl) {
          // Payment method handled server-side (e.g., simulated)
          // Continue to success
        } else {
          toast.error(data.error || "Không thể tạo thanh toán. Vui lòng thử lại.");
          setIsProcessing(false);
          return;
        }
      } catch {
        toast.error("Lỗi kết nối. Vui lòng thử lại.");
        setIsProcessing(false);
        return;
      }
    }

    // ─── COD or fallback: proceed directly ───
    // Simulate processing delay for COD
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Send order confirmation email (non-blocking)
    if (shipping.email) {
      const orderDate = new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date());

      const isUrban =
        shipping.province.includes("Hồ Chí Minh") ||
        shipping.province.includes("Hà Nội");

      fetch("/api/send-order-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber,
          customerName: shipping.fullName,
          customerEmail: shipping.email,
          items: items.map((item) => ({
            title: item.title,
            quantity: item.quantity,
            price: item.price,
            variant: item.variant,
            image: item.image,
          })),
          subtotal: sub,
          shippingFee,
          discount: discountAmount,
          total,
          paymentMethod,
          shippingAddress: {
            name: shipping.fullName,
            phone: shipping.phone,
            address: shipping.address,
            province: shipping.province,
          },
          estimatedDelivery: isUrban ? "1-2 ngày làm việc" : "3-5 ngày làm việc",
          orderDate,
        }),
      }).catch((err) => console.error("[Checkout] Email send failed:", err));
    }

    clearCart();
    removeCoupon();
    reset();
    router.push("/checkout/success");
  };

  const selectedPaymentInfo = paymentMethods.find(
    (m) => m.id === paymentMethod
  );

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Checkout Header */}
      <div className="bg-background border-b sticky top-0 z-40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-xl font-bold font-heading shrink-0"
            >
              Shop<span className="gradient-text">VN</span>
            </Link>

            {/* Step Indicator */}
            <div className="hidden sm:flex items-center gap-2">
              {steps.map((s, i) => (
                <div key={s.id} className="flex items-center">
                  <button
                    onClick={() => {
                      if (s.id < step) setStep(s.id);
                    }}
                    disabled={s.id > step}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      s.id === step
                        ? "bg-accent text-accent-foreground"
                        : s.id < step
                        ? "bg-accent/10 text-accent cursor-pointer hover:bg-accent/20"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {s.id < step ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <s.icon className="h-4 w-4" />
                    )}
                    {s.label}
                  </button>
                  {i < steps.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
                  )}
                </div>
              ))}
            </div>

            {/* Mobile step */}
            <div className="sm:hidden text-sm font-medium text-muted-foreground">
              Bước {step}/3
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid lg:grid-cols-[1fr,380px] gap-6 lg:gap-8">
          {/* Left Panel — Form */}
          <div>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-card rounded-2xl border p-5 sm:p-6">
                    <h2 className="text-xl font-bold font-heading flex items-center gap-2 mb-6">
                      <MapPin className="h-5 w-5 text-accent" />
                      Thông tin giao hàng
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div className="sm:col-span-2">
                        <Label htmlFor="fullName">
                          Họ và tên <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="fullName"
                          placeholder="Nguyễn Văn A"
                          value={shipping.fullName}
                          onChange={(e) =>
                            setShipping({ fullName: e.target.value })
                          }
                          className={`mt-1.5 h-10 rounded-xl ${errors.fullName ? "border-destructive" : ""}`}
                        />
                        {errors.fullName && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.fullName}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <Label htmlFor="phone">
                          Số điện thoại{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="0912 345 678"
                          value={shipping.phone}
                          onChange={(e) =>
                            setShipping({ phone: e.target.value })
                          }
                          className={`mt-1.5 h-10 rounded-xl ${errors.phone ? "border-destructive" : ""}`}
                        />
                        {errors.phone && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@example.com"
                          value={shipping.email}
                          onChange={(e) =>
                            setShipping({ email: e.target.value })
                          }
                          className={`mt-1.5 h-10 rounded-xl ${errors.email ? "border-destructive" : ""}`}
                        />
                        {errors.email && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <Separator className="sm:col-span-2 my-2" />

                      {/* Province */}
                      <div>
                        <Label>
                          Tỉnh/Thành phố{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={shipping.province}
                          onValueChange={(v) =>
                            v && setShipping({ province: v })
                          }
                        >
                          <SelectTrigger
                            className={`mt-1.5 h-10 w-full rounded-xl ${errors.province ? "border-destructive" : ""}`}
                          >
                            <SelectValue placeholder="Chọn tỉnh/thành" />
                          </SelectTrigger>
                          <SelectContent>
                            {provinces.map((p) => (
                              <SelectItem key={p} value={p}>
                                {p}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.province && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.province}
                          </p>
                        )}
                      </div>

                      {/* District */}
                      <div>
                        <Label htmlFor="district">Quận/Huyện</Label>
                        <Input
                          id="district"
                          placeholder="Quận 1"
                          value={shipping.district}
                          onChange={(e) =>
                            setShipping({ district: e.target.value })
                          }
                          className="mt-1.5 h-10 rounded-xl"
                        />
                      </div>

                      {/* Ward */}
                      <div>
                        <Label htmlFor="ward">Phường/Xã</Label>
                        <Input
                          id="ward"
                          placeholder="Phường Bến Nghé"
                          value={shipping.ward}
                          onChange={(e) =>
                            setShipping({ ward: e.target.value })
                          }
                          className="mt-1.5 h-10 rounded-xl"
                        />
                      </div>

                      {/* Address */}
                      <div>
                        <Label htmlFor="address">
                          Địa chỉ chi tiết{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="address"
                          placeholder="Số nhà, tên đường..."
                          value={shipping.address}
                          onChange={(e) =>
                            setShipping({ address: e.target.value })
                          }
                          className={`mt-1.5 h-10 rounded-xl ${errors.address ? "border-destructive" : ""}`}
                        />
                        {errors.address && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.address}
                          </p>
                        )}
                      </div>

                      {/* Note */}
                      <div className="sm:col-span-2">
                        <Label htmlFor="note">Ghi chú đơn hàng</Label>
                        <Textarea
                          id="note"
                          placeholder="Ghi chú cho người bán hoặc shipper..."
                          value={shipping.note}
                          onChange={(e) =>
                            setShipping({ note: e.target.value })
                          }
                          className="mt-1.5 rounded-xl min-h-[80px]"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-card rounded-2xl border p-5 sm:p-6">
                    <h2 className="text-xl font-bold font-heading flex items-center gap-2 mb-6">
                      <CreditCard className="h-5 w-5 text-accent" />
                      Phương thức thanh toán
                    </h2>

                    <div className="grid gap-3">
                      {paymentMethods.map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                            paymentMethod === method.id
                              ? "border-accent bg-accent/5 shadow-sm"
                              : "border-border hover:border-accent/40 hover:bg-secondary/50"
                          }`}
                        >
                          <div
                            className={`flex items-center justify-center w-10 h-10 rounded-xl ${
                              paymentMethod === method.id
                                ? "bg-accent/10"
                                : "bg-secondary"
                            } ${method.color}`}
                          >
                            {method.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">
                              {method.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {method.description}
                            </p>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                              paymentMethod === method.id
                                ? "border-accent bg-accent"
                                : "border-muted-foreground/30"
                            }`}
                          >
                            {paymentMethod === method.id && (
                              <Check className="h-3 w-3 text-accent-foreground" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Payment Note */}
                    {paymentMethod !== "cod" && (
                      <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                          💡 Sau khi đặt hàng, bạn sẽ được chuyển đến trang
                          thanh toán của{" "}
                          <span className="font-medium">
                            {selectedPaymentInfo?.name}
                          </span>{" "}
                          để hoàn tất giao dịch.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-4">
                    {/* Shipping Review */}
                    <div className="bg-card rounded-2xl border p-5 sm:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-accent" />
                          Địa chỉ giao hàng
                        </h3>
                        <button
                          onClick={() => setStep(1)}
                          className="text-xs text-accent hover:underline"
                        >
                          Thay đổi
                        </button>
                      </div>
                      <div className="text-sm space-y-1">
                        <p className="font-medium">{shipping.fullName}</p>
                        <p className="text-muted-foreground">
                          {shipping.phone}
                        </p>
                        {shipping.email && (
                          <p className="text-muted-foreground">
                            {shipping.email}
                          </p>
                        )}
                        <p className="text-muted-foreground">
                          {shipping.address}
                          {shipping.ward && `, ${shipping.ward}`}
                          {shipping.district && `, ${shipping.district}`}
                          {shipping.province && `, ${shipping.province}`}
                        </p>
                        {shipping.note && (
                          <p className="text-muted-foreground italic">
                            &quot;{shipping.note}&quot;
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Payment Review */}
                    <div className="bg-card rounded-2xl border p-5 sm:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-accent" />
                          Thanh toán
                        </h3>
                        <button
                          onClick={() => setStep(2)}
                          className="text-xs text-accent hover:underline"
                        >
                          Thay đổi
                        </button>
                      </div>
                      {selectedPaymentInfo && (
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex items-center justify-center w-10 h-10 rounded-xl bg-secondary ${selectedPaymentInfo.color}`}
                          >
                            {selectedPaymentInfo.icon}
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {selectedPaymentInfo.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {selectedPaymentInfo.description}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Items Review */}
                    <div className="bg-card rounded-2xl border p-5 sm:p-6">
                      <h3 className="font-semibold flex items-center gap-2 mb-4">
                        <ShoppingBag className="h-4 w-4 text-accent" />
                        Sản phẩm ({items.length})
                      </h3>
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-3 items-center"
                          >
                            <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-secondary shrink-0">
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover"
                                sizes="56px"
                              />
                              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {item.quantity}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {item.title}
                              </p>
                              {item.variant && (
                                <p className="text-xs text-muted-foreground">
                                  {item.variant}
                                </p>
                              )}
                            </div>
                            <p className="text-sm font-semibold shrink-0">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6">
              {step > 1 ? (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="rounded-xl gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Quay lại
                </Button>
              ) : (
                <Button
                  variant="outline"
                  render={<Link href="/products" />}
                  className="rounded-xl gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Tiếp tục mua sắm
                </Button>
              )}

              {step < 3 ? (
                <Button
                  onClick={handleNext}
                  className="rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground gap-1"
                >
                  Tiếp tục
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground gap-1 min-w-[160px]"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                      />
                      Đang xử lý...
                    </div>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Đặt hàng
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Right Panel — Order Summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-card rounded-2xl border p-5 sm:p-6">
              <h3 className="font-bold font-heading text-lg mb-4">
                Tóm tắt đơn hàng
              </h3>

              {/* Cart Items */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                      <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium line-clamp-2">
                        {item.title}
                      </p>
                    </div>
                    <p className="text-xs font-semibold shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Pricing */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>{formatPrice(sub)}</span>
                </div>

                {/* Coupon Discount */}
                {appliedCoupon && discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      Giảm giá
                      <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-900/50 px-1 rounded">
                        {appliedCoupon.code}
                      </span>
                    </span>
                    <span className="font-medium">-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span
                    className={
                      shippingFee === 0
                        ? "text-emerald-600 font-medium"
                        : ""
                    }
                  >
                    {shippingFee === 0
                      ? "Miễn phí"
                      : formatPrice(shippingFee)}
                  </span>
                </div>
                {isFreeShipping && appliedCoupon && (
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                    🎉 Miễn phí ship với mã {appliedCoupon.code}
                  </p>
                )}
                {!isFreeShipping && shippingFee > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Miễn phí ship cho đơn từ {formatPrice(500000)}
                  </p>
                )}
              </div>

              {/* Coupon Input */}
              <div className="my-4">
                <CouponInput />
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center">
                <span className="font-bold text-base">Tổng cộng</span>
                <span className="font-bold text-xl text-accent">
                  {formatPrice(total)}
                </span>
              </div>

              {/* Trust badges */}
              <div className="mt-5 pt-4 border-t space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-4 w-4 text-accent shrink-0" />
                  <span>Bảo mật thông tin thanh toán</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Truck className="h-4 w-4 text-accent shrink-0" />
                  <span>Giao hàng toàn quốc 1-5 ngày</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ShoppingBag className="h-4 w-4 text-accent shrink-0" />
                  <span>Đổi trả miễn phí trong 30 ngày</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
