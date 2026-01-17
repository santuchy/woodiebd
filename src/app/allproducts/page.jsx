"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useCart } from "../context/CartContext";

const PRODUCTS = [
  {
    id: "kitchen-decor",
    discount: "24% off",
    title: "Customized Wooden Kitchen Decor",
    price: 650,
    oldPrice: 850,
    img: "/product/11.jpg",
    category: "Wooden Kitchen Decor",
  },
  {
    id: "key-holder",
    discount: "14% off",
    title: "Customized Wooden Key Holder",
    price: 1200,
    oldPrice: 1400,
    img: "/product/12.jpg",
    category: "Wooden Key Holder",
  },
  {
    id: "money-box",
    discount: "14% off",
    title: "Customized Wooden Money Saving Box",
    price: 1500,
    oldPrice: 1750,
    img: "/product/13.jpg",
    category: "Wooden Money Saving Box",
  },
  {
    id: "chopping-board",
    discount: "14% off",
    title: "Customized Wooden Chopping Board",
    price: 1800,
    oldPrice: 2100,
    img: "/product/14.jpg",
    category: "Wooden Chopping Board",
  },
  {
    id: "photo-frame-1",
    discount: "13% off",
    title: "Customized Wooden Photo Frame",
    price: 1050,
    oldPrice: 1200,
    img: "/product/15.jpg",
    category: "Wooden Photo Frame",
  },
  {
    id: "photo-frame-2",
    discount: "21% off",
    title: "Customized Wooden Photo Frame",
    price: 950,
    oldPrice: 1200,
    img: "/product/16.jpg",
    category: "Wooden Photo Frame",
  },
  {
    id: "bookmark-1",
    discount: "25% off",
    title: "Customized Wooden Bookmark",
    price: 150,
    oldPrice: 200,
    img: "/product/17.jpg",
    category: "Wooden Bookmark",
  },
  {
    id: "bookmark-2",
    discount: "25% off",
    title: "Customized Wooden Bookmark",
    price: 150,
    oldPrice: 200,
    img: "/product/18.jpg",
    category: "Wooden Bookmark",
  },
  {
    id: "tray-1",
    discount: "15% off",
    title: "Customized Wooden Tea/Serving Tray",
    price: 850,
    oldPrice: 1000,
    img: "/product/19.jpg",
    category: "Wooden Tea/Serving Tray",
  },
  {
    id: "tray-2",
    discount: "18% off",
    title: "Customized Wooden Tea/Serving Tray",
    price: 820,
    oldPrice: 999,
    img: "/product/20.jpg",
    category: "Wooden Tea/Serving Tray",
  },
];

const ALL_CATEGORIES = [
  "Wooden Tea/Serving Tray",
  "Wooden Bookmark",
  "Wooden Photo Frame",
  "Wooden Chopping Board",
  "Wooden Money Saving Box",
  "Wooden Key Holder",
  "Wooden Kitchen Decor",
];

export default function ProductsPage() {
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [appliedMin, setAppliedMin] = useState("");
  const [appliedMax, setAppliedMax] = useState("");

  const [selectedCats, setSelectedCats] = useState([]);
  const [sort, setSort] = useState("price-asc");

  const toggleCat = (cat) => {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const clearAll = () => {
    setMin("");
    setMax("");
    setAppliedMin("");
    setAppliedMax("");
    setSelectedCats([]);
    setSort("price-asc");
  };

  const applyPrice = () => {
    setAppliedMin(min);
    setAppliedMax(max);
  };

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];

    // category filter
    if (selectedCats.length > 0) {
      list = list.filter((p) => selectedCats.includes(p.category));
    }

    // price filter (applied)
    const minN = appliedMin === "" ? null : Number(appliedMin);
    const maxN = appliedMax === "" ? null : Number(appliedMax);

    if (minN !== null && !Number.isNaN(minN)) {
      list = list.filter((p) => p.price >= minN);
    }
    if (maxN !== null && !Number.isNaN(maxN)) {
      list = list.filter((p) => p.price <= maxN);
    }

    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);

    return list;
  }, [selectedCats, appliedMin, appliedMax, sort]);

  return (
    <section className="w-full bg-[#F3F6FF] py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          {/* left sidebar */}
          <aside className="space-y-6">
            {/* Filter */}
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <h3 className="text-[15px] font-semibold text-slate-900">
                Filter by Price
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <input
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                  placeholder="Min"
                  className="h-10 w-full rounded-md border border-slate-300 px-3 text-gray-500 text-sm outline-none focus:border-[#785E4C]"
                />
                <input
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                  placeholder="Max"
                  className="h-10 w-full rounded-md border border-slate-300 px-3 text-gray-500 text-sm outline-none focus:border-[#785E4C]"
                />
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={applyPrice}
                  className="h-10 flex-1 rounded-md bg-[#785E4C] text-sm font-semibold text-white hover:opacity-95"
                >
                  Apply
                </button>
                <button
                  onClick={clearAll}
                  className="h-10 flex-1 rounded-md bg-slate-400 text-sm font-semibold text-white hover:opacity-95"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <h3 className="text-[15px] font-semibold text-slate-900">
                Filter by Category
              </h3>

              <div className="mt-4 space-y-3">
                {ALL_CATEGORIES.map((cat) => (
                  <label
                    key={cat}
                    className="flex cursor-pointer items-center gap-3 text-sm text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCats.includes(cat)}
                      onChange={() => toggleCat(cat)}
                      className="h-4 w-4 accent-[#785E4C]"
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* right side content */}
          <div className="space-y-4">
            {/* top bar */}
            <div className="flex flex-col gap-3 rounded-lg border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-slate-700">
                Total {filtered.length} items found here
              </p>

              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="h-9 rounded-md border border-slate-200 bg-white px-3 text-gray-500 border-slate-300 text-sm outline-none focus:border-[#785E4C]"
                >
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* products grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ item }) {
  const { addToCart } = useCart();

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      {/* product pic */}
      <Link
        href={`/product/${item.id}`}
        className="relative block h-[240px] w-full overflow-hidden bg-slate-100"
      >
        <span className="absolute left-3 top-3 z-10 rounded-full bg-[#7B5E4D] px-3 py-1 text-xs font-semibold text-white">
          {item.discount}
        </span>

        <button
          type="button"
          onClick={(e) => e.preventDefault()}
          className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 hover:bg-white"
          aria-label="Wishlist"
        >
          <Heart className="h-4 w-4 text-slate-800" />
        </button>

        <img
          src={item.img}
          alt={item.title}
          className="h-full w-full object-cover"
        />
      </Link>

      {/* price info */}
      <div className="px-4 pb-4 pt-3">
        <h3 className="min-h-[42px] text-center text-[14px] font-semibold leading-snug text-slate-900">
          {item.title}
        </h3>

        <div className="mt-3 flex items-center justify-center gap-2 text-sm">
          <span className="font-semibold text-[#7B5E4D]">BDT {item.price}</span>
          <span className="text-slate-400 line-through">BDT {item.oldPrice}</span>
        </div>

        <div className="mt-4 space-y-2">
          <Link
            href={`/checkout?product=${item.id}`}
            className="w-full inline-flex justify-center rounded-md bg-[#785E4C] py-2 text-[12px] font-semibold text-white hover:opacity-95"
          >
            Buy Now
          </Link>

          <button
            type="button"
            onClick={() => addToCart(item)}
            className="w-full rounded-md border border-[#785E4C] py-2 text-[12px] font-semibold text-[#785E4C] hover:bg-[#785E4C] hover:text-white"
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
}
