import type { Metadata } from "next";
import "./globals.css";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PriceTicker from "@/components/PriceTicker";
import type { Product } from "@/types/bazardor";
import { getProducts } from "@/lib/api";
export const instant = false;

export const metadata: Metadata ={
  title: "বাজার দর | প্রতিদিনের বাজারের দাম",
  description: "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর দেখুন।",
};


export default async function RootLayout({ children, }: Readonly<{children: React.ReactNode}>) {
  let products: Product[] = [];
  try{
    products = await getProducts();
  } catch {
  //
  }
  return (
    <html
      lang="bn"
    >
      <body>    
   <Navbar />
      <PriceTicker products={products} />
    <main className="main-content">{children}</main>
  
   <Footer />
   </body>
    </html>
  );
}
