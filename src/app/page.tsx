import Link from "next/link";
import { getCategories, getProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/bazardor";
import { bnNumber } from "@/lib/format";
import HeroSection from "@/components/HeroSection";

export default async function HomePage() {
 let products:Product[] = [];
 let categories: Awaited<ReturnType<typeof getCategories>> = [];
  try{
    [products, categories ]= await Promise.all([
      getProducts(),
      getCategories(),
    ]);

 } catch {
   //  
 }
 const rising = [...products]
 .filter ((product) => product.change>0)     
.sort ((a, b) => b.change - a.change)
.slice (0, 6);

const falling = [...products]
 .filter((product) => product.change < 0)
    .sort((a, b) => a.change - b.change)
    .slice(0, 6);

    return (
     <div className="site-container page-space">
<section className="hero-banner">
   <div className="hero-copy">
      <span className="eyebrow">
                     📈 নির্ভরযোগ্য বাজারদর, প্রতিদিন
<h1>আজকের বাজারের দাম এক নজরে</h1>

          <p>
            চাল, ডাল, তেল, সবজি, মাছসহ নিত্যপ্রয়োজনীয়
            পণ্যের আপডেটেড দাম সহজেই দেখে নিন।
          </p>
          <a href="#সব-পণ্য" className="btn-primary hero-button">
             সব পণ্য দেখুন <span>→</span>
          </a>
      </span>
   </div>

<div className="hero-art" aria-hidden="true">
<div className="basket-emoji">🧺</div>
<div className="produce-emoji">🍅 🥕 🥦 🍊</div>
</div>



</section>
     </div>

    );
}
