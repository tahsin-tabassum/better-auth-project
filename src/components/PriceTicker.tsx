

import Link from "next/link";
import type { Product } from "@/types/bazardor";

type Props = {
  products: Product[];
};

export default function PriceTicker({ products }: Props) {
  if (products.length === 0) return null;

  const tickerProducts = products.slice(0, 12);

  return (
    <div className="overflow-hidden border-y border-[#DDE8DF] bg-white py-3">
      <div className="bazardor-ticker-track flex w-max items-center">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 items-center"
          >
            {tickerProducts.map((product) => {
              const today = Number(product.today ?? product.price);
              const yesterday = Number(
                product.yesterday ?? product.previousPrice
              );

              const change =
                yesterday > 0
                  ? ((today - yesterday) / yesterday) * 100
                  : Number(product.change) || 0;

              return (
                <Link
                  key={`${copy}-${product.id}`}
                  href={`/product/${product.id}`}
                  tabIndex={copy === 1 ? -1 : undefined}
                  className="flex shrink-0 items-center gap-2 px-5 text-sm"
                >
                  <span className="text-lg">{product.icon}</span>

                  <span className="font-semibold text-[#344039]">
                    {product.nameBn}
                  </span>

                  <span className="font-bold text-[#253027]">
                    ৳ {today.toLocaleString("bn-BD")}
                  </span>

                  <span
                    className={`font-semibold ${
                      change > 0
                        ? "text-red-500"
                        : change < 0
                          ? "text-green-600"
                          : "text-gray-500"
                    }`}
                  >
                    {change > 0 ? "▲" : change < 0 ? "▼" : "—"}{" "}
                    {Math.abs(change).toLocaleString("bn-BD", {
                      maximumFractionDigits: 1,
                    })}
                    %
                  </span>

                  <span className="ml-4 text-[#C8D4CB]">•</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
