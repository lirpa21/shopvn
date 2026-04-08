"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  SlidersHorizontal,
  Grid3X3,
  LayoutList,
  X,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import ProductCard from "@/components/storefront/ProductCard";
import { type Product } from "@/lib/mock-data";
import { useCategoryManagement } from "@/stores/category-store";
import { useProductManagement } from "@/stores/product-store";

const sortOptions = [
  { value: "newest", label: "Mới nhất" },
  { value: "price-asc", label: "Giá: Thấp → Cao" },
  { value: "price-desc", label: "Giá: Cao → Thấp" },
  { value: "rating", label: "Đánh giá cao" },
  { value: "popular", label: "Phổ biến nhất" },
];

const priceRanges = [
  { label: "Dưới 200K", min: 0, max: 200000 },
  { label: "200K - 500K", min: 200000, max: 500000 },
  { label: "500K - 1 triệu", min: 500000, max: 1000000 },
  { label: "1 triệu - 2 triệu", min: 1000000, max: 2000000 },
  { label: "Trên 2 triệu", min: 2000000, max: Infinity },
];

export default function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const allCategories = useCategoryManagement((s) => s.categories);
  const category = allCategories.find((c) => c.slug === slug);
  const storeProducts = useProductManagement((s) => s.products);

  const [sort, setSort] = useState("newest");
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  const categoryProducts = useMemo(() => {
    if (!category) return [];
    let filtered = storeProducts.filter((p) => p.categorySlug === slug && p.status === "ACTIVE");

    if (selectedPriceRange !== null) {
      const range = priceRanges[selectedPriceRange];
      filtered = filtered.filter(
        (p) => p.price >= range.min && p.price < range.max
      );
    }

    switch (sort) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "newest":
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    return filtered;
  }, [slug, sort, selectedPriceRange, category, storeProducts]);

  if (!category) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Không tìm thấy danh mục</h1>
        <p className="text-muted-foreground mb-6">
          Danh mục này không tồn tại hoặc đã bị xóa.
        </p>
        <Button render={<Link href="/collections" />}>
          Xem tất cả danh mục
        </Button>
      </div>
    );
  }

  const otherCategories = allCategories.filter((c) => c.slug !== slug);
  const activeFilters = selectedPriceRange !== null ? 1 : 0;

  const clearFilters = () => {
    setSelectedPriceRange(null);
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Khoảng giá</h3>
        <div className="space-y-2">
          {priceRanges.map((range, index) => (
            <div key={index} className="flex items-center gap-2">
              <Checkbox
                id={`col-price-${index}`}
                checked={selectedPriceRange === index}
                onCheckedChange={() =>
                  setSelectedPriceRange(
                    selectedPriceRange === index ? null : index
                  )
                }
              />
              <Label
                htmlFor={`col-price-${index}`}
                className="text-sm font-normal cursor-pointer"
              >
                {range.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Other Categories */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Danh mục khác</h3>
        <div className="space-y-1">
          {otherCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/collections/${cat.slug}`}
              className="flex items-center justify-between rounded-lg px-2 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <span>{cat.name}</span>
              <span className="text-xs">{cat.productCount}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Collection Hero Banner */}
      <section className="relative h-48 sm:h-64 lg:h-72 overflow-hidden">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pb-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm text-white/60 mb-3">
              <Link href="/" className="hover:text-white transition-colors">
                Trang chủ
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link
                href="/collections"
                className="hover:text-white transition-colors"
              >
                Bộ sưu tập
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-white font-medium">{category.name}</span>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-3xl sm:text-4xl font-bold font-heading text-white">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-white/70 mt-2 max-w-lg">
                  {category.description}
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Bộ lọc
                </h2>
                {activeFilters > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-accent hover:underline"
                  >
                    Xóa
                  </button>
                )}
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                {/* Mobile Filter */}
                <Sheet>
                  <SheetTrigger
                    className="inline-flex shrink-0 items-center justify-center rounded-lg border border-input bg-transparent text-sm font-medium whitespace-nowrap transition-colors h-7 gap-1 px-2.5 lg:hidden hover:bg-muted"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-1.5" />
                    Bộ lọc
                    {activeFilters > 0 && (
                      <Badge className="ml-1.5 h-5 w-5 p-0 justify-center bg-accent text-accent-foreground text-[10px]">
                        {activeFilters}
                      </Badge>
                    )}
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 p-6">
                    <SheetHeader>
                      <SheetTitle className="flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4" />
                        Bộ lọc
                      </SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterPanel />
                    </div>
                  </SheetContent>
                </Sheet>

                <p className="text-sm text-muted-foreground">
                  {categoryProducts.length} sản phẩm
                </p>

                {/* Active Price Filter */}
                {selectedPriceRange !== null && (
                  <Badge variant="secondary" className="gap-1 pr-1 hidden sm:flex">
                    {priceRanges[selectedPriceRange].label}
                    <button
                      onClick={() => setSelectedPriceRange(null)}
                      className="p-0.5 hover:bg-foreground/10 rounded"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Grid Toggle */}
                <div className="hidden sm:flex items-center border rounded-lg">
                  <button
                    onClick={() => setGridCols(3)}
                    className={`p-1.5 transition-colors ${gridCols === 3 ? "bg-secondary" : "hover:bg-secondary/50"}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setGridCols(4)}
                    className={`p-1.5 transition-colors ${gridCols === 4 ? "bg-secondary" : "hover:bg-secondary/50"}`}
                  >
                    <LayoutList className="h-4 w-4" />
                  </button>
                </div>

                {/* Sort */}
                <Select value={sort} onValueChange={(v) => v && setSort(v)}>
                  <SelectTrigger className="w-[180px] h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid */}
            {categoryProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg font-medium mb-2">
                  Không tìm thấy sản phẩm
                </p>
                <p className="text-muted-foreground mb-4">
                  Thử thay đổi bộ lọc hoặc xem danh mục khác
                </p>
                <div className="flex gap-3 justify-center">
                  {activeFilters > 0 && (
                    <Button variant="outline" onClick={clearFilters}>
                      Xóa bộ lọc
                    </Button>
                  )}
                  <Button render={<Link href="/products" />}>
                    Tất cả sản phẩm
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className={`grid gap-4 sm:gap-6 ${
                  gridCols === 3
                    ? "grid-cols-2 sm:grid-cols-3"
                    : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                }`}
              >
                {categoryProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Browse Other Categories */}
        {otherCategories.length > 0 && (
          <section className="mt-16 pt-8 border-t">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold font-heading">
                Danh mục khác
              </h2>
              <Link
                href="/collections"
                className="flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
              >
                Xem tất cả
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {otherCategories.slice(0, 5).map((cat, index) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * index }}
                >
                  <Link
                    href={`/collections/${cat.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-[3/2] rounded-xl overflow-hidden bg-secondary">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-2.5 left-3 right-3">
                        <p className="text-white text-sm font-semibold">
                          {cat.name}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
