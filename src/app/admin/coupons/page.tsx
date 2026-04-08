"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Ticket,
  ToggleLeft,
  ToggleRight,
  Copy,
  X,
  CalendarDays,
  Percent,
  DollarSign,
  Truck,
  AlertCircle,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  useCouponManagement,
  type Coupon,
  type CouponType,
} from "@/stores/coupon-store";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";

// ========== Type Helpers ==========

const typeLabels: Record<CouponType, string> = {
  percentage: "Phần trăm",
  fixed: "Cố định (VNĐ)",
  free_shipping: "Miễn phí ship",
};

const typeIcons: Record<CouponType, React.ElementType> = {
  percentage: Percent,
  fixed: DollarSign,
  free_shipping: Truck,
};

const typeColors: Record<CouponType, string> = {
  percentage: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  fixed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  free_shipping: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
};

function formatCouponValue(coupon: Coupon): string {
  switch (coupon.type) {
    case "percentage":
      return `-${coupon.value}%${coupon.maxDiscount ? ` (tối đa ${formatPrice(coupon.maxDiscount)})` : ""}`;
    case "fixed":
      return `-${formatPrice(coupon.value)}`;
    case "free_shipping":
      return "Miễn phí ship";
  }
}

function isExpired(coupon: Coupon): boolean {
  return new Date(coupon.expiresAt) < new Date();
}

// ========== Coupon Form Modal ==========

interface CouponFormProps {
  coupon?: Coupon | null;
  onSave: (data: Coupon) => void;
  onClose: () => void;
}

