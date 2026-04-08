"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CouponType = "percentage" | "fixed" | "free_shipping";

export interface Coupon {
  code: string;
  type: CouponType;
  value: number; // percentage (0-100) or fixed amount in VND
  description: string;
  minOrder: number; // minimum order value to apply
  maxDiscount?: number; // max discount for percentage type
  expiresAt: string; // ISO date
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
  createdAt?: string;
}

// Default coupon dataset
const defaultCoupons: Coupon[] = [
  {
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    description: "Giảm 10% cho khách hàng mới",
    minOrder: 200000,
    maxDiscount: 100000,
    expiresAt: "2026-12-31T23:59:59Z",
    usageLimit: 1000,
    usageCount: 234,
    isActive: true,
    createdAt: "2026-01-15T00:00:00Z",
  },
  {
    code: "SALE50K",
    type: "fixed",
    value: 50000,
    description: "Giảm 50.000₫ cho đơn từ 300K",
    minOrder: 300000,
    expiresAt: "2026-12-31T23:59:59Z",
    usageLimit: 500,
    usageCount: 89,
    isActive: true,
    createdAt: "2026-02-01T00:00:00Z",
  },
  {
    code: "FREESHIP",
    type: "free_shipping",
    value: 0,
    description: "Miễn phí vận chuyển",
    minOrder: 0,
    expiresAt: "2026-12-31T23:59:59Z",
    usageLimit: 2000,
    usageCount: 567,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    code: "MEGA30",
    type: "percentage",
    value: 30,
    description: "Giảm 30% (tối đa 200K) cho đơn từ 500K",
    minOrder: 500000,
    maxDiscount: 200000,
    expiresAt: "2026-06-30T23:59:59Z",
    usageLimit: 200,
    usageCount: 150,
    isActive: true,
    createdAt: "2026-03-10T00:00:00Z",
  },
  {
    code: "VIP100K",
    type: "fixed",
    value: 100000,
    description: "Giảm 100.000₫ cho đơn từ 1 triệu",
    minOrder: 1000000,
    expiresAt: "2026-12-31T23:59:59Z",
    usageLimit: 100,
    usageCount: 23,
    isActive: true,
    createdAt: "2026-03-20T00:00:00Z",
  },
  {
    code: "EXPIRED20",
    type: "percentage",
    value: 20,
    description: "Mã đã hết hạn",
    minOrder: 100000,
    expiresAt: "2025-01-01T00:00:00Z",
    usageLimit: 100,
    usageCount: 100,
    isActive: false,
    createdAt: "2024-12-01T00:00:00Z",
  },
];

// --- Coupon Management Store (CRUD) ---

interface CouponManagementState {
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => boolean;
  updateCoupon: (code: string, data: Partial<Coupon>) => boolean;
  deleteCoupon: (code: string) => void;
  toggleCoupon: (code: string) => void;
  getCoupon: (code: string) => Coupon | undefined;
}

export const useCouponManagement = create<CouponManagementState>()(
  persist(
    (set, get) => ({
      coupons: defaultCoupons,

      addCoupon: (coupon) => {
        const existing = get().coupons.find(
          (c) => c.code.toUpperCase() === coupon.code.toUpperCase()
        );
        if (existing) return false;
        set({ coupons: [...get().coupons, { ...coupon, createdAt: coupon.createdAt || new Date().toISOString() }] });
        return true;
      },

      updateCoupon: (code, data) => {
        const coupons = get().coupons;
        const idx = coupons.findIndex(
          (c) => c.code.toUpperCase() === code.toUpperCase()
        );
        if (idx === -1) return false;
        const updated = [...coupons];
        updated[idx] = { ...updated[idx], ...data };
        set({ coupons: updated });
        return true;
      },

      deleteCoupon: (code) => {
        set({
          coupons: get().coupons.filter(
            (c) => c.code.toUpperCase() !== code.toUpperCase()
          ),
        });
      },

      toggleCoupon: (code) => {
        const coupons = get().coupons;
        set({
          coupons: coupons.map((c) =>
            c.code.toUpperCase() === code.toUpperCase()
              ? { ...c, isActive: !c.isActive }
              : c
          ),
        });
      },

      getCoupon: (code) => {
        return get().coupons.find(
          (c) => c.code.toUpperCase() === code.toUpperCase()
        );
      },
    }),
    {
      name: "shopvn-coupon-management",
    }
  )
);

