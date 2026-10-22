import Link from "next/link";
import type { Product } from "@/types/bazardor";

export type MarketPrice = {
    market: string;
location: string;
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
};

type Props ={
    product: Product;
    marketPrices: MarketPrice[];
};

const bn = (value: number) => value.toLocaleString("bn-BD",{
    maximumFractionDigits: 2,
});

export default function ProductDetails ({
    product, 
    marketPrices,
}:Props) {
    const price = Number(product.price) || 0;
const change = Number(product.change) || 0;


const minPrice = marketPrices.length > 0 ? Math.min(...marketPrices.map((item) => item.minPrice))
: null;

const maxPrice = marketPrices.length > 0 ? Math.max(...marketPrices.map((item) => item.maxPrice))
: null;

const averagePrice = marketPrices.length > 0 ? marketPrices.reduce((total, item) => total + item.averagePrice, 0) / marketPrices.length
: null;


return (
    <main className="min-h-[80vh] bg-[#F0F6F1] px-4 pb-24 pt-8">
<div className="mx-auto max-w-285">
<nav className="mb-7 flex-wrap items-center gap-2 text-[13px] text-[#647168]">
 <Link href="/" className="hover:text-[#008C45]">
   হোম
    </Link>

    <span>›</span>
 <Link href={`/category/${product.category}`}
 className="hover:text-[#008C45]">
    {product.category || "ক্যাটাগরি"}
</Link>
<span>›</span>
<span className="font-medium text-[#253027]">
    {product.nameBn}
</span>
</nav>
 {/* Product Summary */}

 <section className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-[#E0E9E1] bg-white p-5 sm:p-7">
          <div className="flex items-center gap-4">
            <div className="flex h-19 w-19 shrink-0 items-center justify-center rounded-2xl bg-[#F0F6F1] text-[40px]">
              {product.icon || "🛒"}
            </div>

            <div>

<h1 className="text-[25px] font-extrabold text-[#253027] sm:text-[29px]">
   {product.nameBn}
</h1>

  <p className="mt-1 text-[13px] text-[#788279]">
প্রতি {product.unit} · {product.category}
   </p>

<p className="mt-3 text-[12px] text-[#354037]">
    গতকালের তুলনায় আজ দাম{" "}
    {change > 0
   ? "বেড়েছে"
  : change < 0
   ? "কমেছে"
    : "অপরিবর্তিত রয়েছে"}  ।
</p>  </div> </div>

 {/* Today's Price */}

<div className="min-w-30 rounded-2xl bg-[#F0F6F1] px-6 py-4 text-center">
<p className="text-[12px] text-[#788279]">
আজকের দাম
</p>

 <p className="mt-1 text-[29px] font-extrabold text-[#253027]">
 {bn(price)}  </p>

<p className="text-[12px] text-[#788279]">
 টাকা / {product.unit} </p>

<p className={`mt-2 text-[12px] font-bold ${
change > 0 ?"text-red-500"
:change <0? "text-green-600" : "text-gray-500"}`
}>

{change>0 ? "▲" : change < 0 ? "▼" : "—"}{" "}
{bn(Math.abs(change))}%
</p>
</div>
</section>


 {/* Market Prices */}
 <section className="mt-6 rounded-2xl border border-[#E0E9E1] bg-white p-5 sm:p-7">
<h2 className="text-[18px] font-extrabold text-[#253027]">
দামের সারসংক্ষেপ
</h2>

<div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
<SummaryCard title="সর্বনিম্ন দাম"
value={minPrice}
subtitle="সবচেয়ে কম দামের বাজার"
  color="green"
 />
<SummaryCard title="সর্বাধিক দাম"
value={maxPrice}
subtitle="সবচেয়ে বেশি দামের বাজার"
  color="red"
 />

 <SummaryCard title="গড় দাম"
value={averagePrice}
subtitle="সবচেয়ে বেশি দামের বাজার"
  color="green"
 />

</div>


<h2 className="mb-4 mt-8 text-[18px] font-extrabold text-[#253027]">
বাজারভিত্তিক আজকের দাম
</h2>

<div className="overflow-x-auto rounded-xl border border-[#E0E9E1]">
<table className="w-full min-w-[650px] border-collapse text-left text-[13px]">
 <thead className="bg-[#F9FCF9] text-[#69766C]">

    <tr>
        <th className="px-4 py-4 font-semibold">বাজার</th>
        <th className="px-4 py-4 font-semibold">বিভাগ</th>
  <th className="px-4 py-4 font-semibold">সর্বনিম্ন</th>
  <th className="px-4 py-4 font-semibold">সর্বাধিক</th>     
  <th className="px-4 py-4 font-semibold">গড়</th>
    </tr>
   </thead>
   
   <tbody>
                {marketPrices.length > 0 ? (
                  marketPrices.map((item, index) => (
                    <tr
                      key={`${item.market}-${index}`}
                      className={`border-t border-[#E4EBE5] ${
                        index % 2 === 1
                          ? "bg-[#F1F6F2]"
                          : "bg-white"
                      }`}
                    >
<td className="px-4 py-3 font-medium">
{item.market}
</td>
<td className="px-4 py-3">{item.location}</td>
<td className="px-4 py-3 text-right">{bn(item.minPrice)} টাকা</td>
<td className="px-4 py-3 text-right">{bn(item.averagePrice)} টাকা</td>
                    </tr>))
):(
<tr>
<td colSpan={5}
 className="px-4 py-10 text-center text-[#788279]">বাজারভিত্তিক দামের তথ্য পাওয়া যায়নি। </td>   
</tr>
)}
   </tbody>

</table>
</div>
 </section>
</div>
    </main>
);
}

function SummaryCard({
  title,
  value,
  subtitle,
  color,
}:{
    title: string;
  value: number | null;
  subtitle: string;
  color: "green" | "red";
}) {
    return (
        <div className="rounded-xl border border-[#E0E9E1] bg-[#FCFEFC] px-5 py-5">
<p className="text-[13px] text-[#69766C]">{title}</p>
 <p
        className={`mt-2 text-[24px] font-extrabold ${
          color === "green" ? "text-[#008C45]" : "text-[#E54848]"
        }`}
      >
      {value === null ? "—" : `${bn(value)} টাকা`}  
      </p>
      <p className="mt-1 text-[11px] text-[#788279]">
        {subtitle}
      </p>
        </div>
    );
}
