import type { Product } from "@/types/bazardor";
import ProductCard from "./ProductCard";

export default function ProductGrid({
    products,
}: {
    products: Product[];

}) {
    if(!products.length){
        return (
            <div className="empty-state">
               এই মুহূর্তে কোনো পণ্যের তথ্য পাওয়া যায়নি। 
            </div>
        );
    }

    return (
        <div className="product-grid">
            {products.map((product) =>(
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}