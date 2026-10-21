
import Image from "next/image";
import BanglaDate from "./BanglaDate";

import heroBanner from "@/image/bazar-hero.png";
export default function HeroSection(){

   return (
       <section className="bg-[#F0F6F1] px-4  py-5 sm:py-6">
<div className="mx-auto grid max-w-285 items-center gap-6 overflow-hidden rounded-[22px] border border-[#E0E9E1] bg-[#FCFEFC] px-5 py-6 sm:px-8 md:min-h-78 md:grid-cols-[1fr_280px]">
         {/* {left\/*  */}
 <div>
    <span className="inline-flex items-center rounded-full bg-[#E3F4E8] px-4 py-1.5 text-xs font-semibold text-[#008C45] ">
<BanglaDate/>
    </span>
    {/* heading */}
<h1 className="mt-3 text-[28px] font-extrabold leading-tight text-[#202B22] sm:text-[36px]">
আজকের বাজারের দাম এক নজরে
</h1>

<p className="mt-5 max-w-145 text-sm leading-7 text-[#737C74]">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
            বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের
            পরিবর্তন এক জায়গায়।
          </p>

          <a
            href="#সব-পণ্য"
            className="mt-7 inline-flex items-center justify-center rounded-lg bg-[#008C45] px-6 py-3 text-sm font-semibold text-white shadow-[0_3px_0_#006C34] transition hover:bg-[#00783C]"
          >
            সব পণ্য দেখুন
          </a>

 </div>

{/* right */}
<div className="flex items-center justify-center">
 <Image
            src={heroBanner}
            alt="Banner"
             width={280}
            height={220}
          priority
    className="h-auto w-full max-w-75 object-contain"
          
          />
</div>

</div>
        </section>
    );
}