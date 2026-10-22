"use client";
import {useMemo, useState} from "react";
import type {Product} from "@/types/bazardor";
import ProductCard from "./ProductCard";

type SortOption = "default" | "low" | "high";

type Props= {
    products: Product[];
};


export default function CategoryProducts ({
    products}:Props) {
    const[sortBy, setSortBy] = useState<SortOption>("default");
 const sortedProducts = useMemo(()=>
    {
        const result = [...products];

        if (sortBy === "low") {
        result.sort((a, b) => Number(a.price) - (b.price));
           }
      if (sortBy === "high") {
      result.sort((a, b) => Number(b.price) - (a.price));
    }
         return result; 
    }, [products, sortBy]);

    return (
        <>
        <div className="mt-6 flex min-h-16.25 items-center justify-end rounded-[15px] border border-[#E0E9E1] bg-white px-5">
<div className="flex items-center gap-3">

 <label htmlFor="category-sort" className="text-[13px] text-[#7B857D]">
                সাজান </label>
                <select  id="category-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)}
                 className="rounded-lg border border-[#E0E9E1] bg-white px-3 py-2 text-[13px] text-[#354037] outline-none focus:border-[#008C45]"   >
                    <option value="default">ডিফল্ট</option>
                           <option value="low">দাম: কম থেকে বেশি</option>
            <option value="high">দাম: বেশি থেকে কম</option>
                </select>
           
        </div></div>

         {/* Product Count */}
      <p className="mb-5 mt-4 text-[13px] text-[#7B857D]">
        মোট {products.length.toLocaleString("bn-BD")}টি পণ্য দেখানো হচ্ছে
      </p>

       {/* Product Grid */}
       {sortedProducts.length>0 ? (
       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
{sortedProducts.map((product)=>(
<ProductCard  key={product.id} product={product}/>
))}
       </div> ):
       (
        <div className="rounded-xl border border-[#E0E9E1] bg-white px-6 py-16 text-center">
          <p className="text-lg font-semibold text-[#253027]">
            কোনো পণ্য পাওয়া যায়নি
          </p>
          <p className="mt-2 text-sm text-[#7B857D]">
            এই ক্যাটাগরিতে এখনো কোনো পণ্য নেই।
          </p>
        </div>
       )}
        
        </>
    );
}