"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BASE_API = "https://ecommerce-saas-server-wine.vercel.app/api/v1/category/website";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID;

export default function CategorySection() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);

  const rowRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        if (!STORE_ID) {
          setCats([]);
          return;
        }

        const res = await fetch(`${BASE_API}/${STORE_ID}`, {
          cache: "no-store",
          headers: {
            "store-id": STORE_ID,
          },
        });

        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data : [];
        setCats(list);
      } catch (e) {
        setCats([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const mapped = useMemo(() => {
    return cats
      .map((c) => ({
        id: c?._id,
        title: c?.parentCategory ?? "Unnamed",
        path: c?.path ?? "",
        img: c?.imageURLs ?? "",
      }))
      .filter((c) => c.title);
  }, [cats]);

  const scrollByPx = (px) => {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({ left: px, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-[#F3F6FF] py-10">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">Category</h2>
        </div>

        {/* Category row */}
        <div className="relative">
          {/* Left arrow */}
          <button
            type="button"
            onClick={() => scrollByPx(-360)}
            className="absolute -left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </button>

          {/* Cards */}
          <div
            ref={rowRef}
            className="flex w-full gap-5 overflow-x-auto scroll-smooth px-6 pb-2"
            style={{ scrollbarWidth: "none" }}
          >
            {/* hide scrollbar */}
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {loading ? (
              Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="min-w-[160px] rounded-lg bg-white p-4 text-center shadow-sm"
                >
                  <div className="mx-auto mb-3 h-16 w-16 animate-pulse rounded-md bg-slate-200" />
                  <div className="mx-auto h-4 w-[120px] animate-pulse rounded bg-slate-200" />
                </div>
              ))
            ) : !STORE_ID ? (
              <div className="py-6 text-sm text-red-500">
                Env Not Working
              </div>
            ) : mapped.length === 0 ? (
              <div className="py-6 text-sm text-slate-500">No categories found</div>
            ) : (
              mapped.map((cat) => (
                <Link
                  key={cat.id}
                  href={cat.path ? `/category/${cat.path}` : "#"}
                  className="min-w-[160px] rounded-lg bg-white p-4 text-center shadow-sm hover:shadow"
                >
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-md bg-slate-50">
                    <img
                      src={cat.img || "/cat-placeholder.png"}
                      alt={cat.title}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <p className="text-sm font-bold text-black">{cat.title}</p>
                </Link>
              ))
            )}
          </div>

          {/* Right arrow */}
          <button
            type="button"
            onClick={() => scrollByPx(360)}
            className="absolute -right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5 text-slate-600" />
          </button>
        </div>
      </div>
    </section>
  );
}
