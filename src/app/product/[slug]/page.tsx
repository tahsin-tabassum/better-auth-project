

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/api";
import ProductDetails from "@/components/ProductDetails";

async function ProductContent({ slug }: { slug: string }) {
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const marketPrices = (product.markets ?? []).map((market) => ({
    market: market.market,
    location: market.division,
    minPrice: market.min,
    maxPrice: market.max,
    averagePrice: (market.min + market.max) / 2,
  }));

  return (
    <ProductDetails
      product={product}
      marketPrices={marketPrices}
    />
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Suspense fallback={<div className="p-10">লোড হচ্ছে...</div>}>
      <ProductContent slug={slug} />
    </Suspense>
  );
}
