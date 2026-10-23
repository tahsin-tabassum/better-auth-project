
import ProductCard from "./ProductCard";
import type { Product } from "@/types/bazardor";

type Props = {
  products: Product[];
};

// Calculate price change safely
function getPriceChange(product: Product): number {
  const today = Number(product.today ?? product.price);
  const yesterday = Number(
    product.yesterday ?? product.previousPrice
  );

  if (
    Number.isFinite(today) &&
    Number.isFinite(yesterday) &&
    yesterday > 0
  ) {
    return ((today - yesterday) / yesterday) * 100;
  }

  const change = Number(product.change);

  return Number.isFinite(change) ? change : 0;
}

export default function ProductSections({ products }: Props) {
  const priceIncreased = [...products]
    .filter((product) => getPriceChange(product) > 0)
    .sort(
      (a, b) => getPriceChange(b) - getPriceChange(a)
    )
    .slice(0, 6);

  const priceDecreased = [...products]
    .filter((product) => getPriceChange(product) < 0)
    .sort(
      (a, b) => getPriceChange(a) - getPriceChange(b)
    )
    .slice(0, 6);

  return (
    <div className="bg-[#F0F6F1] pb-20">
      <div className="mx-auto max-w-[1140px] px-4">
        {/* Price Increased */}
        <section className="pt-8">
          <h2 className="mb-5 flex items-center gap-2 text-[19px] font-extrabold text-[#253027]">
            <span className="text-[#E44747]">▲</span>
            আজ দাম বেড়েছে
          </h2>

          {priceIncreased.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {priceIncreased.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-white p-6 text-sm text-gray-500">
              দাম বেড়েছে এমন কোনো পণ্য পাওয়া যায়নি।
            </p>
          )}
        </section>

        {/* Price Decreased */}
        <section className="pt-10">
          <h2 className="mb-5 flex items-center gap-2 text-[19px] font-extrabold text-[#253027]">
            <span className="text-[#159B55]">▼</span>
            আজ দাম কমেছে
          </h2>

          {priceDecreased.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {priceDecreased.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-white p-6 text-sm text-gray-500">
              দাম কমেছে এমন কোনো পণ্য পাওয়া যায়নি।
            </p>
          )}
        </section>

        {/* All Products */}
        <section id="সব-পণ্য" className="scroll-mt-24 pt-12">
          <h2 className="text-[19px] font-extrabold text-[#253027]">
            সব পণ্য
          </h2>

          <p className="mb-5 mt-2 text-[13px] text-[#7B857D]">
            মোট {products.length.toLocaleString("bn-BD")}টি পণ্য দেখানো হচ্ছে
          </p>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-white p-6 text-sm text-gray-500">
              কোনো পণ্য পাওয়া যায়নি।
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
