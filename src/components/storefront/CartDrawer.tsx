"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCartStore, getCartKey } from "@/stores/cart-store";
import { useCouponStore } from "@/stores/coupon-store";
import { formatPrice } from "@/lib/format";
import CouponInput from "./CouponInput";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart, subtotal } =
    useCartStore();
  const { appliedCoupon, discountAmount } = useCouponStore();
  const isFreeShipping = useCouponStore((s) => s.isFreeShipping());

  const sub = subtotal();
  const shippingFee = isFreeShipping ? 0 : sub >= 500000 ? 0 : 30000;
  const total = sub - discountAmount + shippingFee;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 font-heading text-lg">
              <ShoppingBag className="h-5 w-5" />
              Giỏ hàng ({items.length})
            </SheetTitle>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-destructive"
                onClick={clearCart}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Xóa tất cả
              </Button>
            )}
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-4">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium mb-1">Giỏ hàng trống</p>
            <p className="text-sm text-muted-foreground mb-6">
              Hãy thêm sản phẩm yêu thích vào giỏ hàng
            </p>
            <Link href="/products" onClick={closeCart}>
              <Button>Khám phá sản phẩm</Button>
            </Link>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <AnimatePresence mode="popLayout">
                {items.map((item) => {
                  const cartKey = getCartKey(item);
                  return (
                  <motion.div
                    key={cartKey}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 py-4 border-b last:border-0"
                  >
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={closeCart}
                      className="relative h-20 w-20 rounded-lg overflow-hidden bg-secondary shrink-0"
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={closeCart}
                        className="text-sm font-medium line-clamp-2 hover:text-accent transition-colors"
                      >
                        {item.title}
                      </Link>
                      {item.variant && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.variant}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-semibold text-accent">
                          {formatPrice(item.price)}
                        </span>
                        {item.comparePrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            {formatPrice(item.comparePrice)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(cartKey, item.quantity - 1)
                            }
                            className="h-7 w-7 flex items-center justify-center hover:bg-secondary transition-colors rounded-l-lg"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(cartKey, item.quantity + 1)
                            }
                            className="h-7 w-7 flex items-center justify-center hover:bg-secondary transition-colors rounded-r-lg"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(cartKey)}
                          className="ml-auto p-1 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                  );
                })}
              </AnimatePresence>
            </ScrollArea>

            {/* Footer */}
            <div className="border-t px-6 py-4 space-y-3">
              {/* Coupon Input */}
              <CouponInput compact />

              <Separator />

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>{formatPrice(sub)}</span>
                </div>

                {/* Discount line */}
                {appliedCoupon && discountAmount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex justify-between text-emerald-600 dark:text-emerald-400"
                  >
                    <span className="flex items-center gap-1">
                      Giảm giá
                      <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-900/50 px-1 rounded">
                        {appliedCoupon.code}
                      </span>
                    </span>
                    <span className="font-medium">-{formatPrice(discountAmount)}</span>
                  </motion.div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span className={shippingFee === 0 ? "text-emerald-600 dark:text-emerald-400 font-medium" : ""}>
                    {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
                  </span>
                </div>
                {isFreeShipping && appliedCoupon && (
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                    🎉 Miễn phí ship với mã {appliedCoupon.code}
                  </p>
                )}
                {!isFreeShipping && shippingFee > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Miễn phí ship cho đơn từ {formatPrice(500000)}
                  </p>
                )}
                <Separator />
                <div className="flex justify-between text-base font-semibold">
                  <span>Tổng cộng</span>
                  <span className="text-accent">{formatPrice(total)}</span>
                </div>
              </div>

              <Link href="/checkout" onClick={closeCart}>
                <Button
                  className="w-full h-12 text-base font-semibold bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl"
                >
                  Thanh toán
                </Button>
              </Link>

              <Button
                variant="outline"
                className="w-full rounded-xl"
                onClick={closeCart}
              >
                Tiếp tục mua sắm
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
