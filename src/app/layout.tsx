import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import DataProvider from "@/components/DataProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ShopVN — Mua sắm trực tuyến",
    template: "%s | ShopVN",
  },
  description:
    "ShopVN - Nền tảng mua sắm trực tuyến hàng đầu Việt Nam. Sản phẩm chất lượng, giá tốt, giao hàng nhanh toàn quốc.",
  keywords: [
    "mua sắm online",
    "thương mại điện tử",
    "shopvn",
    "mua hàng trực tuyến",
    "thời trang",
    "điện tử",
    "gia dụng",
    "giá rẻ",
    "giao hàng nhanh",
  ],
  authors: [{ name: "ShopVN" }],
  creator: "ShopVN",
  metadataBase: new URL("https://shopvn.vn"),
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "ShopVN",
    title: "ShopVN — Mua sắm trực tuyến hàng đầu Việt Nam",
    description:
      "Khám phá hàng nghìn sản phẩm chất lượng với giá tốt nhất. Giao hàng nhanh, đổi trả dễ dàng, thanh toán an toàn.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ShopVN — Mua sắm trực tuyến",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopVN — Mua sắm trực tuyến",
    description:
      "Nền tảng mua sắm trực tuyến hàng đầu Việt Nam. Sản phẩm chất lượng, giá tốt.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a18" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <DataProvider>
              {children}
            </DataProvider>
          </TooltipProvider>
          <Toaster
            richColors
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: "12px",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
