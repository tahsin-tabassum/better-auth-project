import Link from "next/link";
import type {Product} from "@/types/bazardor";
import { formatChange, formatPrice } from "@/lib/format";


export default function ProductCard ({
    product, 
}:{
    product: Product;
}) {
    const trend = product.change > 0 ? "up"
    : product.change < 0
 ? "down"
   : "flat";

return (
    <Link  href={`/product/${encodeURIComponent(
        product.slug || String(product.id),
      )}`}  className="product-card group">
    
<div className="product-card-top">
<div className="product-icon" aria-hidden="true">
    {product.icon}
</div>

<div className="min-w-0 flex-1">
 <h3 className="product-name">
 {product.nameBn}
    </h3>
    <p className="product-unit">
{product.unit}
    </p>
</div>
</div>

<div className="product-price-row">
    <div>
        <p className="price-label">আজকের দাম</p>
          <p className="product-price">
            {formatPrice(product.price)}
          </p>
    </div>


   <span className={`change-badge ${trend}`}>
    {formatChange(product.change)}
   </span>
   </div>
    </Link>
);
}