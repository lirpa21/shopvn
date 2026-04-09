"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  Share2,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "@/components/storefront/ProductCard";
import ProductReviews from "@/components/storefront/ProductReviews";
import ProductVariantSelector from "@/components/storefront/ProductVariantSelector";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useProductManagement } from "@/stores/product-store";
import { formatPrice, calcDiscount } from "@/lib/format";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const allProducts = useProductManagement((s) => s.products);
  const product = allProducts.find((p) => p.slug === slug && p.status === "ACTIVE") || null;
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product?.id ?? ""));

  // Variant state
  const hasVariants = Boolean(product && product.variantOptions?.length);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    // Auto-select first value for each option
    if (!product?.variantOptions) return {};
    const initial: Record<string, string> = {};
    product.variantOptions.forEach((opt) => {
      if (opt.values.length > 0) initial[opt.name] = opt.values[0];
    });
    return initial;
  });

  // Find matching variant
  const selectedVariant = useMemo(() => {
    if (!product?.variants || !hasVariants) return null;
    return product.variants.find((v) =>
      Object.entries(v.options).every(
        ([key, val]) => selectedOptions[key] === val
      )
    ) || null;
  }, [product?.variants, selectedOptions, hasVariants]);

  // Variant-aware price/image
  const effectivePrice = selectedVariant?.price ?? product?.price ?? 0;
  const effectiveComparePrice = selectedVariant?.comparePrice ?? product?.comparePrice;
  const effectiveImage = useMemo((): number | null => {
    if (!product) return null;
    // If selected variant has a specific image, show it
    if (selectedVariant?.image) {
      const imgIdx = product.images.indexOf(selectedVariant.image);
      if (imgIdx >= 0) return imgIdx;
    }
    // Find any variant with the selected color that has an image
    if (hasVariants && selectedOptions["Màu sắc"] && product.variants) {
      const colorVariant = product.variants.find(
        (v) => v.options["Màu sắc"] === selectedOptions["Màu sắc"] && v.image
      );
      if (colorVariant?.image) {
        const idx = product.images.indexOf(colorVariant.image);
        if (idx >= 0) return idx;
      }
    }
    return null;
  }, [selectedVariant, selectedOptions, product, hasVariants]);

  // Auto-switch image when color changes
  useEffect(() => {
    if (effectiveImage !== null) setSelectedImage(effectiveImage);
  }, [effectiveImage]);

  const handleOptionChange = useCallback((optionName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
  }, []);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Không tìm thấy sản phẩm</h1>
        <p className="text-muted-foreground mb-6">
          Sản phẩm này có thể đã bị xóa hoặc không tồn tại.
        </p>
        <Button render={<Link href="/products" />}>
          Quay lại cửa hàng
        </Button>
      </div>
    );
  }

  const discount = effectiveComparePrice
    ? calcDiscount(effectivePrice, effectiveComparePrice)
    : 0;

  const relatedProducts = allProducts
    .filter(
      (p) =>
        p.categorySlug === product.categorySlug &&
        p.id !== product.id &&
        p.status === "ACTIVE"
    )
    .slice(0, 4);

  // Build variant label for cart
  const variantLabel = hasVariants
    ? Object.values(selectedOptions).join(" / ")
    : undefined;

  const handleAddToCart = () => {
    if (hasVariants && !selectedVariant) {
      toast.error("Vui lòng chọn phân loại sản phẩm");
      return;
    }
    addItem(
      {
        id: product.id,
        title: product.title,
        price: effectivePrice,
        comparePrice: effectiveComparePrice,
        image: selectedVariant?.image || product.images[0],
        slug: product.slug,
        variant: variantLabel,
        variantId: selectedVariant?.id,
      },
      quantity
    );
    toast.success("Đã thêm vào giỏ hàng!", {
      description: `${product.title}${variantLabel ? ` (${variantLabel})` : ""} x${quantity}`,
      action: { label: "Xem giỏ hàng", onClick: openCart },
    });
  };

  const handleBuyNow = () => {
    if (hasVariants && !selectedVariant) {
      toast.error("Vui lòng chọn phân loại sản phẩm");
      return;
    }
    addItem(
      {
        id: product.id,
        title: product.title,
        price: effectivePrice,
        comparePrice: effectiveComparePrice,
        image: selectedVariant?.image || product.images[0],
        slug: product.slug,
        variant: variantLabel,
        variantId: selectedVariant?.id,
      },
      quantity
    );
    openCart();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">
          Trang chủ
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          href="/products"
          className="hover:text-foreground transition-colors"
        >
          Sản phẩm
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          href={`/collections/${product.categorySlug}`}
          className="hover:text-foreground transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium truncate max-w-[200px]">
          {product.title}
        </span>
      </nav>

      {/* Product Detail */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary mb-3">
            <Image
              src={product.images[selectedImage]}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {discount > 0 && (
              <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground text-sm px-3 py-1">
                -{discount}%
              </Badge>
            )}
          </div>
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative h-20 w-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    selectedImage === i
                      ? "border-accent"
                      : "border-transparent hover:border-border"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.title} - ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col"
        >
          {/* Vendor */}
          {product.vendor && (
            <p className="text-sm text-accent font-medium mb-1">
              {product.vendor}
            </p>
          )}

          <h1 className="text-2xl sm:text-3xl font-bold font-heading">
            {product.title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount} đánh giá)
            </span>
            <span className="text-sm text-muted-foreground">
              · Đã bán {product.reviewCount * 3}+
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-4">
            <span className="text-3xl font-bold text-accent">
              {formatPrice(effectivePrice)}
            </span>
            {effectiveComparePrice && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(effectiveComparePrice)}
                </span>
                <Badge variant="secondary" className="text-xs">
                  Tiết kiệm {formatPrice(effectiveComparePrice - effectivePrice)}
                </Badge>
              </>
            )}
          </div>

          <Separator className="my-6" />

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Variant Selector */}
          {hasVariants && product.variantOptions && product.variants && (
            <>
              <Separator className="my-6" />
              <ProductVariantSelector
                variantOptions={product.variantOptions}
                variants={product.variants}
                selectedOptions={selectedOptions}
                onChange={handleOptionChange}
              />
            </>
          )}

          <Separator className="my-6" />

          {/* Quantity & Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Số lượng:</span>
              <div className="flex items-center border rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 flex items-center justify-center hover:bg-secondary transition-colors rounded-l-xl"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10 flex items-center justify-center hover:bg-secondary transition-colors rounded-r-xl"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm text-muted-foreground">
                {(selectedVariant?.stock ?? product.stock)} sản phẩm có sẵn
              </span>
            </div>

            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 h-12 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl text-base font-semibold btn-press shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-shadow"
                onClick={handleAddToCart}
                id="add-to-cart-btn"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Thêm vào giỏ hàng
              </Button>
              <Button
                size="lg"
                variant="outline"
                className={`w-12 h-12 rounded-xl shrink-0 ${isInWishlist ? "bg-accent/10 border-accent text-accent" : ""}`}
                onClick={() => {
                  if (product) {
                    toggleWishlist(product.id);
                    toast.success(
                      isInWishlist ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích!",
                      { description: product.title }
                    );
                  }
                }}
              >
                <Heart className={`h-5 w-5 ${isInWishlist ? "fill-current" : ""}`} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-12 h-12 rounded-xl shrink-0"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  toast.success("Đã sao chép link!");
                }}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <Button
              size="lg"
              variant="outline"
              className="w-full h-12 rounded-xl text-base font-semibold border-2 border-foreground/20 hover:border-accent hover:text-accent hover:bg-accent/5 transition-all duration-200"
              onClick={handleBuyNow}
            >
              Mua ngay
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-secondary/60 text-center">
              <Truck className="h-5 w-5 text-accent" />
              <span className="text-xs font-medium">Giao hàng nhanh</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-secondary/60 text-center">
              <Shield className="h-5 w-5 text-accent" />
              <span className="text-xs font-medium">Chính hãng 100%</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-secondary/60 text-center">
              <RotateCcw className="h-5 w-5 text-accent" />
              <span className="text-xs font-medium">Đổi trả 30 ngày</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Product Tabs */}
      <div className="mt-12 sm:mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto">
            <TabsTrigger
              value="description"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent pb-3 px-4"
            >
              Mô tả sản phẩm
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent pb-3 px-4"
            >
              Đánh giá ({product.reviewCount})
            </TabsTrigger>
            <TabsTrigger
              value="shipping"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent pb-3 px-4"
            >
              Vận chuyển & Đổi trả
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
              <h3 className="text-base font-semibold mt-6 mb-3">Đặc điểm nổi bật</h3>
              <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
                <li>Chất liệu cao cấp, bền đẹp theo thời gian</li>
                <li>Thiết kế hiện đại, phù hợp mọi phong cách</li>
                <li>Sản phẩm chính hãng, tem nhãn đầy đủ</li>
                <li>Đóng gói cẩn thận, bảo quản tốt</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <ProductReviews
              productId={product.id}
              productTitle={product.title}
            />
          </TabsContent>

          <TabsContent value="shipping" className="mt-6">
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Vận chuyển</p>
                  <p>Giao hàng toàn quốc. Miễn phí ship cho đơn từ 500.000₫.</p>
                  <p>Thời gian giao: HCM 1-2 ngày, Tỉnh 3-5 ngày.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Đổi trả</p>
                  <p>Đổi trả miễn phí trong 30 ngày nếu sản phẩm lỗi hoặc không đúng mô tả.</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-12 sm:mt-16">
          <h2 className="text-2xl font-bold font-heading mb-6">
            Sản phẩm liên quan
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
