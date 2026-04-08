"use client";

import { useEffect, useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Package,
  MapPin,
  LogOut,
  Loader2,
  Save,
  Check,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  Heart,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { updateProfile, logout, type AuthResult } from "@/app/actions/auth";
import { orders, getOrderStatusLabel, getOrderStatusColor } from "@/lib/mock-admin-data";
import { formatPrice, formatDate } from "@/lib/format";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

type Tab = "profile" | "orders" | "addresses";

const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "profile", label: "Hồ sơ", icon: User },
  { key: "orders", label: "Đơn hàng", icon: Package },
  { key: "addresses", label: "Địa chỉ", icon: MapPin },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [user, setUser] = useState<{
    email?: string;
    user_metadata?: { full_name?: string; phone?: string };
    created_at?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  const name = user?.user_metadata?.full_name || "Người dùng";
  const email = user?.email || "";
  const phone = user?.user_metadata?.phone || "";
  const initials = name
    .split(" ")
    .slice(-2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-3xl border p-6 sm:p-8 mb-6"
      >
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center text-accent font-bold text-xl">
            {initials}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-xl font-bold font-heading">{name}</h1>
            <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
              <Mail className="h-3.5 w-3.5" />
              {email}
            </p>
          </div>
          <form action={logout}>
            <Button
              type="submit"
              variant="outline"
              className="rounded-xl text-sm gap-1.5"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </Button>
          </form>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <ShoppingBag className="h-3.5 w-3.5" />
              <span className="text-xs">Đơn hàng</span>
            </div>
            <p className="text-lg font-bold">{orders.length}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Heart className="h-3.5 w-3.5" />
              <span className="text-xs">Yêu thích</span>
            </div>
            <p className="text-lg font-bold">0</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-xs">Tham gia</span>
            </div>
            <p className="text-lg font-bold">
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString("vi-VN", {
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? "bg-accent text-accent-foreground"
                : "bg-card border text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === "profile" && (
          <ProfileTab name={name} email={email} phone={phone} />
        )}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "addresses" && <AddressesTab />}
      </motion.div>
    </div>
  );
}

// --- Profile Tab ---
function ProfileTab({
  name,
  email,
  phone,
}: {
  name: string;
  email: string;
  phone: string;
}) {
  const [state, formAction, pending] = useActionState(updateProfile, undefined);

  useEffect(() => {
    if (state?.success) toast.success(state.success);
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <div className="bg-card rounded-2xl border p-6">
      <h2 className="font-semibold font-heading mb-5">Thông tin cá nhân</h2>
      <form action={formAction} className="space-y-4 max-w-lg">
        <div>
          <Label htmlFor="name">Họ và tên</Label>
          <Input
            id="name"
            name="name"
            defaultValue={name}
            className="mt-1.5 h-10 rounded-xl"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={email}
            disabled
            className="mt-1.5 h-10 rounded-xl bg-secondary"
          />
          <p className="text-[10px] text-muted-foreground mt-1">
            Email không thể thay đổi
          </p>
        </div>
        <div>
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input
            id="phone"
            name="phone"
            defaultValue={phone}
            placeholder="0912345678"
            className="mt-1.5 h-10 rounded-xl"
          />
        </div>
        <Button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground gap-1.5"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Save className="h-4 w-4" />
              Lưu thay đổi
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

// --- Orders Tab ---
function OrdersTab() {
  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-card rounded-2xl border p-4 sm:p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {order.items.slice(0, 2).map((item, i) => (
                  <div
                    key={i}
                    className="relative w-10 h-10 rounded-lg overflow-hidden border-2 border-card bg-secondary"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold">{order.orderNumber}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(order.createdAt)} •{" "}
                  {order.items.length} sản phẩm
                </p>
              </div>
            </div>
            <div className="text-right">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${getOrderStatusColor(
                  order.status
                )}`}
              >
                {getOrderStatusLabel(order.status)}
              </span>
              <p className="text-sm font-bold mt-1">
                {formatPrice(order.total)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Addresses Tab ---
function AddressesTab() {
  const [addresses] = useState([
    {
      id: "1",
      name: "Nhà riêng",
      address: "123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
      phone: "0912345678",
      isDefault: true,
    },
  ]);

  return (
    <div className="space-y-3">
      {addresses.map((addr) => (
        <div
          key={addr.id}
          className="bg-card rounded-2xl border p-5"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold">{addr.name}</h3>
                {addr.isDefault && (
                  <Badge
                    variant="outline"
                    className="text-[10px] border-accent text-accent"
                  >
                    Mặc định
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{addr.address}</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {addr.phone}
              </p>
            </div>
            <Button variant="outline" size="sm" className="rounded-lg text-xs">
              Sửa
            </Button>
          </div>
        </div>
      ))}

      <Button
        variant="outline"
        className="w-full rounded-xl border-dashed h-12 text-sm text-muted-foreground"
      >
        <MapPin className="h-4 w-4 mr-1.5" />
        Thêm địa chỉ mới
      </Button>
    </div>
  );
}
