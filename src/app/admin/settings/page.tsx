"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Store,
  Globe,
  Bell,
  Truck,
  CreditCard,
  Shield,
  Save,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    toast.success("Đã lưu cài đặt!");
    setTimeout(() => setSaved(false), 2000);
  };

  const Section = ({
    icon: Icon,
    title,
    description,
    children,
  }: {
    icon: React.ElementType;
    title: string;
    description: string;
    children: React.ReactNode;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border p-5 sm:p-6"
    >
      <div className="flex items-start gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
          <Icon className="h-[18px] w-[18px] text-accent" />
        </div>
        <div>
          <h2 className="font-semibold font-heading">{title}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading">Cài đặt</h1>
          <p className="text-sm text-muted-foreground">
            Cấu hình cửa hàng của bạn
          </p>
        </div>
        <Button
          onClick={handleSave}
          className="rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground gap-1.5"
        >
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? "Đã lưu" : "Lưu thay đổi"}
        </Button>
      </div>

      {/* Store Info */}
      <Section
        icon={Store}
        title="Thông tin cửa hàng"
        description="Thông tin cơ bản hiển thị trên cửa hàng"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label htmlFor="storeName">Tên cửa hàng</Label>
            <Input
              id="storeName"
              defaultValue="ShopVN"
              className="mt-1.5 h-10 rounded-xl"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="storeDesc">Mô tả</Label>
            <Textarea
              id="storeDesc"
              defaultValue="Nền tảng mua sắm trực tuyến hàng đầu Việt Nam"
              className="mt-1.5 rounded-xl min-h-[80px]"
            />
          </div>
          <div>
            <Label htmlFor="storeEmail">Email liên hệ</Label>
            <Input
              id="storeEmail"
              type="email"
              defaultValue="support@shopvn.vn"
              className="mt-1.5 h-10 rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="storePhone">Số điện thoại</Label>
            <Input
              id="storePhone"
              defaultValue="1900 6868"
              className="mt-1.5 h-10 rounded-xl"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="storeAddress">Địa chỉ</Label>
            <Input
              id="storeAddress"
              defaultValue="123 Nguyễn Huệ, Q.1, TP. Hồ Chí Minh"
              className="mt-1.5 h-10 rounded-xl"
            />
          </div>
        </div>
      </Section>

      {/* Shipping */}
      <Section
        icon={Truck}
        title="Vận chuyển"
        description="Cách tính phí giao hàng"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="shippingFee">Phí ship mặc định</Label>
            <Input
              id="shippingFee"
              type="number"
              defaultValue="30000"
              className="mt-1.5 h-10 rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="freeShipMin">
              Miễn phí ship từ (VNĐ)
            </Label>
            <Input
              id="freeShipMin"
              type="number"
              defaultValue="500000"
              className="mt-1.5 h-10 rounded-xl"
            />
          </div>
        </div>
      </Section>

      {/* Payment */}
      <Section
        icon={CreditCard}
        title="Thanh toán"
        description="Phương thức thanh toán được chấp nhận"
      >
        <div className="space-y-3">
          {[
            { name: "COD — Thanh toán khi nhận hàng", enabled: true },
            { name: "Ví MoMo", enabled: true },
            { name: "VNPay", enabled: true },
            { name: "ShopeePay", enabled: true },
            { name: "ZaloPay", enabled: true },
            { name: "QR Ngân hàng", enabled: true },
          ].map((method, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl border"
            >
              <span className="text-sm">{method.name}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={method.enabled}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-secondary rounded-full peer peer-checked:bg-accent transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
              </label>
            </div>
          ))}
        </div>
      </Section>

      {/* Notifications */}
      <Section
        icon={Bell}
        title="Thông báo"
        description="Cấu hình thông báo email"
      >
        <div className="space-y-3">
          {[
            { name: "Đơn hàng mới", enabled: true },
            { name: "Đơn hàng bị hủy", enabled: true },
            { name: "Đánh giá sản phẩm mới", enabled: false },
            { name: "Tồn kho thấp (dưới 10)", enabled: true },
          ].map((notif, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl border"
            >
              <span className="text-sm">{notif.name}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={notif.enabled}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-secondary rounded-full peer peer-checked:bg-accent transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
              </label>
            </div>
          ))}
        </div>
      </Section>

      {/* Security */}
      <Section
        icon={Shield}
        title="Bảo mật"
        description="Quản lý mật khẩu và quyền truy cập"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="currentPw">Mật khẩu hiện tại</Label>
            <Input
              id="currentPw"
              type="password"
              placeholder="••••••••"
              className="mt-1.5 h-10 rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="newPw">Mật khẩu mới</Label>
            <Input
              id="newPw"
              type="password"
              placeholder="••••••••"
              className="mt-1.5 h-10 rounded-xl"
            />
          </div>
        </div>
      </Section>
    </div>
  );
}
