"use client";

import { memo } from "react";

import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { formatPrice, calcDiscount } from "@/lib/format";
import type { Product } from "@/lib/mock-data";

interface ProductCardProps {
  product: Product;
  index?: number;
}

function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));

  const discount = product.comparePrice
    ? calcDiscount(product.price, product.comparePrice)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      comparePrice: product.comparePrice,
      image: product.images[0],
      slug: product.slug,
    });
    toast.success("Đã thêm vào giỏ hàng!", {
      description: product.title,
      action: {
        label: "Xem giỏ hàng",
        onClick: openCart,
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="group block product-card-hover rounded-2xl bg-card border overflow-hidden"
        id={`product-card-${product.id}`}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badge */}
          {discount > 0 && (
            <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground font-semibold text-xs px-2 py-0.5 animate-pulse-soft">
              -{discount}%
            </Badge>
          )}

          {/* Actions on hover */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(product.id);
                toast.success(
                  isInWishlist ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích!",
                  { description: product.title }
                );
              }}
              className={`h-9 w-9 rounded-full backdrop-blur flex items-center justify-center transition-colors shadow-sm ${
                isInWishlist
                  ? "bg-accent text-white hover:bg-accent/90"
                  : "bg-white/90 hover:bg-white hover:text-accent"
              }`}
            >
              <Heart className={`h-4 w-4 ${isInWishlist ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Quick Add Button */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <Button
              size="sm"
              className="w-full bg-white/90 backdrop-blur text-foreground hover:bg-white rounded-xl font-medium text-xs h-9 shadow-sm btn-press"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
              Thêm vào giỏ
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 sm:p-4">
          <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
          <h3 className="text-sm font-medium line-clamp-2 group-hover:text-accent transition-colors min-h-[2.5rem]">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-base font-bold text-accent">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default memo(ProductCard);
