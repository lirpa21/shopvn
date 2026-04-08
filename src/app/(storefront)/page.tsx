import HeroSection from "@/components/storefront/HeroSection";

// JSON-LD Structured Data for homepage
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ShopVN",
  url: "https://shopvn.vn",
  description:
    "Nền tảng mua sắm trực tuyến hàng đầu Việt Nam. Sản phẩm chất lượng, giá tốt, giao hàng nhanh.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://shopvn.vn/products?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ShopVN",
  url: "https://shopvn.vn",
  logo: "https://shopvn.vn/logo.png",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+84-123-456-789",
    contactType: "customer service",
    availableLanguage: "Vietnamese",
  },
  sameAs: [
    "https://facebook.com/shopvn",
    "https://instagram.com/shopvn",
    "https://tiktok.com/@shopvn",
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <HeroSection />
    </>
  );
}
