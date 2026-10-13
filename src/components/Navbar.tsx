import Link from "next/link";
import { getCategories } from "@/lib/api";

export default async function Navbar() {
    let categories = [];
    try {
    categories = await getCategories();

    }
    catch{
        categories=[];
    }

return (
    <header className="border-b border-gray-200 bg-white">
<div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 py-4">
<Link href="/" className="text-2xl font-bold text-green-700">🛒 বাজার দর
<span className="mt-1 block text-xs font-normal text-gray-500">
    প্রতিদিনের বাজারের সঠিক দর
</span>
</Link>
<div className="flex gap-2">
    <Link href="/signin"
className="rounded-lg border border-green-700 px-4 py-2 text-sm font-semibold text-green-700">
    সাইন ইন</Link>

     <Link
 href="/signup"
   className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white"  >
            সাইন আপ
          </Link>
</div>
</div>
<nav className="mx-auto flex max-w-7xl flex-wrap gap-2 px-4 pb-4">
<Link
          href="/"
          className="rounded-full bg-green-700 px-4 py-2 text-sm text-white"
        >
          সব পণ্য
        </Link>

        {categories.map((category) =>(
            <Link 
            key={category.id}
            href={`/category/${category.slug}`} 
            className="rounded-full px-4 py-2 text-sm text-gray-700 transition hover:bg-green-100 hover:text-green-800">
           {category.icon} {category.nameBn}
            </Link>
        ))}
</nav>
    </header>
);


}