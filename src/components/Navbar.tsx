
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";

type Category = {
  id: string | number;
  slug: string;
  icon: string;
  nameBn: string;
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [categories, setCategories] = useState<Category[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch categories from our own API route
  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const response = await fetch("/api/categories");

        if (!response.ok) {
          throw new Error("Failed to load categories");
        }

        const data: Category[] = await response.json();

        if (!cancelled) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Category loading error:", error);
      }
    }

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function handleSignOut() {
    setSigningOut(true);
    setSignOutError("");

    try {
      const result = await authClient.signOut();

      if (result.error) {
        setSignOutError(
          result.error.message || "সাইন আউট করা যায়নি"
        );
        return;
      }

      setMenuOpen(false);
      router.replace("/signin");
      router.refresh();
    } catch {
      setSignOutError("সাইন আউট করা যায়নি");
    } finally {
      setSigningOut(false);
    }
  }

  const user = session?.user;

  return (
    <header className="relative z-50 border-b border-[#E3EAE4] bg-white">
      {/* Top Navbar */}
      <div className="border-b border-[#EDF1ED]">
        <div className="mx-auto flex max-w-[1140px] items-center justify-between gap-4 px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7F5EB] text-xl">
              🛒
            </div>

            <div>
              <h2 className="text-[19px] font-extrabold leading-6 text-[#00843D]">
                বাজার দর
              </h2>

              <p className="text-[11px] text-[#7B857D]">
                প্রতিদিনের বাজারের সঠিক দর
              </p>
            </div>
          </Link>

          {/* Authentication */}
          <div>
            {isPending ? (
              <div className="h-9 w-28 animate-pulse rounded-lg bg-gray-100" />
            ) : user ? (
              <div ref={dropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-[#F0F6F1]"
                >
                  <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#E4F2E8]">
                    {user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.image}
                        alt={user.name || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="font-bold text-[#00843D]">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    )}
                  </div>

                  <span className="hidden max-w-28 truncate text-sm font-semibold text-[#29362C] sm:block">
                    {user.name}
                  </span>

                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`text-gray-500 transition-transform ${
                      menuOpen ? "rotate-180" : ""
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

                {/* User Dropdown */}
                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full z-[100] mt-2 w-[245px] rounded-xl border border-[#E5EBE6] bg-white p-3 shadow-lg"
                  >
                    <div className="border-b border-[#EDF1ED] px-2 pb-3">
                      <p className="truncate text-sm font-bold text-[#253027]">
                        {user.name}
                      </p>

                      <p className="mt-1 truncate text-xs text-[#7B857D]">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                      className="mt-2 flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-[#344038] hover:bg-[#F0F6F1]"
                    >
                      👤 আমার প্রোফাইল
                    </Link>

                    <button
                      type="button"
                      role="menuitem"
                      disabled={signingOut}
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-red-500 hover:bg-red-50 disabled:opacity-50"
                    >
                      ↪ {signingOut ? "অপেক্ষা করুন..." : "সাইন আউট"}
                    </button>

                    {signOutError && (
                      <p role="alert" className="mt-2 px-2 text-xs text-red-600">
                        {signOutError}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/signin"
                  className="rounded-lg border border-[#00843D] px-4 py-2 text-sm font-semibold text-[#00843D] transition hover:bg-green-50"
                >
                  সাইন ইন
                </Link>

                <Link
                  href="/signup"
                  className="rounded-lg bg-[#00843D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#006F34]"
                >
                  সাইন আপ
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Categories */}
      <nav className="mx-auto flex max-w-[1140px] items-center gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none]">
        <Link
          href="/"
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
            pathname === "/"
              ? "bg-[#00843D] text-white"
              : "text-[#425044] hover:bg-green-50"
          }`}
        >
          সব পণ্য
        </Link>

        {categories.map((category) => {
          const active =
            pathname === `/category/${category.slug}`;

          return (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${
                active
                  ? "bg-[#00843D] text-white"
                  : "text-[#425044] hover:bg-green-50"
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.nameBn}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
