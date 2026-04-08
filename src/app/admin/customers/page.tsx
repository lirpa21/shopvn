"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Users,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  ArrowUpDown,
  Crown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { customers } from "@/lib/mock-admin-data";
import { formatPrice, formatDate } from "@/lib/format";

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const filtered = customers
    .filter((c) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "spent-high":
          return b.totalSpent - a.totalSpent;
        case "spent-low":
          return a.totalSpent - b.totalSpent;
        case "orders":
          return b.totalOrders - a.totalOrders;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );
      }
    });

  const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalOrders = customers.reduce((sum, c) => sum + c.totalOrders, 0);
  const activeCount = customers.filter((c) => c.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading">Khách hàng</h1>
        <p className="text-sm text-muted-foreground">
          Quản lý {customers.length} khách hàng
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl border p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Users className="h-4 w-4" />
            Hoạt động
          </div>
          <p className="text-xl font-bold">
            {activeCount}
            <span className="text-sm font-normal text-muted-foreground">
              /{customers.length}
            </span>
          </p>
        </div>
        <div className="bg-card rounded-2xl border p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <ShoppingBag className="h-4 w-4" />
            Tổng đơn hàng
          </div>
          <p className="text-xl font-bold">{totalOrders}</p>
        </div>
        <div className="bg-card rounded-2xl border p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Crown className="h-4 w-4" />
            Tổng chi tiêu
          </div>
          <p className="text-xl font-bold">{formatPrice(totalSpent)}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-card rounded-2xl border p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm tên, email, SĐT..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 rounded-xl"
            />
          </div>
          <Select
            value={sortBy}
            onValueChange={(v) => v && setSortBy(v)}
          >
            <SelectTrigger className="w-[180px] h-10 rounded-xl">
              <ArrowUpDown className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Mới nhất</SelectItem>
              <SelectItem value="name">Tên A→Z</SelectItem>
              <SelectItem value="spent-high">Chi tiêu cao</SelectItem>
              <SelectItem value="spent-low">Chi tiêu thấp</SelectItem>
              <SelectItem value="orders">Nhiều đơn nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((customer, index) => (
          <motion.div
            key={customer.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="bg-card rounded-2xl border p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-accent font-bold text-sm shrink-0">
                {customer.name
                  .split(" ")
                  .slice(-2)
                  .map((n) => n[0])
                  .join("")}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold truncate">
                    {customer.name}
                  </h3>
                  {customer.totalOrders >= 10 && (
                    <Crown className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Mail className="h-3 w-3" />
                  {customer.email}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Phone className="h-3 w-3" />
                  {customer.phone}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-muted-foreground">Đơn hàng</p>
                <p className="text-sm font-bold mt-0.5">
                  {customer.totalOrders}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Chi tiêu</p>
                <p className="text-sm font-bold mt-0.5">
                  {customer.totalSpent >= 1000000
                    ? `${(customer.totalSpent / 1000000).toFixed(1)}tr`
                    : formatPrice(customer.totalSpent)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Trạng thái</p>
                <Badge
                  variant="outline"
                  className={`text-[10px] mt-0.5 ${
                    customer.status === "active"
                      ? "border-emerald-300 text-emerald-700 dark:text-emerald-400"
                      : "border-gray-300 text-gray-500"
                  }`}
                >
                  {customer.status === "active" ? "Hoạt động" : "Không hoạt động"}
                </Badge>
              </div>
            </div>

            {customer.lastOrder && (
              <p className="text-[10px] text-muted-foreground mt-3 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Đơn gần nhất: {formatDate(customer.lastOrder)}
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-card rounded-2xl border">
          <Users className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm font-medium">Không tìm thấy khách hàng</p>
        </div>
      )}
    </div>
  );
}
