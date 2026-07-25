import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/store/StoreProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import CartDrawer from "@/components/layout/CartDrawer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Dulcis Skincare & Haircare | Bio-Active Botanical Solutions",
    template: "%s | Dulcis Skincare & Haircare",
  },
  description: "Experience premium, certified niacinamide serums, gel moisturizers, mineral SPF sunblocks, and nourishing argan conditioners backed by cosmetic science.",
  keywords: ["skincare shop", "haircare shop", "niacinamide serum", "mineral sunscreen", "biotin shampoo", "Dulcis Skincare"],
  authors: [{ name: "Dulcis Cosmetic Group" }],
  metadataBase: new URL("https://dulcishealthcare.com"),
  openGraph: {
    title: "Dulcis Skincare & Haircare | Premium Cosmetic Biotech Shop",
    description: "Shop certified mineral sunscreens, gel moisturizers, nourishing shampoos, and skin barrier complexes designed under strict dermatological specifications.",
    url: "/",
    siteName: "Dulcis Skincare & Haircare",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dulcis Skincare & Haircare | Premium Cosmetic Biotech Shop",
    description: "Certified bio-active skin formulations and organic hair complexes built for your beauty and routine.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-foreground bg-[var(--background)]">
        <StoreProvider>
          <ThemeProvider>
            <Navbar />
            <MobileNav />
            <CartDrawer />
            <main className="flex-grow flex flex-col w-full">{children}</main>
            <Footer />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
