"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import { authClient } from "@/lib/auth-client";

type Props = {
 name: string;
email: string;
image?: string | null;
};

export default function UserDropdown({
name, email, image,
}:Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
 useEffect(() =>{
    function handleClickOutside(event: MouseEvent){
        if(
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
        ) {
            setOpen(false);
        }
    }

    function handleEscape(event: KeyboardEvent){
        if(event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
return () => {
 document.removeEventListener("mousedown", handleClickOutside);
 document.removeEventListener("keydown", handleEscape);
};
 },[]);

async function handleSignOut() {
    if( preview) {
        setOpen (false);
    return;
    }
    setLoading(true);

    try{
        const result = await authClient.signOut();
    
        if(result.error){
            alert(result.error.message ||"সাইন আউট করা যায়নি।" );
            return;
        }
      setOpen(false);
      router.push("/signin");
      router.refresh();       
    } catch{
        alert("সাইন আউট করা যায়নি।");
    } finally {
        setLoading(false);
    }

    
}

return(
    <div ref={dropdownRef} className="relative">
{/* dropdown */}
<button type="button"
aria-expanded={open}
aria-haspopup="menu"
onClick={() => setOpen((previous) => !previous)}
className="flex items-center gap-2 rounded-lg px-2 py-2 transition hover:bg-[#EDF4EE]">
<div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#E6F1E9]">
{image ? (
     <img
              src={image}
              alt={name}
              className="h-full w-full object-cover"
            />
):(
    <span className="text-[16px] font-bold text-[#008C45]">
        {name.charAt(0).toUpperCase()}
    </span>
)}
</div>

<span className="hidden max-w-27.5 truncate text-[13px] font-medium text-[#253027] sm:block">
    {name.split(" ")[0]}
</span>

<svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          className={`text-[#68736A] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >

             <path
            d="m6 9 6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
</button>

{/* Dropdown menu */}
{open && (
    <div role="menu" className="absolute right-0 top-[calc(100%+8px)] z-100 w-61.25 rounded-[15px] border border-[#E0E9E1] bg-white p-4 shadow-[0_8px_22px_rgba(0,0,0,0.14)]">
<div className="mb-4">
<p className="truncate text-[14px] font-bold text-[#253027]">
{name}
  </p>

   <p className="mt-1 truncate text-[12px] text-[#7B857D]">
 {email}
  </p>

</div>

<Link href="/profile" role="menuitem" onClick={() => setOpen(false)}
className="flex items-center gap-2 rounded-lg px-1 py-2 text-[13px] font-medium text-[#354037] transition hover:bg-[#F0F6F1]">

 <span>👤</span>
  আমার প্রোফাইল
</Link>


<button type="button" role="menuitem" disabled={loading} onClick={handleSignOut}  className="flex w-full items-center gap-2 rounded-lg px-1 py-2 text-left text-[13px] font-medium text-[#E54848] transition hover:bg-red-50 disabled:opacity-60">
<span>↪</span>
{loading ? "অপেক্ষা করুন..." : "সাইন আউট"}
</button>
    </div>
)}
    </div>
);
}
