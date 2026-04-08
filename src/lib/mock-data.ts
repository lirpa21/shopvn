// Mock data for development - will be replaced with database queries

export interface VariantOption {
  name: string; // e.g. "Màu sắc", "Size"
  values: string[]; // e.g. ["Đen", "Trắng", "Xanh navy"]
}

export interface ProductVariant {
  id: string;
  sku?: string; // variant-level SKU
  options: Record<string, string>; // e.g. { "Màu sắc": "Đen", "Size": "L" }
  price?: number; // override base price
  comparePrice?: number;
  stock: number;
  image?: string; // variant-specific image
  colorHex?: string; // for color swatches
}

export interface Product {
  id: string;
  sku?: string; // product-level SKU
  title: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  categorySlug: string;
  rating: number;
  reviewCount: number;
  stock: number;
  status: "ACTIVE" | "DRAFT" | "ARCHIVED";
  featured: boolean;
  vendor?: string;
  tags: string[];
  createdAt: string;
  variantOptions?: VariantOption[]; // available option groups
  variants?: ProductVariant[]; // specific variant combinations
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  productCount: number;
}

export const categories: Category[] = [
  {
    id: "1",
    name: "Thời trang Nam",
    slug: "thoi-trang-nam",
    description: "Quần áo, phụ kiện thời trang nam",
    image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=400&h=400&fit=crop",
    productCount: 156,
  },
  {
    id: "2",
    name: "Thời trang Nữ",
    slug: "thoi-trang-nu",
    description: "Quần áo, phụ kiện thời trang nữ",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop",
    productCount: 243,
  },
  {
    id: "3",
    name: "Điện tử",
    slug: "dien-tu",
    description: "Điện thoại, laptop, phụ kiện công nghệ",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop",
    productCount: 89,
  },
  {
    id: "4",
    name: "Nhà cửa & Đời sống",
    slug: "nha-cua-doi-song",
    description: "Nội thất, decor, đồ gia dụng",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    productCount: 178,
  },
  {
    id: "5",
    name: "Sức khỏe & Làm đẹp",
    slug: "suc-khoe-lam-dep",
    description: "Mỹ phẩm, chăm sóc sức khỏe",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
    productCount: 134,
  },
  {
    id: "6",
    name: "Thể thao & Du lịch",
    slug: "the-thao-du-lich",
    description: "Đồ thể thao, phụ kiện du lịch",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop",
    productCount: 92,
  },
];

