"use client";

import { create } from "zustand";

export interface ShippingInfo {
  fullName: string;
  phone: string;
  email: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  note: string;
}

export type PaymentMethod =
  | "cod"
  | "momo"
  | "vnpay"
  | "shopeepay"
  | "zalopay"
  | "bank_qr";

export interface CheckoutState {
  step: number;
  shipping: ShippingInfo;
  paymentMethod: PaymentMethod;
  setStep: (step: number) => void;
  setShipping: (data: Partial<ShippingInfo>) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  reset: () => void;
}

const initialShipping: ShippingInfo = {
  fullName: "",
  phone: "",
  email: "",
  province: "",
  district: "",
  ward: "",
  address: "",
  note: "",
};

export const useCheckoutStore = create<CheckoutState>()((set) => ({
  step: 1,
  shipping: initialShipping,
  paymentMethod: "cod",

  setStep: (step) => set({ step }),

  setShipping: (data) =>
    set((state) => ({
      shipping: { ...state.shipping, ...data },
    })),

  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),

  reset: () =>
    set({
      step: 1,
      shipping: initialShipping,
      paymentMethod: "cod",
    }),
}));
