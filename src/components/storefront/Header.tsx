"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Heart,
  ChevronDown,
  LogOut,
  Package,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useCategoryManagement } from "@/stores/category-store";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/app/actions/auth";
import { ThemeToggle } from "@/components/ThemeToggle";

const CartDrawer = dynamic(() => import("./CartDrawer"), {
  ssr: false,
});

const SearchModal = dynamic(() => import("./SearchModal"), {
  ssr: false,
});

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<{
    email?: string;
    user_metadata?: { full_name?: string };
  } | null>(null);
  const totalItems = useCartStore((s) => s.totalItems());
  const openCart = useCartStore((s) => s.openCart);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const categories = useCategoryManagement((s) => s.categories);

  // Prevent hydration mismatch from persisted stores
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check auth state
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const userName = user?.user_metadata?.full_name || user?.email || "";
  const initials = userName
    ? userName
        .split(" ")
        .slice(-2)
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "";

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-center py-2 px-4 text-xs sm:text-sm font-medium">
        <span className="hidden sm:inline">🎉 Miễn phí vận chuyển cho đơn hàng từ 500.000₫ — Mã:{" "}</span>
        <span className="sm:hidden">🎉 Freeship từ 500K — Mã:{" "}</span>
        <span className="font-bold">FREESHIP</span>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "glass border-b border-border/50 shadow-sm"
            : "bg-background"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger
                className="inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-medium h-8 w-8 hover:bg-muted transition-colors lg:hidden"
                id="mobile-menu-btn"
              >
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b">
                    <Link
                      href="/"
                      className="text-2xl font-bold font-heading"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Shop<span className="gradient-text">VN</span>
                    </Link>
                  </div>
                  <nav className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-1">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/collections/${cat.slug}`}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-secondary hover:text-foreground transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {cat.name}
                          <Badge variant="secondary" className="ml-auto text-xs">
                            {cat.productCount}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-6 pt-6 border-t space-y-1">
                      <Link
                        href="/products"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-secondary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Tất cả sản phẩm
                      </Link>
                      {user ? (
                        <>
                          <Link
                            href="/account"
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-secondary transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <User className="h-4 w-4" />
                            Tài khoản
                          </Link>
                          <form action={logout}>
                            <button
                              type="submit"
                              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-secondary transition-colors w-full text-left text-destructive"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <LogOut className="h-4 w-4" />
                              Đăng xuất
                            </button>
                          </form>
                        </>
                      ) : (
                        <Link
                          href="/login"
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-secondary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          Đăng nhập
                        </Link>
                      )}
                      <Link
                        href="/wishlist"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-secondary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Heart className="h-4 w-4" />
                        Yêu thích
                        {mounted && wishlistCount > 0 && (
                          <Badge variant="secondary" className="ml-auto text-xs">
                            {wishlistCount}
                          </Badge>
                        )}
                      </Link>
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-1 text-xl sm:text-2xl font-bold font-heading shrink-0"
              id="logo"
            >
              Shop<span className="gradient-text">VN</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href="/products"
                className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
              >
                Sản phẩm
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors rounded-lg hover:bg-secondary">
                  Danh mục
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                </button>
                {/* Dropdown */}
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-card rounded-xl border shadow-xl p-2 min-w-[220px]">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/collections/${cat.slug}`}
                        className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-foreground/80 hover:bg-secondary hover:text-foreground transition-colors"
                      >
                        {cat.name}
                        <span className="text-xs text-muted-foreground">
                          {cat.productCount}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <Link
                href="/products?featured=true"
                className="px-3 py-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors rounded-lg hover:bg-accent/10"
              >
                🔥 Hot
              </Link>
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 w-full rounded-full border bg-secondary/50 px-4 py-2 text-sm text-muted-foreground hover:bg-secondary transition-colors"
                id="search-bar"
              >
                <Search className="h-4 w-4" />
                <span>Tìm kiếm sản phẩm...</span>
                <kbd className="ml-auto hidden sm:inline-flex h-5 items-center rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSearchOpen(true)}
                id="mobile-search-btn"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Wishlist */}
              <Link href="/wishlist" className="hidden sm:inline-flex">
                <Button variant="ghost" size="icon" className="relative" id="wishlist-btn">
                  <Heart className="h-5 w-5" />
                  <AnimatePresence>
                    {mounted && wishlistCount > 0 && (
                      <motion.span
                        key="wish-badge"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent/20 text-[9px] font-bold text-accent"
                      >
                        {wishlistCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </Link>

              {/* Theme Toggle */}
              <div className="hidden sm:inline-flex">
                <ThemeToggle />
              </div>

              {/* User / Auth */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="hidden sm:inline-flex items-center justify-center rounded-lg h-9 w-9 hover:bg-muted transition-colors">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center text-accent text-[10px] font-bold">
                      {initials}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium truncate">{userName}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 text-xs" render={<Link href="/account" />}>
                      <User className="h-3.5 w-3.5" /> Tài khoản
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-xs" render={<Link href="/account" />}>
                      <Package className="h-3.5 w-3.5" /> Đơn hàng
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-xs" render={<Link href="/wishlist" />}>
                      <Heart className="h-3.5 w-3.5" /> Yêu thích
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <form action={logout}>
                      <button type="submit" className="w-full">
                        <DropdownMenuItem className="gap-2 text-xs text-destructive">
                          <LogOut className="h-3.5 w-3.5" /> Đăng xuất
                        </DropdownMenuItem>
                      </button>
                    </form>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login" className="hidden sm:inline-flex">
                  <Button variant="ghost" size="icon" id="account-btn">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              )}

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={openCart}
                id="cart-btn"
              >
                <ShoppingBag className="h-5 w-5" />
                <AnimatePresence>
                  {mounted && totalItems > 0 && (
                    <motion.span
                      key={`cart-badge-${totalItems}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Search Modal */}
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