export const products: Product[] = [
  {
    id: "1",
    title: "Áo Polo Premium Cotton",
    slug: "ao-polo-premium-cotton",
    description: "Áo polo nam chất liệu cotton cao cấp, thiết kế thanh lịch, phù hợp mọi dịp. Form dáng regular fit thoải mái, bo cổ và tay áo chắc chắn.",
    price: 450000,
    comparePrice: 650000,
    images: [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=600&fit=crop",
    ],
    category: "Thời trang Nam",
    categorySlug: "thoi-trang-nam",
    rating: 4.8,
    reviewCount: 234,
    stock: 150,
    status: "ACTIVE",
    featured: true,
    vendor: "ShopVN Original",
    tags: ["polo", "cotton", "nam"],
    createdAt: "2026-03-15T00:00:00Z",
    variantOptions: [
      { name: "Màu sắc", values: ["Trắng", "Đen", "Xanh navy"] },
      { name: "Size", values: ["S", "M", "L", "XL", "XXL"] },
    ],
    variants: [
      { id: "1-w-s", options: { "Màu sắc": "Trắng", "Size": "S" }, stock: 12, colorHex: "#FFFFFF", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&h=600&fit=crop" },
      { id: "1-w-m", options: { "Màu sắc": "Trắng", "Size": "M" }, stock: 18, colorHex: "#FFFFFF" },
      { id: "1-w-l", options: { "Màu sắc": "Trắng", "Size": "L" }, stock: 20, colorHex: "#FFFFFF" },
      { id: "1-w-xl", options: { "Màu sắc": "Trắng", "Size": "XL" }, stock: 15, colorHex: "#FFFFFF" },
      { id: "1-w-xxl", options: { "Màu sắc": "Trắng", "Size": "XXL" }, stock: 8, colorHex: "#FFFFFF" },
      { id: "1-b-s", options: { "Màu sắc": "Đen", "Size": "S" }, stock: 10, colorHex: "#1a1a1a", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=600&fit=crop" },
      { id: "1-b-m", options: { "Màu sắc": "Đen", "Size": "M" }, stock: 16, colorHex: "#1a1a1a" },
      { id: "1-b-l", options: { "Màu sắc": "Đen", "Size": "L" }, stock: 22, colorHex: "#1a1a1a" },
      { id: "1-b-xl", options: { "Màu sắc": "Đen", "Size": "XL" }, stock: 14, colorHex: "#1a1a1a" },
      { id: "1-b-xxl", options: { "Màu sắc": "Đen", "Size": "XXL" }, stock: 5, colorHex: "#1a1a1a" },
      { id: "1-n-s", options: { "Màu sắc": "Xanh navy", "Size": "S" }, stock: 8, colorHex: "#1B3A5C", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&h=600&fit=crop" },
      { id: "1-n-m", options: { "Màu sắc": "Xanh navy", "Size": "M" }, stock: 14, colorHex: "#1B3A5C" },
      { id: "1-n-l", options: { "Màu sắc": "Xanh navy", "Size": "L" }, stock: 18, colorHex: "#1B3A5C" },
      { id: "1-n-xl", options: { "Màu sắc": "Xanh navy", "Size": "XL" }, stock: 10, colorHex: "#1B3A5C" },
      { id: "1-n-xxl", options: { "Màu sắc": "Xanh navy", "Size": "XXL" }, stock: 3, colorHex: "#1B3A5C" },
    ],
  },
  {
    id: "2",
    title: "Tai nghe Bluetooth TWS Pro",
    slug: "tai-nghe-bluetooth-tws-pro",
    description: "Tai nghe true wireless chống ồn chủ động ANC, chất âm Hi-Fi, pin 36 giờ. Thiết kế ergonomic, chống nước IPX5.",
    price: 890000,
    comparePrice: 1290000,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop",
    ],
    category: "Điện tử",
    categorySlug: "dien-tu",
    rating: 4.6,
    reviewCount: 567,
    stock: 89,
    status: "ACTIVE",
    featured: true,
    vendor: "TechVN",
    tags: ["tai nghe", "bluetooth", "wireless"],
    createdAt: "2026-03-20T00:00:00Z",
  },
  {
    id: "3",
    title: "Đầm Maxi Hoa Vintage",
    slug: "dam-maxi-hoa-vintage",
    description: "Đầm maxi họa tiết hoa retro, chất liệu lụa mềm mại, bay bổng. Thiết kế cổ V thanh lịch, phù hợp dạo phố và đi biển.",
    price: 520000,
    comparePrice: 780000,
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop",
    ],
    category: "Thời trang Nữ",
    categorySlug: "thoi-trang-nu",
    rating: 4.9,
    reviewCount: 189,
    stock: 67,
    status: "ACTIVE",
    featured: true,
    vendor: "Fashion House",
    tags: ["đầm", "maxi", "vintage", "nữ"],
    createdAt: "2026-03-18T00:00:00Z",
    variantOptions: [
      { name: "Màu sắc", values: ["Đỏ hoa", "Xanh pastel"] },
      { name: "Size", values: ["S", "M", "L"] },
    ],
    variants: [
      { id: "3-r-s", options: { "Màu sắc": "Đỏ hoa", "Size": "S" }, stock: 10, colorHex: "#D63031", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=600&fit=crop" },
      { id: "3-r-m", options: { "Màu sắc": "Đỏ hoa", "Size": "M" }, stock: 15, colorHex: "#D63031" },
      { id: "3-r-l", options: { "Màu sắc": "Đỏ hoa", "Size": "L" }, stock: 12, colorHex: "#D63031" },
      { id: "3-b-s", options: { "Màu sắc": "Xanh pastel", "Size": "S" }, stock: 8, colorHex: "#81ECEC", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop" },
      { id: "3-b-m", options: { "Màu sắc": "Xanh pastel", "Size": "M" }, stock: 12, colorHex: "#81ECEC" },
      { id: "3-b-l", options: { "Màu sắc": "Xanh pastel", "Size": "L" }, stock: 10, colorHex: "#81ECEC" },
    ],
  },
  {
    id: "4",
    title: "Bình giữ nhiệt Inox 750ml",
    slug: "binh-giu-nhiet-inox-750ml",
    description: "Bình giữ nhiệt inox 304, giữ nóng 12h - lạnh 24h. Thiết kế tối giản, miệng rộng dễ vệ sinh. An toàn sức khỏe, không BPA.",
    price: 320000,
    comparePrice: 450000,
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=600&h=600&fit=crop",
    ],
    category: "Nhà cửa & Đời sống",
    categorySlug: "nha-cua-doi-song",
    rating: 4.7,
    reviewCount: 412,
    stock: 200,
    status: "ACTIVE",
    featured: false,
    vendor: "HomeLife",
    tags: ["bình nước", "giữ nhiệt", "inox"],
    createdAt: "2026-03-10T00:00:00Z",
    variantOptions: [
      { name: "Màu sắc", values: ["Bạc", "Đen", "Hồng"] },
    ],
    variants: [
      { id: "4-bac", options: { "Màu sắc": "Bạc" }, stock: 80, colorHex: "#C0C0C0", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop" },
      { id: "4-den", options: { "Màu sắc": "Đen" }, stock: 70, colorHex: "#2D3436", image: "https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=600&h=600&fit=crop" },
      { id: "4-hong", options: { "Màu sắc": "Hồng" }, stock: 50, colorHex: "#FDA7DF" },
    ],
  },
  {
    id: "5",
    title: "Serum Vitamin C 20% Brightening",
    slug: "serum-vitamin-c-20-brightening",
    description: "Serum Vitamin C nồng độ cao 20%, kết hợp Niacinamide và Hyaluronic Acid. Sáng da, mờ thâm, chống lão hóa hiệu quả.",
    price: 380000,
    comparePrice: 550000,
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop",
    ],
    category: "Sức khỏe & Làm đẹp",
    categorySlug: "suc-khoe-lam-dep",
    rating: 4.8,
    reviewCount: 723,
    stock: 120,
    status: "ACTIVE",
    featured: true,
    vendor: "BeautyVN",
    tags: ["serum", "vitamin c", "skincare"],
    createdAt: "2026-03-22T00:00:00Z",
    variantOptions: [
      { name: "Dung tích", values: ["30ml", "50ml", "100ml"] },
    ],
    variants: [
      { id: "5-30ml", options: { "Dung tích": "30ml" }, price: 280000, comparePrice: 400000, stock: 45 },
      { id: "5-50ml", options: { "Dung tích": "50ml" }, price: 380000, comparePrice: 550000, stock: 50 },
      { id: "5-100ml", options: { "Dung tích": "100ml" }, price: 620000, comparePrice: 850000, stock: 25 },
    ],
  },
  {
    id: "6",
    title: "Giày chạy bộ Ultra Boost",
    slug: "giay-chay-bo-ultra-boost",
    description: "Giày chạy bộ công nghệ đệm Boost, đế xốp siêu nhẹ, upper knit thoáng khí. Phù hợp chạy bộ và tập gym.",
    price: 1890000,
    comparePrice: 2490000,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&h=600&fit=crop",
    ],
    category: "Thể thao & Du lịch",
    categorySlug: "the-thao-du-lich",
    rating: 4.9,
    reviewCount: 345,
    stock: 45,
    status: "ACTIVE",
    featured: true,
    vendor: "SportMax",
    tags: ["giày", "chạy bộ", "thể thao"],
    createdAt: "2026-03-25T00:00:00Z",
    variantOptions: [
      { name: "Màu sắc", values: ["Đỏ/Đen", "Trắng/Hồng", "Xám/Xanh"] },
      { name: "Size", values: ["38", "39", "40", "41", "42", "43", "44"] },
    ],
    variants: [
      { id: "6-rb-38", options: { "Màu sắc": "Đỏ/Đen", "Size": "38" }, stock: 3, colorHex: "#E74C3C", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop" },
      { id: "6-rb-39", options: { "Màu sắc": "Đỏ/Đen", "Size": "39" }, stock: 5, colorHex: "#E74C3C" },
      { id: "6-rb-40", options: { "Màu sắc": "Đỏ/Đen", "Size": "40" }, stock: 4, colorHex: "#E74C3C" },
      { id: "6-rb-41", options: { "Màu sắc": "Đỏ/Đen", "Size": "41" }, stock: 6, colorHex: "#E74C3C" },
      { id: "6-rb-42", options: { "Màu sắc": "Đỏ/Đen", "Size": "42" }, stock: 4, colorHex: "#E74C3C" },
      { id: "6-rb-43", options: { "Màu sắc": "Đỏ/Đen", "Size": "43" }, stock: 3, colorHex: "#E74C3C" },
      { id: "6-rb-44", options: { "Màu sắc": "Đỏ/Đen", "Size": "44" }, stock: 2, colorHex: "#E74C3C" },
      { id: "6-wp-38", options: { "Màu sắc": "Trắng/Hồng", "Size": "38" }, stock: 4, colorHex: "#FFC0CB", image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&h=600&fit=crop" },
      { id: "6-wp-39", options: { "Màu sắc": "Trắng/Hồng", "Size": "39" }, stock: 6, colorHex: "#FFC0CB" },
      { id: "6-wp-40", options: { "Màu sắc": "Trắng/Hồng", "Size": "40" }, stock: 3, colorHex: "#FFC0CB" },
      { id: "6-wp-41", options: { "Màu sắc": "Trắng/Hồng", "Size": "41" }, stock: 5, colorHex: "#FFC0CB" },
      { id: "6-wp-42", options: { "Màu sắc": "Trắng/Hồng", "Size": "42" }, stock: 2, colorHex: "#FFC0CB" },
      { id: "6-gb-40", options: { "Màu sắc": "Xám/Xanh", "Size": "40" }, stock: 3, colorHex: "#636E72" },
      { id: "6-gb-41", options: { "Màu sắc": "Xám/Xanh", "Size": "41" }, stock: 4, colorHex: "#636E72" },
      { id: "6-gb-42", options: { "Màu sắc": "Xám/Xanh", "Size": "42" }, stock: 5, colorHex: "#636E72" },
      { id: "6-gb-43", options: { "Màu sắc": "Xám/Xanh", "Size": "43" }, stock: 3, colorHex: "#636E72" },
      { id: "6-gb-44", options: { "Màu sắc": "Xám/Xanh", "Size": "44" }, stock: 2, colorHex: "#636E72" },
    ],
  },
  {
    id: "7",
    title: "Laptop Sleeve 15.6 inch",
    slug: "laptop-sleeve-15-6-inch",
    description: "Túi chống sốc laptop 15.6 inch, chất liệu nylon chống nước, lớp đệm EVA bảo vệ tối đa. Thiết kế mỏng nhẹ, có quai xách.",
    price: 250000,
    comparePrice: 350000,
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&h=600&fit=crop",
    ],
    category: "Điện tử",
    categorySlug: "dien-tu",
    rating: 4.5,
    reviewCount: 156,
    stock: 300,
    status: "ACTIVE",
    featured: false,
    vendor: "TechGear",
    tags: ["laptop", "túi chống sốc", "phụ kiện"],
    createdAt: "2026-03-12T00:00:00Z",
  },
  {
    id: "8",
    title: "Đèn ngủ LED thông minh",
    slug: "den-ngu-led-thong-minh",
    description: "Đèn ngủ LED điều khiển cảm ứng, 16 triệu màu RGB, hẹn giờ tự động tắt. Kết nối Bluetooth, điều khiển qua app.",
    price: 290000,
    comparePrice: 420000,
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057ab3fe?w=600&h=600&fit=crop",
    ],
    category: "Nhà cửa & Đời sống",
    categorySlug: "nha-cua-doi-song",
    rating: 4.4,
    reviewCount: 278,
    stock: 180,
    status: "ACTIVE",
    featured: false,
    vendor: "SmartHome",
    tags: ["đèn", "LED", "smart home"],
    createdAt: "2026-03-08T00:00:00Z",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured && p.status === "ACTIVE");
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug && p.status === "ACTIVE");
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getAllCategories(): Category[] {
  return categories;
}

export function searchProducts(query: string): Product[] {
  const lower = query.toLowerCase();
  return products.filter(
    (p) =>
      p.status === "ACTIVE" &&
      (p.title.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower) ||
        p.tags.some((t) => t.toLowerCase().includes(lower)))
  );
}
