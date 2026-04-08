"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Package,
  Filter,
  ArrowUpDown,
  X,
  ImagePlus,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useProductManagement,
  generateProductId,
  generateSlug,
} from "@/stores/product-store";
import { useCategoryManagement } from "@/stores/category-store";
import type { Product, VariantOption, ProductVariant } from "@/lib/mock-data";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";

type StatusFilter = "all" | "ACTIVE" | "DRAFT" | "ARCHIVED";

// ========== Variant Builder Types ==========

interface VariantOptionForm {
  name: string; // "Màu sắc", "Size", "Dung tích", or custom
  values: string; // comma separated
  colorHexes: Record<string, string>; // value -> hex
}

interface VariantRowForm {
  options: Record<string, string>;
  sku: string;
  stock: number;
  price: string; // empty = use base price
  comparePrice: string;
  colorHex?: string;
  image?: string;
}

const PRESET_OPTIONS = ["Màu sắc", "Size", "Dung tích", "Chất liệu", "Khác"];

// ========== Product Form Modal ==========

interface ProductFormProps {
  product?: Product | null;
  allProducts: Product[];
  onSave: (data: Product) => void;
  onClose: () => void;
}

function ProductFormModal({ product, allProducts, onSave, onClose }: ProductFormProps) {
  const isEdit = Boolean(product);
  const categories = useCategoryManagement((s) => s.categories);
  const [form, setForm] = useState({
    title: product?.title || "",
    sku: product?.sku || "",
    description: product?.description || "",
    price: product?.price || 0,
    comparePrice: product?.comparePrice || 0,
    category: product?.category || categories[0]?.name || "",
    categorySlug: product?.categorySlug || categories[0]?.slug || "",
    stock: product?.stock || 0,
    status: product?.status || "ACTIVE" as Product["status"],
    featured: product?.featured || false,
    vendor: product?.vendor || "",
    tags: product?.tags?.join(", ") || "",
    images: product?.images?.join("\n") || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ===== Variant state =====
  const [hasVariants, setHasVariants] = useState(
    Boolean(product?.variantOptions?.length)
  );
  const [variantOptions, setVariantOptions] = useState<VariantOptionForm[]>(() => {
    if (!product?.variantOptions?.length) return [];
    return product.variantOptions.map((opt) => ({
      name: opt.name,
      values: opt.values.join(", "),
      colorHexes: (() => {
        const map: Record<string, string> = {};
        if ((opt.name === "Màu sắc" || opt.name.toLowerCase().includes("color")) && product.variants) {
          opt.values.forEach((val) => {
            const v = product.variants!.find(
              (vr) => vr.options[opt.name] === val && vr.colorHex
            );
            if (v?.colorHex) map[val] = v.colorHex;
          });
        }
        return map;
      })(),
    }));
  });
  const [variantRows, setVariantRows] = useState<VariantRowForm[]>(() => {
    if (!product?.variants?.length) return [];
    return product.variants.map((v) => ({
      options: { ...v.options },
      sku: v.sku || "",
      stock: v.stock,
      price: v.price ? String(v.price) : "",
      comparePrice: v.comparePrice ? String(v.comparePrice) : "",
      colorHex: v.colorHex,
      image: v.image,
    }));
  });

  const isColorOption = (name: string) =>
    name === "Màu sắc" || name.toLowerCase().includes("color") || name.toLowerCase().includes("màu");

  // Parse comma-separated values from an option
  const parseValues = (str: string) =>
    str.split(",").map((s) => s.trim()).filter(Boolean);

  // Generate variant combinations from options
  const generateCombinations = () => {
    const parsed = variantOptions
      .filter((o) => o.name && o.values.trim())
      .map((o) => ({
        name: o.name,
        values: parseValues(o.values),
        colorHexes: o.colorHexes,
      }));

    if (parsed.length === 0) {
      setVariantRows([]);
      return;
    }

    // Build cartesian product
    let combos: Record<string, string>[] = parsed[0].values.map((v) => ({
      [parsed[0].name]: v,
    }));

    for (let i = 1; i < parsed.length; i++) {
      const next: Record<string, string>[] = [];
      combos.forEach((existing) => {
        parsed[i].values.forEach((v) => {
          next.push({ ...existing, [parsed[i].name]: v });
        });
      });
      combos = next;
    }

    // Preserve existing row data if options match
    const newRows: VariantRowForm[] = combos.map((combo) => {
      const existing = variantRows.find((r) =>
        Object.entries(combo).every(([k, v]) => r.options[k] === v)
      );
      if (existing) return { ...existing, options: combo };

      // Get colorHex from parsed options
      let colorHex: string | undefined;
      parsed.forEach((p) => {
        if (isColorOption(p.name) && p.colorHexes[combo[p.name]]) {
          colorHex = p.colorHexes[combo[p.name]];
        }
      });

      // Auto-generate SKU from product SKU + option values
      const baseSku = form.sku.trim();
      const optionParts = Object.values(combo).map((v) =>
        v.toUpperCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove diacritics
          .replace(/đ/gi, "D")
          .replace(/[^A-Z0-9]/g, "")
      );
      const autoSku = baseSku
        ? [baseSku, ...optionParts].join("-")
        : "";

      return {
        options: combo,
        sku: autoSku,
        stock: 10,
        price: "",
        comparePrice: "",
        colorHex,
      };
    });

    setVariantRows(newRows);
  };

  // Add new option group
  const addOption = () => {
    if (variantOptions.length >= 2) return;
    setVariantOptions([...variantOptions, { name: "", values: "", colorHexes: {} }]);
  };

  // Remove option group
  const removeOption = (index: number) => {
    const updated = variantOptions.filter((_, i) => i !== index);
    setVariantOptions(updated);
    // Regenerate with timeout to let state update
    setTimeout(() => generateCombinations(), 0);
  };

  // Update option
  const updateOption = (index: number, field: keyof VariantOptionForm, value: string | Record<string, string>) => {
    const updated = [...variantOptions];
    if (field === "colorHexes") {
      updated[index] = { ...updated[index], colorHexes: value as Record<string, string> };
    } else {
      updated[index] = { ...updated[index], [field]: value as string };
    }
    setVariantOptions(updated);
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Tên sản phẩm không được để trống";
    if (form.price < 1000) e.price = "Giá tối thiểu 1.000₫";
    if (form.comparePrice > 0 && form.comparePrice <= form.price)
      e.comparePrice = "Giá so sánh phải lớn hơn giá bán";
    if (!hasVariants && form.stock < 0) e.stock = "Tồn kho không được âm";
    if (!form.description.trim()) e.description = "Mô tả không được để trống";
    if (hasVariants) {
      const validOpts = variantOptions.filter(
        (o) => o.name && o.values.trim()
      );
      if (validOpts.length === 0) e.variants = "Cần ít nhất 1 nhóm phân loại";
      if (variantRows.length === 0) e.variants = "Chưa tạo phân loại. Nhấn \"Tạo phân loại\"";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCategoryChange = (catName: string) => {
    const cat = categories.find((c) => c.name === catName);
    setForm({
      ...form,
      category: catName,
      categorySlug: cat?.slug || generateSlug(catName),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const images = form.images
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    if (images.length === 0) {
      images.push("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop");
    }

    const slug = isEdit ? product!.slug : generateSlug(form.title);
    const id = isEdit ? product!.id : generateProductId(allProducts);

    // Build variant data
    let variantOptionsFinal: VariantOption[] | undefined;
    let variantsFinal: ProductVariant[] | undefined;

    if (hasVariants && variantRows.length > 0) {
      variantOptionsFinal = variantOptions
        .filter((o) => o.name && o.values.trim())
        .map((o) => ({
          name: o.name,
          values: parseValues(o.values),
        }));

      variantsFinal = variantRows.map((row, idx) => {
        const variantId = `${id}-v${idx}`;
        const variant: ProductVariant = {
          id: variantId,
          options: row.options,
          stock: row.stock,
        };
        if (row.sku) variant.sku = row.sku;
        if (row.price) variant.price = Number(row.price);
        if (row.comparePrice) variant.comparePrice = Number(row.comparePrice);
        if (row.colorHex) variant.colorHex = row.colorHex;
        if (row.image) variant.image = row.image;
        return variant;
      });
    }

    // Calculate total stock from variants
    const totalStock = hasVariants && variantRows.length > 0
      ? variantRows.reduce((sum, r) => sum + r.stock, 0)
      : form.stock;

    onSave({
      id,
      sku: form.sku.trim() || undefined,
      title: form.title.trim(),
      slug,
      description: form.description.trim(),
      price: form.price,
      comparePrice: form.comparePrice > 0 ? form.comparePrice : undefined,
      images,
      category: form.category,
      categorySlug: form.categorySlug,
      rating: product?.rating || 0,
      reviewCount: product?.reviewCount || 0,
      stock: totalStock,
      status: form.status,
      featured: form.featured,
      vendor: form.vendor.trim() || undefined,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      createdAt: product?.createdAt || new Date().toISOString(),
      variantOptions: variantOptionsFinal,
      variants: variantsFinal,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-card rounded-2xl border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-card border-b px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
          <h2 className="text-lg font-bold font-heading flex items-center gap-2">
            <Package className="h-5 w-5 text-accent" />
            {isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-secondary transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Tên sản phẩm *</label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="VD: Áo Polo Premium Cotton"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* SKU */}
          <div>
            <label className="block text-sm font-medium mb-1.5">SKU (Mã sản phẩm)</label>
            <Input
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value.toUpperCase() })}
              placeholder="VD: AP-POLO-001"
              className="font-mono text-xs uppercase"
            />
            <p className="text-[10px] text-muted-foreground mt-1">
              Mã định danh sản phẩm. Để trống sẽ tự động tạo.
            </p>
          </div>

          {/* Price + Compare Price + Stock */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Giá bán (₫) *</label>
              <Input
                type="number"
                value={form.price || ""}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                placeholder="450000"
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Giá so sánh (₫)</label>
              <Input
                type="number"
                value={form.comparePrice || ""}
                onChange={(e) => setForm({ ...form, comparePrice: Number(e.target.value) })}
                placeholder="650000"
                className={errors.comparePrice ? "border-red-500" : ""}
              />
              {errors.comparePrice && <p className="text-xs text-red-500 mt-1">{errors.comparePrice}</p>}
            </div>
            {!hasVariants && (
              <div>
                <label className="block text-sm font-medium mb-1.5">Tồn kho *</label>
                <Input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                  placeholder="100"
                  className={errors.stock ? "border-red-500" : ""}
                />
                {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock}</p>}
              </div>
            )}
          </div>

          {/* Category + Vendor */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Danh mục *</label>
              <Select value={form.category} onValueChange={(v) => v && handleCategoryChange(v)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.slug} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Thương hiệu</label>
              <Input
                value={form.vendor}
                onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                placeholder="VD: ShopVN Original"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Mô tả *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Mô tả chi tiết sản phẩm..."
              rows={3}
              className={`w-full rounded-xl border px-3 py-2 text-sm bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 ${
                errors.description ? "border-red-500" : "border-border"
              }`}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          {/* ========== VARIANT BUILDER ========== */}
          <div className="border border-dashed border-border rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasVariants}
                  onChange={(e) => {
                    setHasVariants(e.target.checked);
                    if (!e.target.checked) {
                      setVariantOptions([]);
                      setVariantRows([]);
                    }
                  }}
                  className="rounded"
                />
                <span className="text-sm font-semibold">Sản phẩm có phân loại</span>
              </label>
              {hasVariants && (
                <span className="text-[10px] text-muted-foreground">
                  Tối đa 2 nhóm phân loại
                </span>
              )}
            </div>

            {hasVariants && (
              <div className="space-y-4">
                {/* Option Groups */}
                <AnimatePresence mode="popLayout">
                  {variantOptions.map((opt, optIdx) => (
                    <motion.div
                      key={optIdx}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-secondary/50 rounded-xl p-3 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Phân loại {optIdx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeOption(optIdx)}
                          className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Option Name */}
                      <div className="flex gap-2">
                        <Select
                          value={PRESET_OPTIONS.includes(opt.name) ? opt.name : "Khác"}
                          onValueChange={(v) => {
                            if (v && v !== "Khác") {
                              updateOption(optIdx, "name", v);
                            } else if (v === "Khác") {
                              updateOption(optIdx, "name", "");
                            }
                          }}
                        >
                          <SelectTrigger className="w-[140px] rounded-lg text-xs h-9">
                            <SelectValue placeholder="Chọn loại" />
                          </SelectTrigger>
                          <SelectContent>
                            {PRESET_OPTIONS.map((p) => (
                              <SelectItem key={p} value={p}>{p}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {!PRESET_OPTIONS.includes(opt.name) && (
                          <Input
                            value={opt.name}
                            onChange={(e) => updateOption(optIdx, "name", e.target.value)}
                            placeholder="Tên phân loại..."
                            className="h-9 text-xs flex-1"
                          />
                        )}
                      </div>

                      {/* Option Values */}
                      <div>
                        <Input
                          value={opt.values}
                          onChange={(e) => updateOption(optIdx, "values", e.target.value)}
                          placeholder={
                            isColorOption(opt.name)
                              ? "VD: Đen, Trắng, Xanh navy"
                              : opt.name === "Size"
                              ? "VD: S, M, L, XL, XXL"
                              : opt.name === "Dung tích"
                              ? "VD: 30ml, 50ml, 100ml"
                              : "Nhập các giá trị, phân cách bằng dấu phẩy"
                          }
                          className="h-9 text-xs"
                        />
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Phân cách bằng dấu phẩy
                        </p>
                      </div>

                      {/* Color Hex for color options */}
                      {isColorOption(opt.name) && parseValues(opt.values).length > 0 && (
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                            Mã màu (hex)
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {parseValues(opt.values).map((val) => (
                              <div key={val} className="flex items-center gap-1.5 bg-card rounded-lg px-2 py-1 border">
                                <input
                                  type="color"
                                  value={opt.colorHexes[val] || "#000000"}
                                  onChange={(e) => {
                                    updateOption(optIdx, "colorHexes", {
                                      ...opt.colorHexes,
                                      [val]: e.target.value,
                                    });
                                  }}
                                  className="w-5 h-5 rounded border-0 cursor-pointer bg-transparent"
                                />
                                <span className="text-[11px]">{val}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Add Option Button */}
                {variantOptions.length < 2 && (
                  <button
                    type="button"
                    onClick={addOption}
                    className="w-full py-2 rounded-xl border border-dashed border-border text-xs font-medium text-muted-foreground hover:border-accent hover:text-accent transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Thêm nhóm phân loại
                  </button>
                )}

                {/* Generate Button */}
                {variantOptions.some((o) => o.name && o.values.trim()) && (
                  <Button
                    type="button"
                    onClick={generateCombinations}
                    className="w-full rounded-xl h-9 text-xs bg-accent/10 text-accent hover:bg-accent/20 border border-accent/20"
                  >
                    <ArrowUpDown className="h-3.5 w-3.5 mr-1.5" />
                    Tạo phân loại ({variantOptions
                      .filter((o) => o.name && o.values.trim())
                      .reduce((acc, o) => acc * Math.max(parseValues(o.values).length, 1), 1)}{" "}
                    tổ hợp)
                  </Button>
                )}

                {/* Variant Rows Table */}
                {variantRows.length > 0 && (
                  <div className="rounded-xl border overflow-hidden">
                    {/* Bulk Apply Row */}
                    <div className="bg-accent/5 border-b px-3 py-2 flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider shrink-0 mr-auto">
                        Áp dụng tất cả:
                      </span>
                      <input
                        type="number"
                        id="bulk-stock"
                        placeholder="Tồn kho"
                        className="w-20 h-7 text-xs text-right rounded-lg border border-border px-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-accent/30"
                      />
                      <input
                        type="number"
                        id="bulk-price"
                        placeholder="Giá riêng"
                        className="w-24 h-7 text-xs text-right rounded-lg border border-border px-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-accent/30"
                      />
                      <input
                        type="number"
                        id="bulk-compare-price"
                        placeholder="Giá so sánh"
                        className="w-24 h-7 text-xs text-right rounded-lg border border-border px-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-accent/30"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const stockEl = document.getElementById("bulk-stock") as HTMLInputElement;
                          const priceEl = document.getElementById("bulk-price") as HTMLInputElement;
                          const comparePriceEl = document.getElementById("bulk-compare-price") as HTMLInputElement;
                          const bulkStock = stockEl?.value;
                          const bulkPrice = priceEl?.value;
                          const bulkComparePrice = comparePriceEl?.value;
                          if (!bulkStock && !bulkPrice && !bulkComparePrice) return;
                          setVariantRows((prev) =>
                            prev.map((r) => ({
                              ...r,
                              ...(bulkStock ? { stock: Number(bulkStock) } : {}),
                              ...(bulkPrice ? { price: bulkPrice } : {}),
                              ...(bulkComparePrice ? { comparePrice: bulkComparePrice } : {}),
                            }))
                          );
                        }}
                        className="h-7 px-3 rounded-lg bg-accent text-accent-foreground text-[11px] font-medium hover:bg-accent/90 transition-colors shrink-0"
                      >
                        Áp dụng
                      </button>
                    </div>

                    <div className="overflow-x-auto max-h-[250px] overflow-y-auto">
                      <table className="w-full text-xs">
                        <thead className="sticky top-0 bg-secondary">
                          <tr className="border-b">
                            <th className="text-left px-3 py-2 font-medium">Phân loại</th>
                            <th className="text-left px-3 py-2 font-medium w-[100px]">SKU</th>
                            <th className="text-right px-3 py-2 font-medium w-[70px]">Tồn kho</th>
                            <th className="text-right px-3 py-2 font-medium w-[85px]">Giá riêng</th>
                            <th className="text-right px-3 py-2 font-medium w-[85px]">Giá so sánh</th>
                          </tr>
                        </thead>
                        <tbody>
                          {variantRows.map((row, rowIdx) => (
                            <tr key={rowIdx} className="border-b last:border-0 hover:bg-secondary/30">
                              <td className="px-3 py-1.5">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {row.colorHex && (
                                    <span
                                      className="inline-block w-4 h-4 rounded-full border border-border shrink-0"
                                      style={{ backgroundColor: row.colorHex }}
                                    />
                                  )}
                                  {Object.values(row.options).map((v, i) => (
                                    <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">
                                      {v}
                                    </Badge>
                                  ))}
                                </div>
                              </td>
                              <td className="px-3 py-1.5">
                                <input
                                  type="text"
                                  value={row.sku}
                                  onChange={(e) => {
                                    const updated = [...variantRows];
                                    updated[rowIdx] = { ...row, sku: e.target.value.toUpperCase() };
                                    setVariantRows(updated);
                                  }}
                                  placeholder="Tự động"
                                  className="w-full h-7 text-[10px] font-mono uppercase rounded-lg border border-border px-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-accent/30 placeholder:text-muted-foreground/50 placeholder:normal-case"
                                />
                              </td>
                              <td className="px-3 py-1.5">
                                <input
                                  type="number"
                                  value={row.stock}
                                  onChange={(e) => {
                                    const updated = [...variantRows];
                                    updated[rowIdx] = { ...row, stock: Number(e.target.value) || 0 };
                                    setVariantRows(updated);
                                  }}
                                  className="w-full h-7 text-xs text-right rounded-lg border border-border px-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-accent/30"
                                />
                              </td>
                              <td className="px-3 py-1.5">
                                <input
                                  type="number"
                                  value={row.price}
                                  onChange={(e) => {
                                    const updated = [...variantRows];
                                    updated[rowIdx] = { ...row, price: e.target.value };
                                    setVariantRows(updated);
                                  }}
                                  placeholder="Mặc định"
                                  className="w-full h-7 text-xs text-right rounded-lg border border-border px-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-accent/30 placeholder:text-muted-foreground/50"
                                />
                              </td>
                              <td className="px-3 py-1.5">
                                <input
                                  type="number"
                                  value={row.comparePrice}
                                  onChange={(e) => {
                                    const updated = [...variantRows];
                                    updated[rowIdx] = { ...row, comparePrice: e.target.value };
                                    setVariantRows(updated);
                                  }}
                                  placeholder="Mặc định"
                                  className="w-full h-7 text-xs text-right rounded-lg border border-border px-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-accent/30 placeholder:text-muted-foreground/50"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="bg-secondary/50 px-3 py-1.5 text-[10px] text-muted-foreground border-t">
                      Tổng tồn kho: <strong className="text-foreground">
                        {variantRows.reduce((s, r) => s + r.stock, 0)}
                      </strong>
                      {" · "}Để trống &quot;Giá riêng&quot; sẽ dùng giá mặc định
                    </div>
                  </div>
                )}

                {errors.variants && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.variants}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              <ImagePlus className="inline h-3.5 w-3.5 mr-1" />
              Hình ảnh (mỗi URL trên 1 dòng)
            </label>
            <textarea
              value={form.images}
              onChange={(e) => setForm({ ...form, images: e.target.value })}
              placeholder={"https://images.unsplash.com/photo-xxx\nhttps://images.unsplash.com/photo-yyy"}
              rows={3}
              className="w-full rounded-xl border border-border px-3 py-2 text-xs font-mono bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
            <p className="text-[10px] text-muted-foreground mt-1">
              Nếu để trống sẽ dùng ảnh mặc định
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Thẻ tag (phân cách bằng dấu phẩy)</label>
            <Input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="VD: bán chạy, cao cấp, mới"
            />
          </div>

          {/* Status + Featured */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1.5">Trạng thái</label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v as Product["status"] })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Đang bán</SelectItem>
                  <SelectItem value="DRAFT">Nháp</SelectItem>
                  <SelectItem value="ARCHIVED">Ẩn</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm font-medium">Nổi bật</span>
              </label>
            </div>
          </div>

          <Separator />

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" className="flex-1 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground">
              {isEdit ? "Cập nhật" : "Thêm sản phẩm"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ========== Main Admin Products Page ==========

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, toggleStatus } = useProductManagement();
  const categories = useCategoryManagement((s) => s.categories);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          !search ||
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase()) ||
          p.vendor?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus =
          statusFilter === "all" || p.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "name-asc":
            return a.title.localeCompare(b.title);
          case "name-desc":
            return b.title.localeCompare(a.title);
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          case "stock-low":
            return a.stock - b.stock;
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  }, [products, search, statusFilter, sortBy]);

  const stats = useMemo(() => ({
    total: products.length,
    active: products.filter((p) => p.status === "ACTIVE").length,
    draft: products.filter((p) => p.status === "DRAFT").length,
    archived: products.filter((p) => p.status === "ARCHIVED").length,
    lowStock: products.filter((p) => p.stock < 50 && p.status === "ACTIVE").length,
  }), [products]);

  const statusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "DRAFT":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "ARCHIVED":
        return "bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400";
      default:
        return "";
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE": return "Đang bán";
      case "DRAFT": return "Nháp";
      case "ARCHIVED": return "Ẩn";
      default: return status;
    }
  };

  const handleSave = (data: Product) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
      toast.success(`Đã cập nhật "${data.title}"`);
    } else {
      const ok = addProduct(data);
      if (!ok) {
        toast.error("Sản phẩm đã tồn tại!");
        return;
      }
      toast.success(`Đã thêm "${data.title}"`);
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleDelete = (product: Product) => {
    deleteProduct(product.id);
    setDeleteConfirm(null);
    toast.success(`Đã xóa "${product.title}"`);
  };

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-secondary rounded-xl animate-pulse" />
        <div className="h-20 bg-secondary rounded-xl animate-pulse" />
        <div className="h-96 bg-secondary rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-heading">Sản phẩm</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý {stats.total} sản phẩm trong cửa hàng
          </p>
        </div>
        <Button
          onClick={() => { setEditingProduct(null); setShowForm(true); }}
          className="rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Tổng", value: stats.total, color: "text-foreground", bg: "bg-secondary" },
          { label: "Đang bán", value: stats.active, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          { label: "Nháp", value: stats.draft, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { label: "Ẩn", value: stats.archived, color: "text-gray-500", bg: "bg-gray-50 dark:bg-gray-900/20" },
          { label: "Tồn kho thấp", value: stats.lowStock, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-3 border`}>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
            <p className={`text-xl font-bold ${s.color} mt-0.5`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card rounded-2xl border p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 rounded-xl"
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={statusFilter}
              onValueChange={(v) => v && setStatusFilter(v as StatusFilter)}
            >
              <SelectTrigger className="w-[140px] h-10 rounded-xl">
                <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="ACTIVE">Đang bán</SelectItem>
                <SelectItem value="DRAFT">Nháp</SelectItem>
                <SelectItem value="ARCHIVED">Ẩn</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortBy}
              onValueChange={(v) => v && setSortBy(v)}
            >
              <SelectTrigger className="w-[160px] h-10 rounded-xl">
                <ArrowUpDown className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="name-asc">Tên A→Z</SelectItem>
                <SelectItem value="name-desc">Tên Z→A</SelectItem>
                <SelectItem value="price-asc">Giá thấp→cao</SelectItem>
                <SelectItem value="price-desc">Giá cao→thấp</SelectItem>
                <SelectItem value="stock-low">Tồn kho thấp</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <th className="text-left px-5 py-3 font-medium">Sản phẩm</th>
                <th className="text-left px-5 py-3 font-medium">Danh mục</th>
                <th className="text-left px-5 py-3 font-medium">Trạng thái</th>
                <th className="text-right px-5 py-3 font-medium">Giá</th>
                <th className="text-right px-5 py-3 font-medium">Tồn kho</th>
                <th className="text-right px-5 py-3 font-medium">Đánh giá</th>
                <th className="text-center px-5 py-3 font-medium w-[60px]"></th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b last:border-0 hover:bg-secondary/50 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-secondary shrink-0">
                          <Image
                            src={product.images[0]}
                            alt={product.title}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate max-w-[200px]">
                            {product.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            SKU: {product.sku || `SP${product.id.padStart(4, "0")}`}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm text-muted-foreground">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColor(product.status)}`}
                      >
                        {statusLabel(product.status)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div>
                        <p className="text-sm font-semibold">
                          {formatPrice(product.price)}
                        </p>
                        {product.comparePrice && (
                          <p className="text-xs text-muted-foreground line-through">
                            {formatPrice(product.comparePrice)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span
                        className={`text-sm font-medium ${
                          product.stock < 50
                            ? "text-amber-600"
                            : "text-foreground"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-amber-500 text-xs">★</span>
                        <span className="text-sm">{product.rating}</span>
                        <span className="text-xs text-muted-foreground">
                          ({product.reviewCount})
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem
                            className="gap-2 text-base cursor-pointer"
                            onClick={() => window.open(`/products/${product.slug}`, "_blank")}
                          >
                            <Eye className="h-3.5 w-3.5" /> Xem ngoài shop
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 text-base cursor-pointer"
                            onClick={() => { setEditingProduct(product); setShowForm(true); }}
                          >
                            <Pencil className="h-3.5 w-3.5" /> Sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 text-base cursor-pointer"
                            onClick={() => toggleStatus(product.id)}
                          >
                            {product.status === "ACTIVE" ? (
                              <><ToggleLeft className="h-3.5 w-3.5" /> Ẩn sản phẩm</>
                            ) : (
                              <><ToggleRight className="h-3.5 w-3.5" /> Bật bán</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 text-base text-destructive cursor-pointer"
                            onClick={() => setDeleteConfirm(product)}
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium">Không tìm thấy sản phẩm</p>
            <p className="text-xs text-muted-foreground mt-1">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        )}
      </motion.div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <ProductFormModal
            product={editingProduct}
            allProducts={products}
            onSave={handleSave}
            onClose={() => { setShowForm(false); setEditingProduct(null); }}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setDeleteConfirm(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-card rounded-2xl border shadow-2xl p-6 w-full max-w-sm"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold">Xóa sản phẩm?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="font-medium text-foreground">&quot;{deleteConfirm.title}&quot;</span>{" "}
                    sẽ bị xóa vĩnh viễn khỏi cửa hàng.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setDeleteConfirm(null)}>
                  Hủy
                </Button>
                <Button
                  className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleDelete(deleteConfirm)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
