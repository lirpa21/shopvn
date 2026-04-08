// Mock admin data for development

import type { Product } from "./mock-data";
import { products } from "./mock-data";

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "refunded";
  shippingAddress: string;
  note?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder?: string;
  createdAt: string;
  status: "active" | "inactive";
}

export interface DashboardStats {
  revenue: number;
  revenueGrowth: number;
  orders: number;
  ordersGrowth: number;
  customers: number;
  customersGrowth: number;
  avgOrderValue: number;
  avgOrderGrowth: number;
}

export const dashboardStats: DashboardStats = {
  revenue: 127450000,
  revenueGrowth: 12.5,
  orders: 284,
  ordersGrowth: 8.2,
  customers: 1563,
  customersGrowth: 15.3,
  avgOrderValue: 448770,
  avgOrderGrowth: 3.8,
};

export const revenueByMonth = [
  { month: "T1", revenue: 62000000, orders: 142 },
  { month: "T2", revenue: 78000000, orders: 178 },
  { month: "T3", revenue: 85000000, orders: 195 },
  { month: "T4", revenue: 92000000, orders: 212 },
  { month: "T5", revenue: 105000000, orders: 238 },
  { month: "T6", revenue: 127450000, orders: 284 },
];

export const revenueByCategory = [
  { name: "Thời trang Nam", value: 35200000, color: "var(--chart-1)" },
  { name: "Thời trang Nữ", value: 28100000, color: "var(--chart-2)" },
  { name: "Điện tử", value: 25800000, color: "var(--chart-3)" },
  { name: "Nhà cửa", value: 18700000, color: "var(--chart-4)" },
  { name: "Làm đẹp", value: 12300000, color: "var(--chart-5)" },
  { name: "Thể thao", value: 7350000, color: "oklch(0.6 0.15 180)" },
];

export const orders: Order[] = [
  {
    id: "1",
    orderNumber: "SV20260401A3FX",
    customerName: "Nguyễn Văn An",
    customerEmail: "an.nguyen@email.com",
    customerPhone: "0912345678",
    items: [{
      productId: "1",
      title: "Áo Polo Premium Cotton",
      price: 450000,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=100&h=100&fit=crop",
    }],
    subtotal: 900000,
    shippingFee: 0,
    total: 900000,
    status: "delivered",
    paymentMethod: "cod",
    paymentStatus: "paid",
    shippingAddress: "123 Nguyễn Huệ, Q.1, TP.HCM",
    createdAt: "2026-04-01T08:30:00Z",
  },
  {
    id: "2",
    orderNumber: "SV20260402B7KP",
    customerName: "Trần Thị Bích",
    customerEmail: "bich.tran@email.com",
    customerPhone: "0987654321",
    items: [{
      productId: "3",
      title: "Đầm Maxi Hoa Vintage",
      price: 520000,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=100&h=100&fit=crop",
    }, {
      productId: "5",
      title: "Serum Vitamin C 20%",
      price: 380000,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&h=100&fit=crop",
    }],
    subtotal: 900000,
    shippingFee: 0,
    total: 900000,
    status: "shipping",
    paymentMethod: "momo",
    paymentStatus: "paid",
    shippingAddress: "45 Lê Lợi, Q.3, TP.HCM",
    createdAt: "2026-04-02T14:20:00Z",
  },
  {
    id: "3",
    orderNumber: "SV20260403C2MN",
    customerName: "Lê Hoàng Nam",
    customerEmail: "nam.le@email.com",
    customerPhone: "0901234567",
    items: [{
      productId: "6",
      title: "Giày chạy bộ Ultra Boost",
      price: 1890000,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop",
    }],
    subtotal: 1890000,
    shippingFee: 0,
    total: 1890000,
    status: "confirmed",
    paymentMethod: "vnpay",
    paymentStatus: "paid",
    shippingAddress: "78 Trần Phú, Đà Nẵng",
    createdAt: "2026-04-03T09:15:00Z",
  },
  {
    id: "4",
    orderNumber: "SV20260404D5QR",
    customerName: "Phạm Minh Đức",
    customerEmail: "duc.pham@email.com",
    customerPhone: "0934567890",
    items: [{
      productId: "2",
      title: "Tai nghe Bluetooth TWS Pro",
      price: 890000,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
    }],
    subtotal: 890000,
    shippingFee: 0,
    total: 890000,
    status: "pending",
    paymentMethod: "bank_qr",
    paymentStatus: "pending",
    shippingAddress: "12 Hoàng Diệu, Hải Phòng",
    createdAt: "2026-04-04T16:45:00Z",
  },
  {
    id: "5",
    orderNumber: "SV20260405E8ST",
    customerName: "Võ Thị Hương",
    customerEmail: "huong.vo@email.com",
    customerPhone: "0976543210",
    items: [{
      productId: "4",
      title: "Bình giữ nhiệt Inox 750ml",
      price: 320000,
      quantity: 3,
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=100&h=100&fit=crop",
    }, {
      productId: "8",
      title: "Đèn ngủ LED thông minh",
      price: 290000,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab3fe?w=100&h=100&fit=crop",
    }],
    subtotal: 1250000,
    shippingFee: 0,
    total: 1250000,
    status: "cancelled",
    paymentMethod: "cod",
    paymentStatus: "refunded",
    shippingAddress: "99 Nguyễn Trãi, Cần Thơ",
    note: "Khách hủy đơn vì đổi ý",
    createdAt: "2026-04-05T11:00:00Z",
  },
  {
    id: "6",
    orderNumber: "SV20260406F1UV",
    customerName: "Đặng Quốc Bảo",
    customerEmail: "bao.dang@email.com",
    customerPhone: "0945678901",
    items: [{
      productId: "7",
      title: "Laptop Sleeve 15.6 inch",
      price: 250000,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=100&h=100&fit=crop",
    }],
    subtotal: 500000,
    shippingFee: 0,
    total: 500000,
    status: "pending",
    paymentMethod: "zalopay",
    paymentStatus: "paid",
    shippingAddress: "256 Lê Duẩn, Q.1, TP.HCM",
    createdAt: "2026-04-06T07:30:00Z",
  },
];

