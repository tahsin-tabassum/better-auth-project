import Link from "next/link";
import type {Product} from "@/types/bazardor";
import {bnNumber, formatChange, formatPrice } from "@/lib/format";


export default function ProductCard ({
    product, 
}:{
    product: Product;
}) {
    const changeColor = product.change > 0 ? "bg-red-50 text-red-600"
    : product.change < 0
 ? "bg-green-50 text-green-700"
   : "bg-gray-100 text-gray-600";

return (
    <Link  href={`/products/${product.id}`} className="group rounded-2xl border border-gray-200 bg-white p-4 transition hover:-translate-y-1 hover:border-green-300 hover:shadow-lg">
    <div className="flex h-28 items-center justify-center rounded-xl bg-green-50 text-5xl">
{product.icon}
    </div>

    <h3 className="mt-4 font-bold text-gray-900 group-hover:text-green-700">
 {product.nameBn}
    </h3>
    <p className="mt-1 text-sm text-gray-500">
{product.unit}
    </p>
    <div className="mt-4 flex items-end justify-between gap-2">
<div>
    <p className="text-xs text-gray-500 ">আজকের দাম</p>
    <p className="mt-1 font-bold text-gray-900">
            {formatPrice(product.price)}
          </p>
</div>

<span className={`rounded-full px-2 py-1 text-xs font-semibold ${changeColor}`}>
{formatChange(product.change)}
</span>
    </div>
    </Link>
);
}