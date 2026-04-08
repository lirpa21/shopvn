"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useCartStore } from "@/stores/cart-store";
import { useProductManagement } from "@/stores/product-store";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const removeItem = useWishlistStore((s) => s.removeItem);
  const addToCart = useCartStore((s) => s.addItem);
  const allProducts = useProductManagement((s) => s.products);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const wishlistProducts = allProducts.filter((p) => items.includes(p.id));

  if (wishlistProducts.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
          <Heart className="h-10 w-10 text-accent" />
        </div>
        <h1 className="text-2xl font-bold font-heading mb-2">
          Danh sách yêu thích trống
        </h1>
        <p className="text-muted-foreground mb-6">
          Thêm sản phẩm yêu thích để xem lại sau
        </p>
        <Button
          className="rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground"
          render={<Link href="/products" />}
        >
          Khám phá sản phẩm
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-heading">Yêu thích</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {wishlistProducts.length} sản phẩm
          </p>
        </div>
        <Button
          variant="outline"
          className="rounded-xl text-sm"
          render={<Link href="/products" />}
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Tiếp tục mua sắm
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        <AnimatePresence mode="popLayout">
          {wishlistProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card rounded-2xl border overflow-hidden product-card-hover group"
            >
              {/* Image */}
              <Link
                href={`/products/${product.slug}`}
                className="block relative aspect-square overflow-hidden bg-secondary"
              >
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {product.comparePrice && (
                  <span className="absolute top-2 left-2 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                    -{Math.round(
                      ((product.comparePrice - product.price) /
                        product.comparePrice) *
                        100
                    )}
                    %
                  </span>
                )}
              </Link>

              {/* Info */}
              <div className="p-3 sm:p-4">
                <Link href={`/products/${product.slug}`}>
                  <h3 className="text-sm font-medium line-clamp-2 hover:text-accent transition-colors">
                    {product.title}
                  </h3>
                </Link>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-amber-500 text-xs">★</span>
                  <span className="text-xs">{product.rating}</span>
                  <span className="text-xs text-muted-foreground">
                    ({product.reviewCount})
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-bold text-accent">
                    {formatPrice(product.price)}
                  </span>
                  {product.comparePrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatPrice(product.comparePrice)}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    className="flex-1 rounded-lg bg-accent hover:bg-accent/90 text-accent-foreground text-xs h-8"
                    onClick={() => {
                      addToCart({
                        id: product.id,
                        title: product.title,
                        slug: product.slug,
                        price: product.price,
                        image: product.images[0],
                        variant: product.variants?.[0] ? Object.values(product.variants[0].options).join(" / ") : "Mặc định",
                      });
                      toast.success("Đã thêm vào giỏ hàng");
                    }}
                  >
                    <ShoppingBag className="h-3.5 w-3.5 mr-1" />
                    Thêm giỏ
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-lg text-xs h-8 px-2"
                    onClick={() => {
                      removeItem(product.id);
                      toast("Đã xóa khỏi yêu thích");
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