export const customers: Customer[] = [
  {
    id: "1",
    name: "Nguyễn Văn An",
    email: "an.nguyen@email.com",
    phone: "0912345678",
    totalOrders: 12,
    totalSpent: 8500000,
    lastOrder: "2026-04-01",
    createdAt: "2025-06-15T00:00:00Z",
    status: "active",
  },
  {
    id: "2",
    name: "Trần Thị Bích",
    email: "bich.tran@email.com",
    phone: "0987654321",
    totalOrders: 8,
    totalSpent: 5200000,
    lastOrder: "2026-04-02",
    createdAt: "2025-08-20T00:00:00Z",
    status: "active",
  },
  {
    id: "3",
    name: "Lê Hoàng Nam",
    email: "nam.le@email.com",
    phone: "0901234567",
    totalOrders: 5,
    totalSpent: 12400000,
    lastOrder: "2026-04-03",
    createdAt: "2025-10-01T00:00:00Z",
    status: "active",
  },
  {
    id: "4",
    name: "Phạm Minh Đức",
    email: "duc.pham@email.com",
    phone: "0934567890",
    totalOrders: 3,
    totalSpent: 2670000,
    lastOrder: "2026-04-04",
    createdAt: "2025-12-10T00:00:00Z",
    status: "active",
  },
  {
    id: "5",
    name: "Võ Thị Hương",
    email: "huong.vo@email.com",
    phone: "0976543210",
    totalOrders: 15,
    totalSpent: 18750000,
    lastOrder: "2026-04-05",
    createdAt: "2025-03-25T00:00:00Z",
    status: "active",
  },
  {
    id: "6",
    name: "Đặng Quốc Bảo",
    email: "bao.dang@email.com",
    phone: "0945678901",
    totalOrders: 2,
    totalSpent: 1000000,
    lastOrder: "2026-04-06",
    createdAt: "2026-01-05T00:00:00Z",
    status: "active",
  },
  {
    id: "7",
    name: "Huỳnh Thùy Linh",
    email: "linh.huynh@email.com",
    phone: "0967890123",
    totalOrders: 0,
    totalSpent: 0,
    createdAt: "2026-03-20T00:00:00Z",
    status: "inactive",
  },
];

// Helpers
export function getOrderStatusLabel(status: Order["status"]): string {
  const labels: Record<Order["status"], string> = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    shipping: "Đang giao",
    delivered: "Đã giao",
    cancelled: "Đã hủy",
  };
  return labels[status];
}

export function getOrderStatusColor(status: Order["status"]): string {
  const colors: Record<Order["status"], string> = {
    pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    shipping: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
    delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  };
  return colors[status];
}

export function getPaymentMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    cod: "COD",
    momo: "MoMo",
    vnpay: "VNPay",
    shopeepay: "ShopeePay",
    zalopay: "ZaloPay",
    bank_qr: "QR Bank",
  };
  return labels[method] || method;
}

export function getPaymentStatusLabel(status: Order["paymentStatus"]): string {
  const labels: Record<Order["paymentStatus"], string> = {
    pending: "Chưa thanh toán",
    paid: "Đã thanh toán",
    refunded: "Đã hoàn tiền",
  };
  return labels[status];
}

export function getPaymentStatusColor(status: Order["paymentStatus"]): string {
  const colors: Record<Order["paymentStatus"], string> = {
    pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    refunded: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  };
  return colors[status];
}

export { products };
