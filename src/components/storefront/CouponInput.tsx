"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, X, Check, Loader2, Ticket, Percent, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCouponStore } from "@/stores/coupon-store";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/format";

export default function CouponInput({ compact = false }: { compact?: boolean }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const subtotal = useCartStore((s) => s.subtotal());
  const { appliedCoupon, discountAmount, applyCoupon, removeCoupon } =
    useCouponStore();

  const handleApply = async () => {
    if (!code.trim()) return;

    setLoading(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600));

    const result = applyCoupon(code.trim(), subtotal);

    if (result.success) {
      toast.success("Áp dụng mã giảm giá thành công!", {
        description: result.message,
      });
      setCode("");
      setShowInput(false);
    } else {
      toast.error("Không thể áp dụng mã giảm giá", {
        description: result.message,
      });
    }

    setLoading(false);
  };

  const handleRemove = () => {
    removeCoupon();
    toast.info("Đã xóa mã giảm giá");
  };

  const getCouponIcon = () => {
    if (!appliedCoupon) return <Tag className="h-3.5 w-3.5" />;
    switch (appliedCoupon.type) {
      case "percentage":
        return <Percent className="h-3.5 w-3.5" />;
      case "free_shipping":
        return <Truck className="h-3.5 w-3.5" />;
      default:
        return <Ticket className="h-3.5 w-3.5" />;
    }
  };

  // If a coupon is applied, show the applied state
  if (appliedCoupon) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-3"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="shrink-0 w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              {getCouponIcon()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                  {appliedCoupon.code}
                </span>
                <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 truncate">
                {appliedCoupon.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {discountAmount > 0 && (
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                -{formatPrice(discountAmount)}
              </span>
            )}
            <button
              onClick={handleRemove}
              className="h-6 w-6 rounded-full bg-emerald-200/50 dark:bg-emerald-800/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
              title="Xóa mã giảm giá"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Compact toggle for cart drawer
  if (compact && !showInput) {
    return (
      <button
        onClick={() => setShowInput(true)}
        className="flex items-center gap-2 text-xs text-accent hover:text-accent/80 font-medium transition-colors w-full py-1.5"
      >
        <Tag className="h-3.5 w-3.5" />
        Nhập mã giảm giá
      </button>
    );
  }

  // Input form
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="overflow-hidden"
      >
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleApply();
              }}
              placeholder="Nhập mã giảm giá"
              className="w-full h-9 pl-9 pr-3 text-xs rounded-lg border bg-background focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all uppercase tracking-wider font-medium placeholder:normal-case placeholder:tracking-normal placeholder:font-normal"
              maxLength={20}
              disabled={loading}
            />
          </div>
          <Button
            size="sm"
            onClick={handleApply}
            disabled={!code.trim() || loading}
            className="rounded-lg bg-accent hover:bg-accent/90 text-accent-foreground px-4 h-9 text-xs font-semibold shrink-0"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              "Áp dụng"
            )}
          </Button>
          {compact && (
            <button
              onClick={() => {
                setShowInput(false);
                setCode("");
              }}
              className="h-9 w-9 rounded-lg border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Quick coupon suggestions */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {["WELCOME10", "SALE50K", "FREESHIP"].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setCode(suggestion)}
              className="text-[10px] px-2 py-1 rounded-md bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground font-mono font-medium transition-colors border border-transparent hover:border-accent/30"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
