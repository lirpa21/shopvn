"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Eye,
  X,
  ChevronRight,
  Package,
  MapPin,
  CreditCard,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  orders,
  getOrderStatusLabel,
  getOrderStatusColor,
  getPaymentMethodLabel,
  getPaymentStatusLabel,
  getPaymentStatusColor,
  type Order,
} from "@/lib/mock-admin-data";
import { formatPrice, formatDate } from "@/lib/format";

type StatusFilter = "all" | Order["status"];

const statusIcon = (status: Order["status"]) => {
  switch (status) {
    case "pending":
      return <AlertCircle className="h-4 w-4" />;
    case "confirmed":
      return <CheckCircle2 className="h-4 w-4" />;
    case "shipping":
      return <Truck className="h-4 w-4" />;
    case "delivered":
      return <CheckCircle2 className="h-4 w-4" />;
    case "cancelled":
      return <XCircle className="h-4 w-4" />;
  }
};

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    shipping: orders.filter((o) => o.status === "shipping").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading">Đơn hàng</h1>
        <p className="text-sm text-muted-foreground">
          Quản lý {orders.length} đơn hàng
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {(
          [
            { key: "all", label: "Tất cả" },
            { key: "pending", label: "Chờ xác nhận" },
            { key: "confirmed", label: "Đã xác nhận" },
            { key: "shipping", label: "Đang giao" },
            { key: "delivered", label: "Đã giao" },
            { key: "cancelled", label: "Đã hủy" },
          ] as { key: StatusFilter; label: string }[]
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
              statusFilter === tab.key
                ? "bg-accent text-accent-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            <span
              className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] ${
                statusFilter === tab.key
                  ? "bg-accent-foreground/20"
                  : "bg-foreground/5"
              }`}
            >
              {statusCounts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-card rounded-2xl border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm mã đơn, tên khách hàng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="bg-card rounded-2xl border p-4 sm:p-5 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedOrder(order)}
          >
            <div className="flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex -space-x-2">
                  {order.items.slice(0, 3).map((item, i) => (
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
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold">
                      {order.orderNumber}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${getOrderStatusColor(
                        order.status
                      )}`}
                    >
                      {statusIcon(order.status)}
                      {getOrderStatusLabel(order.status)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {order.customerName} • {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    {getPaymentMethodLabel(order.paymentMethod)}
                  </Badge>
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium ${getPaymentStatusColor(
                      order.paymentStatus
                    )}`}
                  >
                    {getPaymentStatusLabel(order.paymentStatus)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">
                    {formatPrice(order.total)}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12 bg-card rounded-2xl border">
          <Package className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm font-medium">Không tìm thấy đơn hàng</p>
        </div>
      )}

      {/* Order Detail Drawer */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedOrder(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l z-50 overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-card z-10 flex items-center justify-between p-4 border-b">
                <h3 className="font-bold font-heading">
                  {selectedOrder.orderNumber}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-lg hover:bg-secondary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 space-y-5">
                {/* Status */}
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {statusIcon(selectedOrder.status)}
                    {getOrderStatusLabel(selectedOrder.status)}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                      selectedOrder.paymentStatus
                    )}`}
                  >
                    {getPaymentStatusLabel(selectedOrder.paymentStatus)}
                  </span>
                </div>

                {/* Customer */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Khách hàng
                  </h4>
                  <p className="text-sm font-medium">
                    {selectedOrder.customerName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedOrder.customerEmail}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedOrder.customerPhone}
                  </p>
                </div>

                <Separator />

                {/* Shipping */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> Địa chỉ giao hàng
                  </h4>
                  <p className="text-sm">{selectedOrder.shippingAddress}</p>
                  {selectedOrder.note && (
                    <p className="text-xs text-muted-foreground italic">
                      &quot;{selectedOrder.note}&quot;
                    </p>
                  )}
                </div>

                <Separator />

                {/* Payment */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5" /> Thanh toán
                  </h4>
                  <p className="text-sm">
                    {getPaymentMethodLabel(selectedOrder.paymentMethod)}
                  </p>
                </div>

                <Separator />

                {/* Items */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Sản phẩm
                  </h4>
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          x{item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span>{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phí ship</span>
                    <span>
                      {selectedOrder.shippingFee === 0
                        ? "Miễn phí"
                        : formatPrice(selectedOrder.shippingFee)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-base">
                    <span>Tổng cộng</span>
                    <span className="text-accent">
                      {formatPrice(selectedOrder.total)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {selectedOrder.status === "pending" && (
                    <>
                      <Button className="flex-1 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground text-sm">
                        Xác nhận đơn
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-xl text-sm"
                      >
                        Hủy đơn
                      </Button>
                    </>
                  )}
                  {selectedOrder.status === "confirmed" && (
                    <Button className="flex-1 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground text-sm">
                      Bắt đầu giao hàng
                    </Button>
                  )}
                  {selectedOrder.status === "shipping" && (
                    <Button className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm">
                      Xác nhận đã giao
                    </Button>
                  )}
                </div>

                {/* Timestamps */}
                <div className="text-xs text-muted-foreground flex items-center gap-1.5 pt-2">
                  <Clock className="h-3.5 w-3.5" />
                  Đặt hàng: {formatDate(selectedOrder.createdAt)}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
