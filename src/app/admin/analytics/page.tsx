"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { revenueByMonth, revenueByCategory } from "@/lib/mock-admin-data";
import { formatPrice } from "@/lib/format";

const visitsByDay = [
  { day: "T2", visits: 1240, conversions: 62 },
  { day: "T3", visits: 1350, conversions: 71 },
  { day: "T4", visits: 1180, conversions: 55 },
  { day: "T5", visits: 1420, conversions: 78 },
  { day: "T6", visits: 1560, conversions: 89 },
  { day: "T7", visits: 1890, conversions: 112 },
  { day: "CN", visits: 1730, conversions: 98 },
];

const topProducts = [
  { name: "Giày chạy bộ Ultra Boost", sold: 145, revenue: 274050000 },
  { name: "Serum Vitamin C 20%", sold: 312, revenue: 118560000 },
  { name: "Tai nghe Bluetooth TWS", sold: 89, revenue: 79210000 },
  { name: "Áo Polo Premium Cotton", sold: 156, revenue: 70200000 },
  { name: "Đầm Maxi Hoa Vintage", sold: 98, revenue: 50960000 },
];

const paymentMethodData = [
  { name: "COD", value: 42, color: "oklch(0.72 0.19 155)" },
  { name: "MoMo", value: 22, color: "oklch(0.635 0.2 18)" },
  { name: "VNPay", value: 18, color: "oklch(0.65 0.18 260)" },
  { name: "Bank QR", value: 10, color: "oklch(0.7 0.15 300)" },
  { name: "ZaloPay", value: 5, color: "oklch(0.8 0.16 85)" },
  { name: "ShopeePay", value: 3, color: "oklch(0.6 0.15 40)" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatTooltipValue = (value: any, name: any) => {
  if (name === "Doanh thu" || name === "revenue") return formatPrice(Number(value));
  return Number(value).toLocaleString();
};

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading">Phân tích</h1>
        <p className="text-sm text-muted-foreground">
          Thống kê chi tiết về hoạt động cửa hàng
        </p>
      </div>

      {/* Revenue & Orders Chart */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold font-heading">
            Doanh thu & Đơn hàng
          </h2>
          <Badge variant="outline" className="text-xs">
            6 tháng
          </Badge>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueByMonth}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.8 0 0 / 20%)"
              />
              <XAxis
                dataKey="month"
                stroke="oklch(0.5 0 0)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="left"
                stroke="oklch(0.5 0 0)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${(v / 1000000).toFixed(0)}tr`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="oklch(0.5 0 0)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
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
                yAxisId="left"
                dataKey="revenue"
                fill="oklch(0.635 0.2 18)"
                radius={[6, 6, 0, 0]}
                name="Doanh thu"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="orders"
                stroke="oklch(0.65 0.18 260)"
                strokeWidth={2.5}
                dot={{ fill: "oklch(0.65 0.18 260)", r: 4 }}
                name="Đơn hàng"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Visits & Conversions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold font-heading">
              Lượt xem & Chuyển đổi
            </h2>
            <Badge variant="outline" className="text-xs">
              7 ngày
            </Badge>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitsByDay}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.8 0 0 / 20%)"
                />
                <XAxis
                  dataKey="day"
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
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid oklch(0.9 0 0)",
                    boxShadow: "0 4px 12px oklch(0 0 0 / 8%)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="visits"
                  stroke="oklch(0.65 0.18 260)"
                  strokeWidth={2}
                  dot={{ fill: "oklch(0.65 0.18 260)", r: 3 }}
                  name="Lượt xem"
                />
                <Line
                  type="monotone"
                  dataKey="conversions"
                  stroke="oklch(0.72 0.19 155)"
                  strokeWidth={2}
                  dot={{ fill: "oklch(0.72 0.19 155)", r: 3 }}
                  name="Chuyển đổi"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Payment Methods Pie */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-2xl border p-5"
        >
          <h2 className="font-semibold font-heading mb-4">
            Phương thức thanh toán
          </h2>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                >
                  {paymentMethodData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: any) => `${v}%`}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid oklch(0.9 0 0)",
                    boxShadow: "0 4px 12px oklch(0 0 0 / 8%)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {paymentMethodData.map((m) => (
              <div key={m.name} className="flex items-center gap-1.5 text-xs">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: m.color }}
                />
                <span className="text-muted-foreground">{m.name}</span>
                <span className="font-medium ml-auto">{m.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Products */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-2xl border p-5"
      >
        <h2 className="font-semibold font-heading mb-4">
          Sản phẩm bán chạy
        </h2>
        <div className="space-y-3">
          {topProducts.map((product, index) => {
            const maxSold = topProducts[0].sold;
            const percent = (product.sold / maxSold) * 100;

            return (
              <div key={index} className="flex items-center gap-3">
                <span className="w-6 text-xs text-muted-foreground font-medium text-right">
                  #{index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground shrink-0 ml-2">
                      {product.sold} đã bán
                    </p>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: `oklch(0.635 0.2 ${18 + index * 50})`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                    />
                  </div>
                </div>
                <span className="text-sm font-semibold shrink-0 w-[100px] text-right">
                  {formatPrice(product.revenue)}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
