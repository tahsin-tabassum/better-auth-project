"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage(){
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail]= useState("");
     const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");



async function handleSignUp (e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

if(password.length < 8){
    setError("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
}

if (password !==confirmPassword){
    setError("পাসওয়ার্ড দুটি মিলছে না।");
      return;

}
setLoading(true);

try{
    const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password
    });

    if(result.error){
        setError(result.error.message ||"অ্যাকাউন্ট তৈরি করা যায়নি।" );
        return;
    }

    router.push("/");
     router.refresh();
} catch{
    setError("কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।");
} finally {
    setLoading(false);
}
}


async function socialLogin(provider:"google" | "github") {
    setError("");

    try{
        const result = await authClient.signIn.social({
            provider, 
            callbackURL: "/",
        });

        if(result.error){
            setError(result.error.message ||"লগইন করা যায়নি।" );
        }
    } catch {
        setError("সোশ্যাল লগইন শুরু করা যায়নি।");
    }
}

return (
    <main className="min-h-[calc(100vh-210px) bg-[#F0F6F1] px-4 pb-20 pt-10">
<div className="mx-auto max-w-97.5">
<div className="mb-6 text-center">
<h1 className="text-[25px] font-extrabold text-[#253027]">
   অ্যাকাউন্ট তৈরি করুন
  </h1>

      <p className="mt-2 text-[13px] text-[#788279]">
 বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
   </p>    
</div>

<div className="rounded-[15px] border border-[#E0E9E1] bg-white p-5 sm:p-6">
<form onSubmit={handleSignUp} className="space-y-4">
<div>
    <label htmlFor="signup-name" className="mb-1.5 block text-[13px] font-semibold text-[#354037]">
       নাম 
    </label>
<input
id="signup-name"
type="text"
required
value={name}
onChange={(e) => setName(e.target.value)}  placeholder="যেমন: রহিম উদ্দিন"
className="auth-input"
/>
</div>

<div>
<label htmlFor="signup-name" className="mb-1.5 block text-[13px] font-semibold text-[#354037]">
       ইমেইল
    </label>

 <input
 id="signup-email" type="email"
  required
    value={email} 
    onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"   className="auth-input"
/>
</div>

<div>
              <label htmlFor="signup-password" className="mb-1.5 block text-[13px] font-semibold text-[#354037]">
                পাসওয়ার্ড
              </label>
               <input  id="signup-password"
  type="password" required
 minLength={8}
     value={password}
     onChange={(e) => setPassword(e.target.value)}
   placeholder="কমপক্ষে ৮ অক্ষর"
  className="auth-input"
 />
  </div>

   <div>
  <label htmlFor="signup-confirm" className="mb-1.5 block text-[13px] font-semibold text-[#354037]">
  পাসওয়ার্ড নিশ্চিত করুন
  </label>
  <input
    id="signup-confirm"
   type="password"   required
       value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
  placeholder="আবার লিখুন"
   className="auth-input"
 /> </div>

{error && (
    <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
{error}
    </p>
)}

<button type="submit"
disabled={loading}
className="w-full rounded-lg bg-[#008C45] py-3 text-[14px] font-semibold text-white shadow-[0_3px_0_#006B34] transition hover:bg-[#00783C] disabled:opacity-60"
>
{loading ? "অপেক্ষা করুন..." : "অ্যাকাউন্ট তৈরি করুন"}
</button>
</form>

<div className="my-5 flex items-center gap-3">
 <div className="h-px flex-1 bg-[#E5EAE5]" />
  <span className="text-xs text-[#879087]">অথবা</span>
 <div className="h-px flex-1 bg-[#E5EAE5]" />
</div>

<div className="grid grid-cols-2 gap-2">
<button type="button" onClick={() => socialLogin("google")} className="auth-social">
<span className="font-bold text-[#4285F4]">
    G
</span>
 Google দিয়ে চালিয়ে যান
</button>
<button type="button" onClick={() => socialLogin("github")} className="auth-social">
<span className="font-bold text-[#4285F4]">
    ◉
</span>
 GitHub দিয়ে চালিয়ে যান
</button>
</div>
<p className="mt-5 text-center text-[12px] text-[#68736A]">  অ্যাকাউন্ট আছে?{" "}
   <Link href="/signin" className="font-semibold text-[#008C45] hover:underline">  সাইন ইন করুন  </Link>
 </p>
</div>

<div className="mt-6 text-center">
<Link href="/" className="text-[12px] text-[#879087] hover:text-[#008C45]">
  ← হোম পেজে ফিরে যান
</Link>
</div>

</div>
    </main>
);
}