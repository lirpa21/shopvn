"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Truck, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { useCategoryManagement } from "@/stores/category-store";
import { useProductManagement } from "@/stores/product-store";

const features = [
  {
    icon: Truck,
    title: "Giao hàng nhanh",
    description: "Miễn phí cho đơn từ 500K",
  },
  {
    icon: Shield,
    title: "Bảo hành chính hãng",
    description: "Cam kết chất lượng 100%",
  },
  {
    icon: RotateCcw,
    title: "Đổi trả dễ dàng",
    description: "30 ngày đổi trả miễn phí",
  },
  {
    icon: Sparkles,
    title: "Sản phẩm chính hãng",
    description: "Nguồn gốc rõ ràng",
  },
];

export default function HeroSection() {
  const allProducts = useProductManagement((s) => s.products);
  const categories = useCategoryManagement((s) => s.categories);
  const featuredProducts = allProducts.filter((p) => p.featured && p.status === "ACTIVE");

  return (
    <>
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }} />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span className="text-sm text-primary-foreground/90 font-medium">
                  Bộ sưu tập mới 2026
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-primary-foreground leading-tight">
                Mua sắm thông minh,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300">
                  phong cách riêng
                </span>
              </h1>
              <p className="mt-6 text-lg text-primary-foreground/70 max-w-md leading-relaxed">
                Khám phá hàng nghìn sản phẩm chất lượng với giá tốt nhất. Giao hàng nhanh, đổi trả dễ dàng.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link href="/products">
                  <Button
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl px-8 h-12 text-base font-semibold shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 btn-press transition-shadow"
                  >
                    Khám phá ngay
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/collections/thoi-trang-nam">
                  <Button
                    size="lg"
                    className="border border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl h-12 text-base btn-press"
                  >
                    Xem bộ sưu tập
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Hero Images Grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop"
                    alt="Shopping"
                    fill
                    className="object-cover"
                    sizes="200px"
                    priority
                  />
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=400&fit=crop"
                    alt="Fashion"
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop"
                    alt="Electronics"
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop"
                    alt="Store"
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="flex items-center gap-3 hover-lift cursor-default p-2 rounded-xl"
              >
                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading">
                Danh mục nổi bật
              </h2>
              <p className="text-muted-foreground mt-1">
                Khám phá các danh mục sản phẩm đa dạng
              </p>
            </div>
            <Link
              href="/collections"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
            >
              Xem tất cả
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: 0.05 * index }}
              >
                <Link
                  href={`/collections/${category.slug}`}
                  className="group block text-center"
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary mb-3 hover-lift">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white text-sm font-semibold">
                        {category.name}
                      </p>
                      <p className="text-white/70 text-xs mt-0.5">
                        {category.productCount} sản phẩm
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading">
                🔥 Sản phẩm nổi bật
              </h2>
              <p className="text-muted-foreground mt-1">
                Được yêu thích nhất tuần này
              </p>
            </div>
            <Link
              href="/products?featured=true"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
            >
              Xem tất cả
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-accent via-accent/90 to-rose-500 p-8 sm:p-12 lg:p-16">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '30px 30px',
              }} />
            </div>
            <div className="relative max-w-xl">
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white">
                Ưu đãi đặc biệt
              </h2>
              <p className="mt-4 text-lg text-white/80 leading-relaxed">
                Đăng ký nhận thông báo để không bỏ lỡ các chương trình giảm giá lên đến 50%. Chỉ dành cho thành viên!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="flex-1 h-12 rounded-xl px-4 bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/60 outline-none focus:ring-2 focus:ring-white/50"
                />
                <Button
                  size="lg"
                  className="bg-white text-accent hover:bg-white/90 rounded-xl h-12 px-8 font-semibold shrink-0"
                >
                  Đăng ký ngay
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
