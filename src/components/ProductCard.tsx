import Link from "next/link";
import type {Product} from "@/types/bazardor";


type Props = {
    product: Product;
};


export default function ProductCard({ product}: Props){
    const price = Number(product.price) || 0;
    const change = Number(product.change) || 0;
const isUp = change > 0;
const isDown = change < 0;

const changeText = Math.abs(change).toLocaleString("bn-BD",{
    maximumFractionDigits: 1 ,
});

return (
    <Link
      href={`/product/${product.slug || product.id}`}
      className="group block rounded-xl border border-[#E4EBE5] bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#A7D6B5] hover:shadow-md"
    >
<div className="flex items-start gap-3">
<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F2F7F3] text-[24px]">
{product.icon || "🛒"}
</div>

        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-bold text-[#253027]">
            {product.nameBn}
          </h3>
          <p className="mt-0.5 text-[11px] text-[#7B857D]">
            প্রতি {product.unit}
          </p>
</div>
</div>

{/* Product price */}
      <div className="mt-5 flex items-end justify-between gap-2">
        <div>
          <p className="mb-1 text-[11px] text-[#7B857D]">
            আজকের দাম
          </p>

          <p className="text-[20px] font-extrabold leading-none text-[#253027]">
            {price.toLocaleString("bn-BD")}{" "}
            <span className="text-[12px] font-semibold">টাকা</span>
          </p>
        </div>

<span className={`rounded-md px-2 py-1 text-[11px] font-semibold ${
    isUp ? "bg-[#FFF1F1] text-[#E44747]"
     : isDown
     ? "bg-[#EAF8EF] text-[#159B55]"
  : "bg-[#F0F2F0] text-[#7D857E]"
} `}>
{isUp ? "▲" : isDown ? "▼" : "—"} {changeText}%
</span>

        </div>

    </Link>

)


}