// Backward-compatible helpers that read from the management store
export function findCoupon(code: string): Coupon | undefined {
  return useCouponManagement.getState().getCoupon(code);
}

// Legacy export for backward compat
export const coupons = defaultCoupons;

export type CouponError =
  | "NOT_FOUND"
  | "EXPIRED"
  | "INACTIVE"
  | "USAGE_LIMIT"
  | "MIN_ORDER"
  | null;

export function validateCoupon(
  code: string,
  subtotal: number
): { valid: boolean; coupon?: Coupon; error: CouponError } {
  const coupon = findCoupon(code);

  if (!coupon) {
    return { valid: false, error: "NOT_FOUND" };
  }

  if (!coupon.isActive) {
    return { valid: false, error: "INACTIVE" };
  }

  if (new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, error: "EXPIRED" };
  }

  if (coupon.usageCount >= coupon.usageLimit) {
    return { valid: false, error: "USAGE_LIMIT" };
  }

  if (subtotal < coupon.minOrder) {
    return { valid: false, error: "MIN_ORDER", coupon };
  }

  return { valid: true, coupon, error: null };
}

export function calculateDiscount(coupon: Coupon, subtotal: number): number {
  switch (coupon.type) {
    case "percentage": {
      const discount = Math.round((subtotal * coupon.value) / 100);
      return coupon.maxDiscount
        ? Math.min(discount, coupon.maxDiscount)
        : discount;
    }
    case "fixed":
      return coupon.value;
    case "free_shipping":
      return 0; // handled separately in shipping calculation
    default:
      return 0;
  }
}

export function getCouponErrorMessage(
  error: CouponError,
  coupon?: Coupon
): string {
  switch (error) {
    case "NOT_FOUND":
      return "Mã giảm giá không tồn tại";
    case "EXPIRED":
      return "Mã giảm giá đã hết hạn";
    case "INACTIVE":
      return "Mã giảm giá không còn hoạt động";
    case "USAGE_LIMIT":
      return "Mã giảm giá đã hết lượt sử dụng";
    case "MIN_ORDER":
      return `Đơn hàng tối thiểu ${new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }).format(coupon?.minOrder || 0)}`;
    default:
      return "";
  }
}

// --- Zustand Store ---

interface CouponState {
  appliedCoupon: Coupon | null;
  discountAmount: number;
  applyCoupon: (
    code: string,
    subtotal: number
  ) => { success: boolean; message: string };
  removeCoupon: () => void;
  recalculate: (subtotal: number) => void;
  isFreeShipping: () => boolean;
}

export const useCouponStore = create<CouponState>()(
  persist(
    (set, get) => ({
      appliedCoupon: null,
      discountAmount: 0,

      applyCoupon: (code, subtotal) => {
        const result = validateCoupon(code, subtotal);

        if (!result.valid) {
          return {
            success: false,
            message: getCouponErrorMessage(result.error, result.coupon),
          };
        }

        const coupon = result.coupon!;
        const discount = calculateDiscount(coupon, subtotal);

        set({ appliedCoupon: coupon, discountAmount: discount });

        if (coupon.type === "free_shipping") {
          return {
            success: true,
            message: `Áp dụng thành công: ${coupon.description}`,
          };
        }

        return {
          success: true,
          message: `Giảm ${new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
          }).format(discount)}`,
        };
      },

      removeCoupon: () => {
        set({ appliedCoupon: null, discountAmount: 0 });
      },

      recalculate: (subtotal) => {
        const { appliedCoupon } = get();
        if (!appliedCoupon) return;

        // Re-validate
        const result = validateCoupon(appliedCoupon.code, subtotal);
        if (!result.valid) {
          set({ appliedCoupon: null, discountAmount: 0 });
          return;
        }

        const discount = calculateDiscount(appliedCoupon, subtotal);
        set({ discountAmount: discount });
      },

      isFreeShipping: () => {
        const { appliedCoupon } = get();
        return appliedCoupon?.type === "free_shipping";
      },
    }),
    {
      name: "shopvn-coupon",
    }
  )
);
