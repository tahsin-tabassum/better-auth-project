"use client";
import {useMemo, useState} from "react";
import type {Product} from "@/types/bazardor";
import ProductGrid from "./ProductGrid";
import { bnNumber } from "@/lib/format";


export default function CategoryProducts ({
    products,
}:{
    products: Product[];
}) {
    const [sort, setSort] = useState("default");

    const sortedProducts = useMemo(()=>
    {
        const copy = [...products];

        if (sort === "asc") {
            copy.sort((a, b) => a.price - b.price);
           }
      if (sort === "desc") {
      copy.sort((a, b) => b.price - a.price);
    }
         return copy; 
    }, [products, sort]);

    return (
        <>
        <div className="sort-row">
            <span>{bnNumber(sortedProducts.length)}টি পণ্য</span>

            <label htmlFor="sort-products" className="sort-control">
                <span>সাজান:</span>
                <select  id="sort-products" value={sort} onChange={(event) => setSort(event.target.value)}>
                    <option value="default">ডিফল্ট</option>
                           <option value="asc">দাম: কম থেকে বেশি</option>
            <option value="desc">দাম: বেশি থেকে কম</option>
                </select>
            </label>
        </div>
        <ProductGrid products={sortedProducts}/>
        </>
    );
}