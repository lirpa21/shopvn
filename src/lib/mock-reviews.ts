// Mock review data for products

export interface Review {
  id: string;
  productId: string;
  author: string;
  avatar?: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  verified: boolean;
  helpful: number;
  createdAt: string;
}

// Generate Vietnamese names
const names = [
  "Nguyễn Văn Hùng", "Trần Thị Mai", "Lê Minh Tuấn", "Phạm Thị Hoa",
  "Hoàng Văn Đức", "Vũ Thị Lan", "Đặng Minh Khoa", "Bùi Thị Ngọc",
  "Ngô Quốc Bảo", "Dương Thị Thanh", "Phan Văn Long", "Lý Thị Kim",
  "Đinh Công Thành", "Hồ Thị Yến", "Trịnh Văn Nam",
];

const reviewContents: Record<number, string[]> = {
  5: [
    "Sản phẩm tuyệt vời, đúng như mô tả. Đóng gói cẩn thận, giao hàng nhanh. Sẽ mua lại!",
    "Rất hài lòng với chất lượng. Đã dùng được 2 tuần, vẫn như mới. Recommend cho mọi người.",
    "Chất lượng vượt mong đợi! Giá cả hợp lý, ship nhanh. 10 điểm không có nhưng.",
    "Mình đã mua lần thứ 3 rồi, lần nào cũng ưng ý. Shop gói hàng rất kỹ, hỗ trợ nhiệt tình.",
  ],
  4: [
    "Chất lượng tốt, tuy nhiên giao hàng hơi chậm một chút. Nhìn chung rất ổn.",
    "Sản phẩm đẹp, đúng hình. Chỉ có điều size hơi nhỏ so với mô tả. Nhưng vẫn 4 sao!",
    "Hàng chất lượng, giá tốt. Mình sẽ quay lại mua thêm. Cảm ơn shop!",
    "Đóng gói đẹp, sản phẩm chất lượng ổn. Giao hàng 3 ngày. Tạm chấp nhận được.",
  ],
  3: [
    "Sản phẩm tạm ổn cho tầm giá này. Mình mong đợi nhiều hơn một chút.",
    "Chất lượng trung bình, không quá xuất sắc nhưng cũng không tệ. Cần cải thiện thêm.",
  ],
  2: [
    "Hàng nhận được khác so với ảnh một chút. Mong shop cải thiện.",
  ],
};

const reviewTitles: Record<number, string[]> = {
  5: ["Xuất sắc!", "Rất hài lòng", "Tuyệt vời", "Đáng mua"],
  4: ["Tốt", "Hài lòng", "Chất lượng ổn", "Đáng tiền"],
  3: ["Tạm ổn", "Bình thường", "Trung bình"],
  2: ["Chưa tốt", "Cần cải thiện"],
};

function seededRandom(seed: number) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function getReviewsForProduct(productId: string): Review[] {
  const seed = parseInt(productId) || productId.charCodeAt(0);
  const count = Math.floor(seededRandom(seed * 7) * 8) + 5; // 5-12 reviews
  const reviews: Review[] = [];

  for (let i = 0; i < count; i++) {
    const r = seededRandom(seed * 100 + i * 13);
    // Weight towards higher ratings (realistic)
    let rating: number;
    if (r < 0.45) rating = 5;
    else if (r < 0.75) rating = 4;
    else if (r < 0.88) rating = 3;
    else rating = 2;

    const nameIdx = Math.floor(seededRandom(seed * 50 + i * 17) * names.length);
    const titleOptions = reviewTitles[rating] || reviewTitles[3];
    const contentOptions = reviewContents[rating] || reviewContents[3];
    const titleIdx = Math.floor(seededRandom(seed * 30 + i * 11) * titleOptions.length);
    const contentIdx = Math.floor(seededRandom(seed * 20 + i * 23) * contentOptions.length);

    const daysAgo = Math.floor(seededRandom(seed * 80 + i * 31) * 90) + 1;
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    reviews.push({
      id: `rev-${productId}-${i}`,
      productId,
      author: names[nameIdx],
      rating,
      title: titleOptions[titleIdx],
      content: contentOptions[contentIdx],
      verified: seededRandom(seed * 60 + i * 7) > 0.3,
      helpful: Math.floor(seededRandom(seed * 40 + i * 19) * 25),
      createdAt: date.toISOString(),
    });
  }

  // Sort by date desc
  reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return reviews;
}

export function getReviewSummary(reviews: Review[]) {
  const total = reviews.length;
  if (total === 0) return { average: 0, total: 0, distribution: [0, 0, 0, 0, 0] };

  const distribution = [0, 0, 0, 0, 0]; // 1-5 stars
  let sum = 0;

  reviews.forEach((r) => {
    distribution[r.rating - 1]++;
    sum += r.rating;
  });

  return {
    average: Math.round((sum / total) * 10) / 10,
    total,
    distribution,
  };
}
