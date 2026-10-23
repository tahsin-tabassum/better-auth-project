
import Link from "next/link";
import type { Product } from "@/types/bazardor";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const today = Number(product.today ?? product.price);
  const yesterday = Number(
    product.yesterday ?? product.previousPrice
  );

  const change =
    Number.isFinite(today) &&
    Number.isFinite(yesterday) &&
    yesterday > 0
      ? ((today - yesterday) / yesterday) * 100
      : Number(product.change) || 0;

  const increased = change > 0;
  const decreased = change < 0;

  const changeText = Math.abs(change).toLocaleString("bn-BD", {
    maximumFractionDigits: 1,
  });

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block rounded-2xl border border-[#E1E9E2] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#A7D9B3] hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#F0F6F1] text-2xl">
          {product.icon}
        </div>

        <div>
          <h3 className="text-sm font-bold text-[#253027]">
            {product.nameBn}
          </h3>

          <p className="text-sm text-[#849087]">
            প্রতি {product.unit}
          </p>
        </div>
      </div>

      <div className="mt-7 flex items-end justify-between">
        <div>
          <p className="mb-1 text-sm text-[#89958B]">
            আজকের দাম
          </p>

          <p className="text-sm font-extrabold text-[#253027]">
            {today.toLocaleString("bn-BD")} টাকা
          </p>
        </div>

        <span
          className={`rounded-lg px-3 py-2 text-sm font-semibold ${
            increased
              ? "bg-red-50 text-red-500"
              : decreased
                ? "bg-green-50 text-green-600"
                : "bg-gray-100 text-gray-500"
          }`}
        >
          {increased ? "▲ " : decreased ? "▼ " : "— "}
          {changeText}%
        </span>
      </div>
    </Link>
  );
}
