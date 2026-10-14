import type {Product} from "@/types/bazardor";
import {formatChange, formatPrice } from "@/lib/format";


export default function PriceTicker ({
    products,
}:{
    products: Product[];
}) {
    if (!products.length) return null;
    const items = [...products, ...products];

return(
<div className="overflow-hidden bg-green-950 py-3 text-white"> 
<div className="ticker-track flex w-max items-center gap-8">
{
    items.map((product, index) => (
    <div key={`${product.id}-${index}`}
    className="flex items-center gap-2 whitespace-nowrap text-sm">
<span>{product.icon}</span>
<span>{product.nameBn}</span>
<span className="font-semibold">
    {formatPrice(product.price)}
</span>
<span className={product.change > 0  ? "text-red-300"
     : product.change < 0
     ? "text-green-300"
    :"text-gray-300"}>

</span>
    </div>
    ))
}
</div>
</div>
)
}