"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  SlidersHorizontal,
  Grid3X3,
  LayoutList,
  ChevronDown,
  X,
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import ProductCard from "@/components/storefront/ProductCard";
import { useCategoryManagement } from "@/stores/category-store";
import { useProductManagement } from "@/stores/product-store";
import { formatPrice } from "@/lib/format";

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

export default function ProductsPage() {
  const allProducts = useProductManagement((s) => s.products);
  const categories = useCategoryManagement((s) => s.categories);
  const [sort, setSort] = useState("newest");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(4);

  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter((p) => p.status === "ACTIVE");

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.categorySlug)
      );
    }

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
  }, [sort, selectedCategories, selectedPriceRange]);

  const activeFilters =
    selectedCategories.length + (selectedPriceRange !== null ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRange(null);
  };

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Danh mục</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${cat.id}`}
                checked={selectedCategories.includes(cat.slug)}
                onCheckedChange={() => toggleCategory(cat.slug)}
              />
              <Label
                htmlFor={`cat-${cat.id}`}
                className="text-sm font-normal cursor-pointer flex-1 flex justify-between"
              >
                <span>{cat.name}</span>
                <span className="text-muted-foreground text-xs">
                  {cat.productCount}
                </span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Khoảng giá</h3>
        <div className="space-y-2">
          {priceRanges.map((range, index) => (
            <div key={index} className="flex items-center gap-2">
              <Checkbox
                id={`price-${index}`}
                checked={selectedPriceRange === index}
                onCheckedChange={() =>
                  setSelectedPriceRange(
                    selectedPriceRange === index ? null : index
                  )
                }
              />
              <Label
                htmlFor={`price-${index}`}
                className="text-sm font-normal cursor-pointer"
              >
                {range.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading">Tất cả sản phẩm</h1>
        <p className="text-muted-foreground mt-1">
          {filteredProducts.length} sản phẩm
        </p>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Bộ lọc
              </h2>
              {activeFilters > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-accent hover:underline"
                >
                  Xóa tất cả
                </button>
              )}
            </div>
            <FilterSidebar />
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
                    <FilterSidebar />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Active Filters */}
              {activeFilters > 0 && (
                <div className="hidden sm:flex items-center gap-2 flex-wrap">
                  {selectedCategories.map((slug) => {
                    const cat = categories.find((c) => c.slug === slug);
                    return (
                      <Badge
                        key={slug}
                        variant="secondary"
                        className="gap-1 pr-1"
                      >
                        {cat?.name}
                        <button
                          onClick={() => toggleCategory(slug)}
                          className="p-0.5 hover:bg-foreground/10 rounded"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                  {selectedPriceRange !== null && (
                    <Badge variant="secondary" className="gap-1 pr-1">
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
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg font-medium mb-2">
                Không tìm thấy sản phẩm
              </p>
              <p className="text-muted-foreground mb-4">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
              </p>
              <Button variant="outline" onClick={clearAllFilters}>
                Xóa bộ lọc
              </Button>
            </div>
          ) : (
            <div
              className={`grid gap-4 sm:gap-6 ${
                gridCols === 3
                  ? "grid-cols-2 sm:grid-cols-3"
                  : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
              }`}
            >
              {filteredProducts.map((product, index) => (
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
    </div>
  );
}
