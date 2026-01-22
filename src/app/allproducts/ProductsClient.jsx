"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

// category text
function slugify(text) {
  return String(text || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function unique(arr) {
  return Array.from(new Set(arr));
}

// URL param format: categoryP=slug1,slug2
function parseCategoryP(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function ProductsClient({
  initialProducts = [],
  initialCategories = [],
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();


  const [products] = useState(initialProducts);
  const [categories] = useState(initialCategories);

  // loading false
  const loadingProducts = false;
  const loadingCats = false;

  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [appliedMin, setAppliedMin] = useState("");
  const [appliedMax, setAppliedMax] = useState("");

  const [selectedCats, setSelectedCats] = useState([]);
  const [sort, setSort] = useState("price-asc");

  const ALL_CATEGORIES = useMemo(() => {
    const productCats = new Set(products.map((p) => p.category).filter(Boolean));
    const filtered = categories.filter((c) => productCats.has(c));
    if (filtered.length > 0) return filtered;
    return Array.from(productCats);
  }, [categories, products]);

  // prevent URL <-> state infinite loop
  const isSyncingFromUrlRef = useRef(false);

  // URL -> selectedCats (refresh/back/forward)
  useEffect(() => {
    const qp = searchParams.get("categoryP") || "";
    const slugs = parseCategoryP(qp);

    isSyncingFromUrlRef.current = true;

    if (slugs.length === 0) {
      setSelectedCats([]);
      isSyncingFromUrlRef.current = false;
      return;
    }

    // map slug(s) back to actual category names from ALL_CATEGORIES
    const nextCats = ALL_CATEGORIES.filter((c) => slugs.includes(slugify(c)));
    setSelectedCats(unique(nextCats));

    isSyncingFromUrlRef.current = false;
  }, [searchParams, ALL_CATEGORIES]);

  // selectedCats -> URL (AFTER state change)
  useEffect(() => {
    if (isSyncingFromUrlRef.current) return;

    const params = new URLSearchParams(searchParams.toString());

    const slugs = unique(selectedCats).map(slugify).filter(Boolean);
    if (slugs.length === 0) params.delete("categoryP");
    else params.set("categoryP", slugs.join(","));

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCats]);

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

    // clear URL param
    const params = new URLSearchParams(searchParams.toString());
    params.delete("categoryP");
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : "?", { scroll: false });
  };

  const applyPrice = () => {
    setAppliedMin(min);
    setAppliedMax(max);
  };

  const filtered = useMemo(() => {
    let list = [...products];

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
  }, [products, selectedCats, appliedMin, appliedMax, sort]);

  // selectedCats valid if categories list changes
  useEffect(() => {
    if (selectedCats.length === 0) return;
    const setAll = new Set(ALL_CATEGORIES);
    const next = selectedCats.filter((c) => setAll.has(c));
    if (next.length !== selectedCats.length) setSelectedCats(next);
  }, [ALL_CATEGORIES, selectedCats]);

  const loading = loadingProducts || loadingCats;

  return (
    <section className="w-full bg-[#F3F6FF] py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          {/* left sidebar */}
          <aside className="space-y-6">
            {/* filter */}
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
                {!loadingCats &&
                  ALL_CATEGORIES.map((cat) => (
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
                Total {loading ? 0 : filtered.length} items found here
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
              {!loading &&
                filtered.map((item) => <ProductCard key={item.id} item={item} />)}
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
        {item.discount ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#7B5E4D] px-3 py-1 text-xs font-semibold text-white">
            {item.discount}
          </span>
        ) : null}

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
