import { notFound } from "next/navigation";
import { Suspense } from "react";

import ProductDetails, {type MarketPrice,} from "@/components/ProductDetails";
import { getProduct } from "@/lib/api";

type Props = {
    params: Promise<{slug: string}>;
};

async function ProductContent({slug}: {slug: string}) {
    const product = await getProduct(slug);
    if(!product){
        notFound();
    }
const marketPrices: MarketPrice[] = [];

return(
  <ProductDetails
 product={product}  marketPrices={marketPrices} />  
);

}

export default async function ProductPage({params}: Props){
    const {slug} = await params;

    return (
        <Suspense fallback={
            <ProductDetailsSkeleton/>
        }>
       <ProductContent slug={slug} />
    </Suspense> 
    );
}


function ProductDetailsSkeleton (){
    return (
       <main className="min-h-[80vh] bg-[#F0F6F1] px-4 pb-24 pt-8">
      <div className="mx-auto max-w-[1140px] animate-pulse space-y-6">
        <div className="h-5 w-52 rounded bg-[#DFE8DF]" />
        <div className="h-[160px] rounded-2xl bg-white" />
       <div className="rounded-2xl bg-white p-6">
<div className="h-6 w-44 rounded bg-[#DFE8DF]" />
  <div className="mt-5 grid gap-3 sm:grid-cols-3">
    {[1, 2, 3].map((item)=>(
        <div
        key={item}
        className="h-27.5 rounded-xl bg-[#F0F6F1]"
        />  ))}
  </div>
  <div className="mt-8 h-75 rounded-xl bg-[#F0F6F1]"/>

       </div>
        </div></main>
    );
}
