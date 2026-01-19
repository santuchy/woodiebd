"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function NewArrivals() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadAllProducts = async () => {
      try {
        // 1) first page (for meta)
        const firstRes = await fetch("/api/products?page=1&limit=100", {
          cache: "no-store",
        });

        if (!firstRes.ok) {
          setItems([]);
          return;
        }

        const firstJson = await firstRes.json();
        const firstArr = Array.isArray(firstJson?.data?.data)
          ? firstJson.data.data
          : [];

        const meta = firstJson?.data?.meta || {};
        const total = Number(meta?.total ?? firstArr.length);
        const limit = Number(meta?.limit ?? 10);
        const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;

        let all = [...firstArr];

        // 2) remaining pages
        if (totalPages > 1) {
          const promises = [];
          for (let p = 2; p <= totalPages; p++) {
            promises.push(
              fetch(`/api/products?page=${p}&limit=${limit}`, {
                cache: "no-store",
              })
                .then((r) => (r.ok ? r.json() : null))
                .catch(() => null)
            );
          }

          const results = await Promise.all(promises);
          results.forEach((j) => {
            const arr = Array.isArray(j?.data?.data) ? j.data.data : [];
            all.push(...arr);
          });
        }

        // ✅ map to UI shape (no design change)
        const normalized = all.map((p) => {
          const id = p?.path || p?._id;

          const img =
            Array.isArray(p?.imageURLs) && p.imageURLs.length > 0
              ? p.imageURLs[0]
              : "/product/11.jpg";

          return {
            id: String(id),
            discount: p?.discount ? `${p.discount}% off` : "",
            title: p?.name || "Product",
            price: Number(p?.salePrice ?? 0),
            oldPrice: Number(p?.productPrice ?? 0),
            img,
          };
        });

        setItems(normalized);
      } catch (e) {
        console.error("NewArrivals products fetch error:", e);
        setItems([]);
      }
    };

    loadAllProducts();
  }, []);

  return (
    <section className="w-full bg-[#F3F6FF] py-10">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-6 text-2xl font-semibold text-slate-900">
          New Arrivals
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ item }) {
  const router = useRouter();
  const { addToCart } = useCart();

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <Link
        href={`/product/${item.id}`}
        className="relative block h-[230px] w-full overflow-hidden"
      >
        <span className="absolute left-3 top-3 z-10 rounded-full bg-[#7B5E4D] px-3 py-1 text-xs font-semibold text-white">
          {item.discount}
        </span>

        <button
          onClick={(e) => e.preventDefault()}
          className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white"
        >
          <Heart className="h-4 w-4" />
        </button>

        <img src={item.img} className="h-full w-full object-cover" />
      </Link>

      {/* Content */}
      <div className="px-4 pb-4 pt-3">
        <h3 className="min-h-[42px] text-center text-gray-900 text-sm font-semibold">
          {item.title}
        </h3>

        <div className="mt-2 flex justify-center gap-2 text-sm">
          <span className="font-semibold text-[#7B5E4D]">BDT {item.price}</span>
          <span className="line-through text-slate-400">
            BDT {item.oldPrice}
          </span>
        </div>

        {/* Buttons */}
        <div className="mt-4 space-y-2">
          <Link
            href={`/checkout?product=${item.id}`}
            className="w-full inline-flex justify-center rounded-md bg-[#785E4C] py-2 text-[12px] font-semibold text-white hover:opacity-95"
          >
            Buy Now
          </Link>

          <button
            onClick={() => addToCart(item)}
            className="w-full rounded-md border border-[#785E4C] py-2 text-xs font-semibold text-[#785E4C] hover:bg-[#785e4c] hover:text-white"
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
}
