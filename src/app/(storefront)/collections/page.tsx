"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCategoryManagement } from "@/stores/category-store";
import { useProductManagement } from "@/stores/product-store";

export default function CollectionsPage() {
  const categories = useCategoryManagement((s) => s.categories);
  const storeProducts = useProductManagement((s) => s.products);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-10 sm:mb-14"
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading">
          Bộ sưu tập
        </h1>
        <p className="text-muted-foreground mt-3 text-lg max-w-md mx-auto">
          Khám phá tất cả danh mục sản phẩm của chúng tôi
        </p>
      </motion.div>

      {/* Collections Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => {
          const productCount = storeProducts.filter((p) => p.categorySlug === category.slug && p.status === "ACTIVE").length;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Link
                href={`/collections/${category.slug}`}
                className="group block relative overflow-hidden rounded-2xl bg-card border product-card-hover"
                id={`collection-${category.slug}`}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                  {/* Overlay Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
                      {category.name}
                    </h2>
                    {category.description && (
                      <p className="text-white/70 text-sm mt-1.5 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <span className="inline-flex items-center gap-1.5 text-white/80 text-sm">
                        <ShoppingBag className="h-4 w-4" />
                        {category.productCount} sản phẩm
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-white group-hover:text-accent transition-colors">
                        Xem ngay
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
