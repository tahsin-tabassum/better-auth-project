"use client";

import {useState, type FormEvent } from "react";

import {useRouter} from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage(){
    const router = useRouter();
    const {data: session, isPending} = authClient.useSession();

 const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const user = session?.user;
  
  async function handleUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
     setError("");
    setMessage("");

    const updatedName = name.trim();

    if (!updatedName) {
      setError("অনুগ্রহ করে নতুন নাম লিখুন।");
      return;
    }

setSaving (true);

try{
    const result = await authClient.updateUser({
        name: updatedName,
    });
    if (result.error){
        setError(result.error.message || "নাম আপডেট করা যায়নি।");
        return;
    }

    setMessage("আপনার প্রোফাইল সফলভাবে আপডেট হয়েছে!");
    setName("");
    router.refresh();
} catch{
    setError("কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।");
} finally {
    setSaving(false);
}

  }

async function handleSignOut() {
    setSigningOut(true);
    setError("");

try{
    const result = await authClient.signOut();

    if(result.error){
        setError(result.error.message || "সাইন আউট করা যায়নি।");
        return;
    }
router.replace("/signin");
router.refresh();

} catch{
    setError("সাইন আউট করা যায়নি।");
} finally {setSigningOut(false);}

}


 if (isPending) {
    return (
      <main className="min-h-[70vh] bg-[#F0F6F1] px-4 py-20">
        <div className="mx-auto max-w-[640px] animate-pulse space-y-5">
          <div className="h-8 w-48 rounded bg-[#DFE8DF]" />
          <div className="h-28 rounded-2xl bg-white" />
          <div className="h-56 rounded-2xl bg-white" />
        </div>
      </main>
    );
  }

if(!user){
    return(
        <main className="flex  min-h-[70vh] flex-col items-center justify-center bg-[#F0F6F1] px-4 text-center">
<h1 className="text-2xl font-bold text-[#253027]">
প্রোফাইল দেখতে সাইন ইন করুন
</h1>
<p className="mt-2 text-sm text-[#7B857D]">
আপনার অ্যাকাউন্টের তথ্য দেখতে লগইন করতে হবে।
</p>
  <Link href="/signin"  className="mt-6 rounded-lg bg-[#008C45] px-6 py-3 text-sm font-semibold text-white" > সাইন ইন করুন </Link>
        </main>
    );
}

return (
    <main className="min-h-[calc(100vh-200px)] bg-[#F0F6F1] px-4 pb-28 pt-20 sm:pt-24">
<div className="mx-auto w-full max-w-160">
<div className="mb-6">
 <h1 className="text-[25px] font-extrabold text-[#253027]"> আমার প্রোফাইল</h1>
 <p className="mt-1 text-[13px] text-[#818B83]">  আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন। </p>
</div>
{/* profile card */}
<div className="flex flex-wrap items-center justify-between gap-4 rounded-[15px] border border-[#E1EAE2] bg-white px-5 py-5 ">
<div className="flex min-w-0 items-center gap-4">
<div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#E9EEEA]">
{user.image? (
   <img src={user.image}
 alt={user.name}
 className="object-cover"/>  
):(
    <span className="text-[28px] font-bold">
{user.name?.charAt(0).toUpperCase() || "U"}
    </span>
)}
</div>

<div className="min-w-0">
    <h2 className="truncate text-[17px] font-bold text-[#253027]">
        {user.name}
    </h2>
    <p className="mt-1 truncate text-[13px] text-[#818B83]">
{user.email}
    </p>
</div>

</div>

<button type="button" onClick={handleSignOut} disabled={signingOut}
className="rounded-lg border border-[#EF5D5D] px-4 py-2 text-[12px] font-semibold text-[#E54848] transition hover:bg-red-50 disabled:opacity-60">
{signingOut ? "অপেক্ষা করুন..." : "↪ সাইন আউট"}
</button>
</div>


  {/* Update Profile Card */}

<div className="mt-5 rounded-[15px] border border-[#E1EAE2] bg-white px-5 py-6 sm:px-8 sm:py-8">
<h2 className="text-[16px] font-bold text-[#253027]">তথ্য</h2>

<form onSubmit={handleUpdate} className="mt-7">
<label htmlFor="profile-name" className="mb-2 block text-[13px] font-semibold text-[#354037]">নাম</label>

            <input
 id="profile-name" type="text"
required
value={name}
onChange={(e) => setName(e.target.value)}
placeholder={user.name || "আপনার নতুন নাম লিখুন"}
 className="block h-10.75 w-full rounded-lg border border-[#E0E9E1] bg-white px-4 text-sm text-[#253027] outline-none focus:border-[#008C45] focus:ring-2 focus:ring-[#008C45]/10" />

{message && (
    <p role="status" className="mt-3 text-xs text-[#008C45]">
{message}
    </p>
)}

{error && (
    <p role="alert" className="mt-3 text-xs text-red-600">
{error}
    </p>
)}
<button
 type="submit"
disabled={saving}
  className="mt-4 w-full rounded-lg bg-[#008C45] py-3 text-[13px] font-semibold text-white shadow-[0_3px_0_#006B34] transition hover:bg-[#00783C] disabled:opacity-60">
{saving ? "আপডেট হচ্ছে..." : "আপডেট"}
   </button>

</form>

</div>
</div>
    </main>
);


}