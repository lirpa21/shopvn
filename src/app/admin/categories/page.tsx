"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  FolderTree,
  X,
  AlertCircle,
  ImageIcon,
  Package,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  useCategoryManagement,
  generateCategoryId,
} from "@/stores/category-store";
import { useProductManagement } from "@/stores/product-store";
import type { Category } from "@/lib/mock-data";
import { toast } from "sonner";

// ========== Slug Generator ==========

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ========== Category Form Modal ==========

interface CategoryFormProps {
  category?: Category | null;
  allCategories: Category[];
  onSave: (data: Category) => void;
  onClose: () => void;
}

function CategoryFormModal({
  category,
  allCategories,
  onSave,
  onClose,
}: CategoryFormProps) {
  const isEdit = Boolean(category);
  const [form, setForm] = useState({
    name: category?.name || "",
    description: category?.description || "",
    image: category?.image || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState(category?.image || "");

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Tên danh mục không được để trống";
    if (!form.image.trim()) e.image = "URL hình ảnh không được để trống";
    // Check duplicate name
    const slug = generateSlug(form.name);
    const existing = allCategories.find(
      (c) => c.slug === slug && c.id !== category?.id
    );
    if (existing) e.name = "Danh mục này đã tồn tại";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const slug = isEdit ? category!.slug : generateSlug(form.name);
    const id = isEdit ? category!.id : generateCategoryId(allCategories);

    onSave({
      id,
      name: form.name.trim(),
      slug,
      description: form.description.trim() || undefined,
      image: form.image.trim(),
      productCount: category?.productCount || 0,
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
        className="relative bg-card rounded-2xl border shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-card border-b px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
          <h2 className="text-lg font-bold font-heading flex items-center gap-2">
            <FolderTree className="h-5 w-5 text-accent" />
            {isEdit ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Tên danh mục *
            </label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="VD: Thời trang Nam"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
            {form.name && (
              <p className="text-[10px] text-muted-foreground mt-1">
                Slug: <span className="font-mono">{generateSlug(form.name)}</span>
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Mô tả</label>
            <Input
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="VD: Quần áo, phụ kiện thời trang nam"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              URL hình ảnh *
            </label>
            <Input
              value={form.image}
              onChange={(e) => {
                setForm({ ...form, image: e.target.value });
                setImagePreview(e.target.value);
              }}
              placeholder="https://images.unsplash.com/..."
              className={errors.image ? "border-red-500" : ""}
            />
            {errors.image && (
              <p className="text-xs text-red-500 mt-1">{errors.image}</p>
            )}
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-secondary border">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-cover"
                sizes="400px"
                onError={() => setImagePreview("")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <p className="text-white text-sm font-semibold">
                  {form.name || "Tên danh mục"}
                </p>
                {form.description && (
                  <p className="text-white/70 text-xs mt-0.5">
                    {form.description}
                  </p>
                )}
              </div>
            </div>
          )}

          {!imagePreview && form.image && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Không thể tải hình ảnh. Kiểm tra lại URL.
              </p>
            </div>
          )}

          <Separator />

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {isEdit ? "Cập nhật" : "Tạo danh mục"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ========== Main Admin Categories Page ==========

export default function AdminCategoriesPage() {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useCategoryManagement();
  const allProducts = useProductManagement((s) => s.products);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Count real products per category from store
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allProducts.forEach((p) => {
      if (p.status === "ACTIVE") {
        counts[p.categorySlug] = (counts[p.categorySlug] || 0) + 1;
      }
    });
    return counts;
  }, [allProducts]);

  // Filter & search
  const filtered = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [categories, search]);

  // Stats
  const stats = useMemo(
    () => ({
      total: categories.length,
      withProducts: categories.filter(
        (c) => (productCounts[c.slug] || 0) > 0
      ).length,
      totalProducts: Object.values(productCounts).reduce(
        (a, b) => a + b,
        0
      ),
    }),
    [categories, productCounts]
  );

  const handleSave = async (data: Category) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, data);
      toast.success(`Đã cập nhật danh mục "${data.name}"`);
    } else {
      const ok = await addCategory(data);
      if (!ok) {
        toast.error(`Danh mục "${data.name}" đã tồn tại!`);
        return;
      }
      toast.success(`Đã tạo danh mục "${data.name}"`);
    }
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleDelete = async (cat: Category) => {
    const count = productCounts[cat.slug] || 0;
    if (count > 0) {
      toast.error(
        `Không thể xóa! Danh mục "${cat.name}" đang có ${count} sản phẩm.`
      );
      setDeleteConfirm(null);
      return;
    }
    await deleteCategory(cat.id);
    setDeleteConfirm(null);
    toast.success(`Đã xóa danh mục "${cat.name}"`);
  };

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-secondary rounded-xl animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-secondary rounded-xl animate-pulse"
            />
          ))}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] bg-secondary rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading flex items-center gap-2">
            <FolderTree className="h-6 w-6 text-accent" />
            Danh mục
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Quản lý danh mục sản phẩm
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingCategory(null);
            setShowForm(true);
          }}
          className="rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm danh mục
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Tổng danh mục",
            value: stats.total,
            color: "text-foreground",
            bg: "bg-secondary",
          },
          {
            label: "Có sản phẩm",
            value: stats.withProducts,
            color: "text-emerald-600",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
          },
          {
            label: "Tổng sản phẩm",
            value: stats.totalProducts,
            color: "text-blue-600",
            bg: "bg-blue-50 dark:bg-blue-900/20",
          },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 border`}>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color} mt-1`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm danh mục..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rounded-xl"
        />
      </div>

      {/* Category Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-card border rounded-2xl">
          <FolderTree className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">Không tìm thấy danh mục</p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-accent text-sm hover:underline mt-2"
            >
              Xóa tìm kiếm
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((cat, index) => {
              const count = productCounts[cat.slug] || 0;
              return (
                <motion.div
                  key={cat.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="bg-card border rounded-2xl overflow-hidden group hover:shadow-lg transition-shadow"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Product count badge */}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white/90 text-foreground text-[10px] font-semibold gap-1 backdrop-blur-sm">
                        <Package className="h-3 w-3" />
                        {count} sản phẩm
                      </Badge>
                    </div>

                    {/* Category info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-lg leading-tight">
                        {cat.name}
                      </h3>
                      {cat.description && (
                        <p className="text-white/70 text-xs mt-1 line-clamp-1">
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Meta + Actions */}
                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-muted-foreground font-mono">
                        /{cat.slug}
                      </p>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            window.open(
                              `/collections/${cat.slug}`,
                              "_blank"
                            )
                          }
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                          title="Xem ngoài shop"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingCategory(cat);
                            setShowForm(true);
                          }}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                          title="Sửa"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(cat)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <CategoryFormModal
            category={editingCategory}
            allCategories={categories}
            onSave={handleSave}
            onClose={() => {
              setShowForm(false);
              setEditingCategory(null);
            }}
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
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold">Xóa danh mục?</h3>
                  <p className="text-sm text-muted-foreground">
                    Danh mục{" "}
                    <span className="font-semibold">
                      &quot;{deleteConfirm.name}&quot;
                    </span>{" "}
                    sẽ bị xóa vĩnh viễn.
                  </p>
                  {(productCounts[deleteConfirm.slug] || 0) > 0 && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Danh mục này có{" "}
                      {productCounts[deleteConfirm.slug]} sản phẩm,
                      không thể xóa!
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Hủy
                </Button>
                <Button
                  className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={
                    (productCounts[deleteConfirm.slug] || 0) > 0
                  }
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
