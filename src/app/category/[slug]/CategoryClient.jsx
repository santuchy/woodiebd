"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function CategoryClient({ slug, categoryName, products }) {
  const [sort, setSort] = useState("price-asc");

  const sorted = useMemo(() => {
    const list = [...(products || [])];
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, sort]);

  return (
    <section className="w-full bg-[#F3F6FF] py-10">
      <div className="mx-auto max-w-6xl px-4">
        {/* header bar */}
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-xl font-semibold text-slate-900">{categoryName}</h1>

            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-700">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none"
              >
                <option value="price-asc">Sort By Price (Low)</option>
                <option value="price-desc">Sort By Price (High)</option>
              </select>
            </div>
          </div>
        </div>

        {/* grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {sorted.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>

        {sorted.length === 0 ? (
          <div className="mt-10 rounded-xl border bg-white p-6 text-slate-700">
            এই category তে কোনো product পাওয়া যায়নি।
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ProductCard({ item }) {
  const { addToCart } = useCart();

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <Link
        href={`/product/${item.id}`}
        className="relative block h-[240px] w-full overflow-hidden bg-slate-100"
      >
        {item.discount ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#B07B5A] px-3 py-1 text-xs font-semibold text-white">
            {item.discount}
          </span>
        ) : null}

        <button
          type="button"
          onClick={(e) => e.preventDefault()}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 hover:bg-white"
          aria-label="Wishlist"
        >
          <Heart className="h-4 w-4 text-slate-800" />
        </button>

        <img src={item.img} alt={item.title} className="h-full w-full object-cover" />
      </Link>

      <div className="px-4 pb-4 pt-4">
        <h3 className="min-h-[44px] text-center text-[14px] font-semibold text-slate-900">
          {item.title}
        </h3>

        <div className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold">
          <span className="text-[#7B5E4D]">BDT {item.price}</span>
          <span className="text-slate-400 line-through">BDT {item.oldPrice}</span>
        </div>

        <div className="mt-4 space-y-3">
          <Link
            href={`/checkout?product=${item.id}`}
            className="flex h-10 w-full items-center justify-center rounded-md bg-[#785E4C] text-sm font-semibold text-white hover:opacity-95"
          >
            Buy Now
          </Link>

          <button
            type="button"
            onClick={() =>
              addToCart({
                id: item.id,
                title: item.title,
                price: item.price,
                oldPrice: item.oldPrice,
                discount: item.discount,
                img: item.img,
                qty: 1,
              })
            }
            className="flex h-10 w-full items-center justify-center rounded-md border border-[#785E4C] text-sm font-semibold text-[#785E4C] hover:bg-[#785E4C] hover:text-white"
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
}
