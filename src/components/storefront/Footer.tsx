import Link from "next/link";
import { Globe, Camera, Play, Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  shop: [
    { label: "Tất cả sản phẩm", href: "/products" },
    { label: "Thời trang Nam", href: "/collections/thoi-trang-nam" },
    { label: "Thời trang Nữ", href: "/collections/thoi-trang-nu" },
    { label: "Điện tử", href: "/collections/dien-tu" },
    { label: "Sale 🔥", href: "/products?sale=true" },
  ],
  support: [
    { label: "Hướng dẫn mua hàng", href: "/pages/huong-dan" },
    { label: "Chính sách đổi trả", href: "/pages/doi-tra" },
    { label: "Chính sách vận chuyển", href: "/pages/van-chuyen" },
    { label: "Câu hỏi thường gặp", href: "/pages/faq" },
    { label: "Liên hệ", href: "/contact" },
  ],
  about: [
    { label: "Về ShopVN", href: "/pages/about" },
    { label: "Tuyển dụng", href: "/pages/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Điều khoản sử dụng", href: "/pages/terms" },
    { label: "Chính sách bảo mật", href: "/pages/privacy" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-2xl font-bold font-heading inline-block">
              Shop<span className="text-accent">VN</span>
            </Link>
            <p className="mt-4 text-sm text-primary-foreground/60 leading-relaxed max-w-xs">
              Nền tảng mua sắm trực tuyến hàng đầu Việt Nam. Sản phẩm chính hãng, giá tốt nhất.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="#"
                className="h-9 w-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="h-9 w-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <Camera className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="h-9 w-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <Play className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Cửa hàng
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Hỗ trợ
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Liên hệ
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-primary-foreground/60">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>123 Nguyễn Huệ, Q.1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/60">
                <Phone className="h-4 w-4 shrink-0" />
                <span>1900 6868</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/60">
                <Mail className="h-4 w-4 shrink-0" />
                <span>support@shopvn.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-primary-foreground/10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/40">
          <p>© 2026 ShopVN. Tất cả quyền được bảo lưu.</p>
          <div className="flex items-center gap-4">
            <span>Thanh toán:</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-primary-foreground/10 rounded text-[10px] font-medium">
                COD
              </span>
              <span className="px-2 py-1 bg-primary-foreground/10 rounded text-[10px] font-medium">
                MoMo
              </span>
              <span className="px-2 py-1 bg-primary-foreground/10 rounded text-[10px] font-medium">
                VNPay
              </span>
              <span className="px-2 py-1 bg-primary-foreground/10 rounded text-[10px] font-medium">
                ZaloPay
              </span>
              <span className="px-2 py-1 bg-primary-foreground/10 rounded text-[10px] font-medium">
                QR Bank
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
