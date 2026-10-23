import { Suspense } from "react";
import Link from "next/link";
import { getCategories, getProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/bazardor";
import { bnNumber } from "@/lib/format";
import HeroSection from "@/components/HeroSection";
import ProductSections from "@/components/ProductSection";


async function ProductsContent() {
  const products = await getProducts();

  return <ProductSections products={products} />;
}

function ProductsSkeleton() {
  return (
    <div className="bg-[#F0F6F1] px-4 py-10">
      <div className="mx-auto max-w-285 space-y-10">
        {[1, 2, 3].map((section) => (
          <div key={section}>
            <div className="mb-5 h-6 w-40 animate-pulse rounded bg-gray-200" />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((card) => (
                <div
                  key={card}
                  className="h-38.75 animate-pulse rounded-xl bg-white"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main>
      <HeroSection />

      <Suspense fallback={<ProductsSkeleton />}>
        <ProductsContent />
      </Suspense>
    </main>
  );
}

