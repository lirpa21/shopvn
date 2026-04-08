"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ThumbsUp,
  CheckCircle2,
  MessageSquarePlus,
  ChevronDown,
  Filter,
  X,
  Send,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getReviewsForProduct,
  getReviewSummary,
  type Review,
} from "@/lib/mock-reviews";
import { timeAgo } from "@/lib/format";

// ── Star Rating Input ──
function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <Star
            className={`h-7 w-7 transition-colors ${
              star <= (hover || value)
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm font-medium text-muted-foreground">
          {value === 1
            ? "Rất tệ"
            : value === 2
            ? "Tệ"
            : value === 3
            ? "Bình thường"
            : value === 4
            ? "Tốt"
            : "Tuyệt vời"}
        </span>
      )}
    </div>
  );
}

// ── Rating Bar ──
function RatingBar({
  star,
  count,
  total,
  onClick,
  active,
}: {
  star: number;
  count: number;
  total: number;
  onClick: () => void;
  active: boolean;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 group w-full text-left py-0.5 transition-opacity ${
        active ? "opacity-100" : "opacity-70 hover:opacity-100"
      }`}
    >
      <span className="text-xs font-medium w-3 text-right">{star}</span>
      <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, delay: (5 - star) * 0.08 }}
          className={`h-full rounded-full ${
            star >= 4
              ? "bg-emerald-500"
              : star === 3
              ? "bg-amber-400"
              : "bg-orange-400"
          }`}
        />
      </div>
      <span className="text-xs text-muted-foreground w-6 text-right">
        {count}
      </span>
    </button>
  );
}

// ── Single Review Card ──
function ReviewCard({ review }: { review: Review }) {
  const [helpful, setHelpful] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-5 first:pt-0"
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center shrink-0 text-accent font-bold text-sm">
          {review.author
            .split(" ")
            .map((n) => n[0])
            .slice(-2)
            .join("")}
        </div>

        <div className="flex-1 min-w-0">
          {/* Author & Meta */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{review.author}</span>
            {review.verified && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-full">
                <CheckCircle2 className="h-2.5 w-2.5" />
                Đã mua hàng
              </span>
            )}
          </div>

          {/* Stars */}
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < review.rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/20"
                }`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-2">
              {timeAgo(review.createdAt)}
            </span>
          </div>

          {/* Title */}
          <h4 className="font-medium text-sm mt-2">{review.title}</h4>

          {/* Content */}
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            {review.content}
          </p>

          {/* Helpful */}
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={() => {
                setHelpful(!helpful);
                if (!helpful) toast.success("Cảm ơn bạn đã đánh giá hữu ích!");
              }}
              className={`inline-flex items-center gap-1.5 text-xs transition-colors ${
                helpful
                  ? "text-accent font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ThumbsUp
                className={`h-3.5 w-3.5 ${helpful ? "fill-current" : ""}`}
              />
              Hữu ích ({review.helpful + (helpful ? 1 : 0)})
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Component ──
export default function ProductReviews({
  productId,
  productTitle,
}: {
  productId: string;
  productTitle: string;
}) {
  const reviews = useMemo(() => getReviewsForProduct(productId), [productId]);
  const summary = useMemo(() => getReviewSummary(reviews), [reviews]);
  const [filterStar, setFilterStar] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    rating: 0,
    title: "",
    content: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const filtered = filterStar
    ? reviews.filter((r) => r.rating === filterStar)
    : reviews;

  const displayed = showAll ? filtered : filtered.slice(0, 5);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.rating === 0) {
      toast.error("Vui lòng chọn số sao đánh giá");
      return;
    }
    if (!formData.content.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá");
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Đánh giá đã được gửi!", {
      description: "Cảm ơn bạn đã đánh giá sản phẩm.",
    });
    setFormData({ name: "", rating: 0, title: "", content: "" });
    setShowForm(false);
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <div className="grid sm:grid-cols-[240px,1fr] gap-6 sm:gap-8">
        {/* Left — Score */}
        <div className="flex flex-col items-center text-center sm:border-r sm:pr-8">
          <div className="text-5xl font-bold">{summary.average}</div>
          <div className="flex items-center gap-0.5 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.round(summary.average)
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/20"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-1.5">
            {summary.total} đánh giá
          </p>
          <Button
            onClick={() => setShowForm(true)}
            className="mt-4 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground gap-1.5"
            size="sm"
          >
            <MessageSquarePlus className="h-4 w-4" />
            Viết đánh giá
          </Button>
        </div>

        {/* Right — Distribution */}
        <div className="space-y-1">
          {[5, 4, 3, 2, 1].map((star) => (
            <RatingBar
              key={star}
              star={star}
              count={summary.distribution[star - 1]}
              total={summary.total}
              onClick={() =>
                setFilterStar(filterStar === star ? null : star)
              }
              active={filterStar === null || filterStar === star}
            />
          ))}

          {filterStar && (
            <button
              onClick={() => setFilterStar(null)}
              className="inline-flex items-center gap-1 text-xs text-accent mt-2 hover:underline"
            >
              <X className="h-3 w-3" />
              Xóa bộ lọc ({filterStar} sao)
            </button>
          )}
        </div>
      </div>

      <Separator />

      {/* Review Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleSubmitReview}
              className="bg-secondary/40 rounded-2xl border p-5 sm:p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <MessageSquarePlus className="h-4 w-4 text-accent" />
                  Viết đánh giá cho &ldquo;{productTitle}&rdquo;
                </h3>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div>
                <Label className="text-sm mb-2 block">
                  Đánh giá của bạn <span className="text-destructive">*</span>
                </Label>
                <StarRatingInput
                  value={formData.rating}
                  onChange={(v) =>
                    setFormData((p) => ({ ...p, rating: v }))
                  }
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="review-name" className="text-sm">
                    Họ tên
                  </Label>
                  <Input
                    id="review-name"
                    placeholder="Nguyễn Văn A"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, name: e.target.value }))
                    }
                    className="mt-1.5 h-10 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="review-title" className="text-sm">
                    Tiêu đề
                  </Label>
                  <Input
                    id="review-title"
                    placeholder="Tóm tắt đánh giá"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, title: e.target.value }))
                    }
                    className="mt-1.5 h-10 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="review-content" className="text-sm">
                  Nội dung <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="review-content"
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                  value={formData.content}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, content: e.target.value }))
                  }
                  className="mt-1.5 rounded-xl min-h-[100px]"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground gap-1.5"
                >
                  {submitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                    />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {submitting ? "Đang gửi..." : "Gửi đánh giá"}
                </Button>
              </div>
            </form>
            <Separator className="mt-6" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Info */}
      {filterStar && (
        <div className="flex items-center gap-2 text-sm">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            Hiển thị {filtered.length} đánh giá {filterStar} sao
          </span>
        </div>
      )}

      {/* Reviews List */}
      <div className="divide-y">
        <AnimatePresence mode="popLayout">
          {displayed.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </AnimatePresence>
      </div>

      {/* Show More */}
      {filtered.length > 5 && !showAll && (
        <div className="text-center pt-2">
          <Button
            variant="outline"
            onClick={() => setShowAll(true)}
            className="rounded-xl gap-1.5"
          >
            <ChevronDown className="h-4 w-4" />
            Xem thêm {filtered.length - 5} đánh giá
          </Button>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-8">
          <Star className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground text-sm">
            Chưa có đánh giá {filterStar ? `${filterStar} sao` : ""} nào
          </p>
        </div>
      )}
    </div>
  );
}
