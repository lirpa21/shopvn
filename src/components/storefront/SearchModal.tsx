"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { type Product } from "@/lib/mock-data";
import { useProductManagement } from "@/stores/product-store";
import { formatPrice, calcDiscount } from "@/lib/format";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const allProducts = useProductManagement((s) => s.products);

  const doSearch = useCallback((q: string) => {
    if (q.trim().length === 0) {
      setResults([]);
      return;
    }
    const lower = q.toLowerCase();
    const found = allProducts.filter(
      (p) =>
        p.status === "ACTIVE" &&
        (p.title.toLowerCase().includes(lower) ||
          p.description.toLowerCase().includes(lower) ||
          p.tags.some((t) => t.toLowerCase().includes(lower)))
    );
    setResults(found);
  }, [allProducts]);

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 200);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">Tìm kiếm sản phẩm</DialogTitle>
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm sản phẩm, danh mục..."
            className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim().length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">
                Nhập từ khóa để tìm kiếm sản phẩm
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <p className="text-sm">
                Không tìm thấy sản phẩm cho &quot;{query}&quot;
              </p>
            </div>
          ) : (
            <div className="p-2">
              {results.map((product) => {
                const discount = product.comparePrice
                  ? calcDiscount(product.price, product.comparePrice)
                  : 0;
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={() => {
                      onOpenChange(false);
                      setQuery("");
                    }}
                    className="flex items-center gap-3 rounded-lg p-2 hover:bg-secondary transition-colors"
                  >
                    <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-secondary shrink-0">
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {product.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm font-semibold text-accent">
                          {formatPrice(product.price)}
                        </span>
                        {discount > 0 && (
                          <span className="text-xs text-muted-foreground line-through">
                            {formatPrice(product.comparePrice!)}
                          </span>
                        )}
                      </div>
                    </div>
                    {discount > 0 && (
                      <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                        -{discount}%
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