function CouponFormModal({ coupon, onSave, onClose }: CouponFormProps) {
  const isEdit = Boolean(coupon);
  const [form, setForm] = useState<Coupon>({
    code: coupon?.code || "",
    type: coupon?.type || "percentage",
    value: coupon?.value || 0,
    description: coupon?.description || "",
    minOrder: coupon?.minOrder || 0,
    maxDiscount: coupon?.maxDiscount || undefined,
    expiresAt: coupon?.expiresAt
      ? new Date(coupon.expiresAt).toISOString().slice(0, 16)
      : new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 16),
    usageLimit: coupon?.usageLimit || 100,
    usageCount: coupon?.usageCount || 0,
    isActive: coupon?.isActive ?? true,
    createdAt: coupon?.createdAt,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.code.trim()) e.code = "Mã không được để trống";
    if (form.code.includes(" ")) e.code = "Mã không được có khoảng trắng";
    if (!form.description.trim()) e.description = "Mô tả không được để trống";
    if (form.type === "percentage" && (form.value < 1 || form.value > 100))
      e.value = "Phần trăm phải từ 1-100";
    if (form.type === "fixed" && form.value < 1000) e.value = "Giá trị tối thiểu 1.000₫";
    if (form.usageLimit < 1) e.usageLimit = "Giới hạn tối thiểu 1";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...form,
      code: form.code.toUpperCase().trim(),
      expiresAt: new Date(form.expiresAt).toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-card rounded-2xl border shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-card border-b px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-lg font-bold font-heading flex items-center gap-2">
            <Ticket className="h-5 w-5 text-accent" />
            {isEdit ? "Chỉnh sửa mã giảm giá" : "Thêm mã giảm giá mới"}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-secondary transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Code */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Mã giảm giá *</label>
            <Input
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="VD: SUMMER25"
              disabled={isEdit}
              className={`font-mono uppercase ${errors.code ? "border-red-500" : ""}`}
            />
            {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code}</p>}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Loại giảm giá *</label>
            <div className="grid grid-cols-3 gap-2">
              {(["percentage", "fixed", "free_shipping"] as CouponType[]).map((t) => {
                const Icon = typeIcons[t];
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, type: t, value: t === "free_shipping" ? 0 : form.value })}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-xs font-medium transition-all ${
                      form.type === t
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border hover:border-accent/40"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {typeLabels[t]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Value + Max Discount */}
          {form.type !== "free_shipping" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  {form.type === "percentage" ? "Phần trăm giảm (%)" : "Số tiền giảm (VNĐ)"} *
                </label>
                <Input
                  type="number"
                  value={form.value || ""}
                  onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                  placeholder={form.type === "percentage" ? "10" : "50000"}
                  className={errors.value ? "border-red-500" : ""}
                />
                {errors.value && <p className="text-xs text-red-500 mt-1">{errors.value}</p>}
              </div>
              {form.type === "percentage" && (
                <div>
                  <label className="block text-sm font-medium mb-1.5">Giảm tối đa (VNĐ)</label>
                  <Input
                    type="number"
                    value={form.maxDiscount || ""}
                    onChange={(e) =>
                      setForm({ ...form, maxDiscount: Number(e.target.value) || undefined })
                    }
                    placeholder="100000"
                  />
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Mô tả *</label>
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="VD: Giảm 25% cho đơn từ 300K"
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          {/* Min Order + Usage Limit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Đơn tối thiểu (VNĐ)</label>
              <Input
                type="number"
                value={form.minOrder || ""}
                onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })}
                placeholder="200000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Giới hạn sử dụng *</label>
              <Input
                type="number"
                value={form.usageLimit || ""}
                onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })}
                placeholder="100"
                className={errors.usageLimit ? "border-red-500" : ""}
              />
              {errors.usageLimit && <p className="text-xs text-red-500 mt-1">{errors.usageLimit}</p>}
            </div>
          </div>

          {/* Expiry */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Ngày hết hạn *</label>
            <Input
              type="datetime-local"
              value={form.expiresAt.slice(0, 16)}
              onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
            />
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-secondary/50">
            <span className="text-sm font-medium">Kích hoạt</span>
            <button
              type="button"
              onClick={() => setForm({ ...form, isActive: !form.isActive })}
              className="text-2xl"
            >
              {form.isActive ? (
                <ToggleRight className="h-8 w-8 text-emerald-500" />
              ) : (
                <ToggleLeft className="h-8 w-8 text-muted-foreground" />
              )}
            </button>
          </div>

          <Separator />

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" className="flex-1 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground">
              {isEdit ? "Cập nhật" : "Tạo mã giảm giá"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ========== Main Admin Coupons Page ==========

type FilterTab = "all" | "active" | "inactive" | "expired";

export default function AdminCouponsPage() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, toggleCoupon } = useCouponManagement();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<FilterTab>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Filter & search
  const filtered = useMemo(() => {
    let list = coupons;

    // Tab filter
    switch (tab) {
      case "active":
        list = list.filter((c) => c.isActive && !isExpired(c));
        break;
      case "inactive":
        list = list.filter((c) => !c.isActive);
        break;
      case "expired":
        list = list.filter((c) => isExpired(c));
        break;
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.code.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    return list;
  }, [coupons, tab, search]);

  // Stats
  const stats = useMemo(() => ({
    total: coupons.length,
    active: coupons.filter((c) => c.isActive && !isExpired(c)).length,
    inactive: coupons.filter((c) => !c.isActive).length,
    expired: coupons.filter((c) => isExpired(c)).length,
  }), [coupons]);

  const handleSave = (data: Coupon) => {
    if (editingCoupon) {
      updateCoupon(editingCoupon.code, data);
      toast.success(`Đã cập nhật mã ${data.code}`);
    } else {
      const ok = addCoupon(data);
      if (!ok) {
        toast.error(`Mã ${data.code} đã tồn tại!`);
        return;
      }
      toast.success(`Đã tạo mã ${data.code}`);
    }
    setShowForm(false);
    setEditingCoupon(null);
  };

  const handleDelete = (code: string) => {
    deleteCoupon(code);
    setDeleteConfirm(null);
    toast.success(`Đã xóa mã ${code}`);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Đã sao chép: ${code}`);
  };

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "Tất cả", count: stats.total },
    { key: "active", label: "Đang hoạt động", count: stats.active },
    { key: "inactive", label: "Tắt", count: stats.inactive },
    { key: "expired", label: "Hết hạn", count: stats.expired },
  ];

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-secondary rounded-xl animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-secondary rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-secondary rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading flex items-center gap-2">
            <Ticket className="h-6 w-6 text-accent" />
            Mã giảm giá
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Quản lý coupon & chương trình khuyến mãi
          </p>
        </div>
        <Button
          onClick={() => { setEditingCoupon(null); setShowForm(true); }}
          className="rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm mã giảm giá
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Tổng mã", value: stats.total, color: "text-foreground", bg: "bg-secondary" },
          { label: "Đang hoạt động", value: stats.active, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          { label: "Đã tắt", value: stats.inactive, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20" },
          { label: "Hết hạn", value: stats.expired, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 border`}>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color} mt-1`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 bg-secondary/50 rounded-xl p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                tab === t.key
                  ? "bg-card shadow text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
              <span className="ml-1 text-[10px] opacity-60">({t.count})</span>
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm mã giảm giá..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl"
          />
        </div>
      </div>

      {/* Coupon Table */}
      <div className="bg-card border rounded-2xl overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[1fr_120px_140px_100px_120px_100px_80px] gap-3 px-5 py-3 bg-secondary/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <span>Mã / Mô tả</span>
          <span>Loại</span>
          <span>Giá trị</span>
          <span>Đơn tối thiểu</span>
          <span>Sử dụng</span>
          <span>Hết hạn</span>
          <span className="text-right">Thao tác</span>
        </div>

        {/* Rows */}
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
            >
              <Ticket className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">Không tìm thấy mã giảm giá</p>
            </motion.div>
          ) : (
            filtered.map((coupon) => {
              const expired = isExpired(coupon);
              const TypeIcon = typeIcons[coupon.type];
              const usagePercent = Math.round((coupon.usageCount / coupon.usageLimit) * 100);

              return (
                <motion.div
                  key={coupon.code}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`border-b last:border-0 px-5 py-4 hover:bg-secondary/30 transition-colors ${
                    !coupon.isActive || expired ? "opacity-60" : ""
                  }`}
                >
                  {/* Desktop */}
                  <div className="hidden md:grid grid-cols-[1fr_120px_140px_100px_120px_100px_80px] gap-3 items-center">
                    {/* Code + Description */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="shrink-0">
                        <button
                          onClick={() => handleCopy(coupon.code)}
                          className="font-mono text-sm font-bold bg-secondary px-2.5 py-1 rounded-lg hover:bg-accent/10 transition-colors flex items-center gap-1.5 group"
                        >
                          {coupon.code}
                          <Copy className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{coupon.description}</p>
                    </div>

                    {/* Type */}
                    <Badge className={`${typeColors[coupon.type]} text-[10px] font-medium justify-center gap-1`}>
                      <TypeIcon className="h-3 w-3" />
                      {typeLabels[coupon.type]}
                    </Badge>

                    {/* Value */}
                    <span className="text-sm font-semibold">{formatCouponValue(coupon)}</span>

                    {/* Min Order */}
                    <span className="text-xs text-muted-foreground">
                      {coupon.minOrder > 0 ? formatPrice(coupon.minOrder) : "—"}
                    </span>

                    {/* Usage */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span>{coupon.usageCount}/{coupon.usageLimit}</span>
                        <span className="text-muted-foreground">{usagePercent}%</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            usagePercent >= 90 ? "bg-red-500" : usagePercent >= 50 ? "bg-orange-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${Math.min(usagePercent, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Expiry */}
                    <div className="text-xs">
                      {expired ? (
                        <Badge variant="destructive" className="text-[10px]">Hết hạn</Badge>
                      ) : (
                        <span className="text-muted-foreground">
                          {new Date(coupon.expiresAt).toLocaleDateString("vi-VN")}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => toggleCoupon(coupon.code)}
                        title={coupon.isActive ? "Tắt" : "Bật"}
                        className={`p-1.5 rounded-lg transition-colors ${
                          coupon.isActive
                            ? "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                            : "text-muted-foreground hover:bg-secondary"
                        }`}
                      >
                        {coupon.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => { setEditingCoupon(coupon); setShowForm(true); }}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(coupon.code)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Mobile */}
                  <div className="md:hidden space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <button
                          onClick={() => handleCopy(coupon.code)}
                          className="font-mono text-sm font-bold flex items-center gap-1.5"
                        >
                          {coupon.code}
                          <Copy className="h-3 w-3 text-muted-foreground" />
                        </button>
                        <p className="text-xs text-muted-foreground mt-0.5">{coupon.description}</p>
                      </div>
                      <Badge className={`${typeColors[coupon.type]} text-[10px]`}>
                        {typeLabels[coupon.type]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="font-semibold">{formatCouponValue(coupon)}</span>
                      {coupon.minOrder > 0 && (
                        <span className="text-muted-foreground">Đơn từ {formatPrice(coupon.minOrder)}</span>
                      )}
                      <span className="text-muted-foreground">{coupon.usageCount}/{coupon.usageLimit} dùng</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCoupon(coupon.code)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          coupon.isActive
                            ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                            : "bg-secondary text-muted-foreground border-border"
                        }`}
                      >
                        {coupon.isActive ? "Đang bật" : "Đã tắt"}
                      </button>
                      <button
                        onClick={() => { setEditingCoupon(coupon); setShowForm(true); }}
                        className="p-2 rounded-lg border hover:bg-secondary transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(coupon.code)}
                        className="p-2 rounded-lg border hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <CouponFormModal
            coupon={editingCoupon}
            onSave={handleSave}
            onClose={() => { setShowForm(false); setEditingCoupon(null); }}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setDeleteConfirm(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-card rounded-2xl border shadow-2xl p-6 w-full max-w-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold">Xóa mã giảm giá?</h3>
                  <p className="text-sm text-muted-foreground">
                    Mã <span className="font-mono font-bold">{deleteConfirm}</span> sẽ bị xóa vĩnh viễn.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setDeleteConfirm(null)}>
                  Hủy
                </Button>
                <Button
                  className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleDelete(deleteConfirm)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
