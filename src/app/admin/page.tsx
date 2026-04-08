"use client";

import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Clock,
  Eye,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  dashboardStats,
  revenueByMonth,
  revenueByCategory,
  orders,
  getOrderStatusLabel,
  getOrderStatusColor,
  getPaymentMethodLabel,
} from "@/lib/mock-admin-data";
import { formatPrice, formatDate } from "@/lib/format";

const statsCards = [
  {
    label: "Doanh thu",
    value: formatPrice(dashboardStats.revenue),
    growth: dashboardStats.revenueGrowth,
    icon: DollarSign,
    color: "text-emerald-600",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    label: "Đơn hàng",
    value: dashboardStats.orders.toString(),
    growth: dashboardStats.ordersGrowth,
    icon: ShoppingCart,
    color: "text-blue-600",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    label: "Khách hàng",
    value: dashboardStats.customers.toLocaleString(),
    growth: dashboardStats.customersGrowth,
    icon: Users,
    color: "text-violet-600",
    bg: "bg-violet-100 dark:bg-violet-900/30",
  },
  {
    label: "Giá trị TB/đơn",
    value: formatPrice(dashboardStats.avgOrderValue),
    growth: dashboardStats.avgOrderGrowth,
    icon: TrendingUp,
    color: "text-amber-600",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatTooltipValue = (value: any) => formatPrice(Number(value));

export default function AdminDashboard() {
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-heading">Tổng quan</h1>
          <p className="text-sm text-muted-foreground">
            Xin chào! Đây là tình hình cửa hàng hôm nay.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Cập nhật: Hôm nay
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-card rounded-2xl border p-4 sm:p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`h-[18px] w-[18px] ${stat.color}`} />
              </div>
              <div
                className={`flex items-center gap-0.5 text-xs font-medium ${
                  stat.growth >= 0 ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {stat.growth >= 0 ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                )}
                {Math.abs(stat.growth)}%
              </div>
            </div>
            <p className="text-lg sm:text-xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-[1fr,380px] gap-4">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-card rounded-2xl border p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold font-heading">Doanh thu</h2>
            <Badge variant="outline" className="text-xs">
              6 tháng gần nhất
            </Badge>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueByMonth}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.635 0.2 18)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.635 0.2 18)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.8 0 0 / 20%)" />
                <XAxis
                  dataKey="month"
                  stroke="oklch(0.5 0 0)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="oklch(0.5 0 0)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(0)}tr`}
                />
                <Tooltip
                  formatter={formatTooltipValue}
                  labelStyle={{ fontWeight: 600 }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid oklch(0.9 0 0)",
                    boxShadow: "0 4px 12px oklch(0 0 0 / 8%)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="oklch(0.635 0.2 18)"
                  strokeWidth={2.5}
                  fill="url(#revenueGradient)"
                  name="Doanh thu"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Revenue by Category */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-card rounded-2xl border p-5"
        >
          <h2 className="font-semibold font-heading mb-4">
            Doanh thu theo danh mục
          </h2>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByCategory} layout="vertical">
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={90}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  stroke="oklch(0.5 0 0)"
                />
                <Tooltip
                  formatter={formatTooltipValue}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid oklch(0.9 0 0)",
                    boxShadow: "0 4px 12px oklch(0 0 0 / 8%)",
                  }}
                />
                <Bar
                  dataKey="value"
                  radius={[0, 6, 6, 0]}
                  name="Doanh thu"
                >
                  {revenueByCategory.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="mt-3 space-y-1.5">
            {revenueByCategory.slice(0, 4).map((cat) => (
              <div
                key={cat.name}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded"
                    style={{ background: cat.color }}
                  />
                  <span className="text-muted-foreground">{cat.name}</span>
                </div>
                <span className="font-medium">{formatPrice(cat.value)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="bg-card rounded-2xl border"
      >
        <div className="flex items-center justify-between p-5 pb-0">
          <h2 className="font-semibold font-heading">Đơn hàng gần đây</h2>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg text-xs h-8"
            render={<Link href="/admin/orders" />}
          >
            <Eye className="h-3.5 w-3.5 mr-1" />
            Xem tất cả
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <th className="text-left px-5 py-3 font-medium">Đơn hàng</th>
                <th className="text-left px-5 py-3 font-medium">Khách hàng</th>
                <th className="text-left px-5 py-3 font-medium">Thanh toán</th>
                <th className="text-left px-5 py-3 font-medium">Trạng thái</th>
                <th className="text-right px-5 py-3 font-medium">Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b last:border-0 hover:bg-secondary/50 transition-colors"
                >
                  <td className="px-5 py-3">
                    <div>
                      <p className="text-sm font-medium">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-sm">{order.customerName}</p>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant="outline" className="text-[10px]">
                      {getPaymentMethodLabel(order.paymentMethod)}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${getOrderStatusColor(
                        order.status
                      )}`}
                    >
                      {getOrderStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="text-sm font-semibold">
                      {formatPrice(order.total)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
