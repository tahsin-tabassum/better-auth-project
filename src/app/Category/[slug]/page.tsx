import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryProducts from "@/components/CategoryProducts";
import { getCategories, getProducts } from "@/lib/api";

type Props={
    params: Promise<{
        slug:string;
    }>;
};

export default async function CategoryPage({params}:Props) {
    const {slug} = await params;
    const categories = await getCategories();

    const category = categories.find(
        (item) => item.slug === slug || item.id === slug
    );
if (!category) {
    notFound();
  }

const products = await getProducts (slug);

return (
    <main className="min-h-[calc(100vh-210px)] bg-[#F0F6F1] px-4 pb-28 pt-8">
<div className="mx-auto max-w-285">
  {/* Category Header */}
        <div className="flex min-h-23.75 items-center gap-4 rounded-[17px] border border-[#E0E9E1] bg-white px-5 py-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F1F6F2] text-[29px]">
            {category.icon}
          </div>
          <div>
             <h1 className="text-[23px] font-extrabold text-[#253027]">
              {category.nameBn}
            </h1>
            <p className="mt-1 text-[13px] text-[#7B857D]">
                {category.nameBn} পণ্যের আজকের দাম ও পরিবর্তন 
            </p>
          </div>
          </div>


<CategoryProducts products={products}/>

</div>
    </main>
)


}
