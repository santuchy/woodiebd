"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Heart, Minus, Plus, Phone, MessageCircle } from "lucide-react";
import { useCart } from "../../context/CartContext";

const toOffLabel = (text) => (text ? String(text).toUpperCase() : "");

export default function ProductDetailsPage() {
  const { addToCart } = useCart();

  const params = useParams();
  const id = params?.id; // this is product "path" (slug) from API

  const [apiProduct, setApiProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [qty, setQty] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // ✅ fetch from your proxy (store-id handled server-side)
        const res = await fetch("/api/products", { cache: "no-store" });
        if (!res.ok) {
          setApiProduct(null);
          return;
        }

        const json = await res.json();
        const arr = Array.isArray(json?.data?.data) ? json.data.data : [];

        // ✅ match by path (slug) first, fallback _id
        const found = arr.find((p) => p?.path === id || p?._id === id) || null;
        setApiProduct(found);
      } catch (e) {
        console.error("Product details fetch error:", e);
        setApiProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // ✅ normalize API product -> UI shape (keep design unchanged)
  const product = useMemo(() => {
    if (!apiProduct) return null;

    const img =
      Array.isArray(apiProduct?.imageURLs) && apiProduct.imageURLs.length > 0
        ? apiProduct.imageURLs[0]
        : "/product/11.jpg";

    const categoryName =
      Array.isArray(apiProduct?.category) && apiProduct.category.length > 0
        ? apiProduct.category[0]
        : "";

    const categoryPath =
      Array.isArray(apiProduct?.categoryPath) && apiProduct.categoryPath.length > 0
        ? apiProduct.categoryPath[0]
        : "";

    return {
      id: apiProduct?.path || apiProduct?._id, // used in checkout url/cart
      discount:
        typeof apiProduct?.discount === "number" || typeof apiProduct?.discount === "string"
          ? `${apiProduct.discount}% off`
          : "",
      title: apiProduct?.name || "Product",
      price: Number(apiProduct?.salePrice ?? 0),
      oldPrice: Number(apiProduct?.productPrice ?? 0),
      img,
      sku: apiProduct?.sku || "",
      categoryName,
      categoryLink: categoryPath ? `/category/${categoryPath}` : "#",
      status: apiProduct?.stock ? "In Stock" : "Out of Stock",
    };
  }, [apiProduct]);

  const dec = () => setQty((p) => (p > 1 ? p - 1 : 1));
  const inc = () => setQty((p) => p + 1);

  if (loading) {
    return (
      <section className="w-full bg-white py-10">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-7">
            <p className="text-slate-700">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="w-full bg-[#F3F6FF] py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Product not found</h1>
          <p className="mt-2 text-slate-600">
            এই id অনুযায়ী কোনো product পাওয়া যায়নি:{" "}
            <span className="font-semibold">{String(id)}</span>
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-md bg-[#785E4C] px-5 py-2 text-white"
          >
            Back to Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white py-10">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="flex flex-col items-stretch gap-10 md:flex-row">
          <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 md:w-1/2">
            <div className="h-[560px] w-full overflow-hidden rounded-xl bg-slate-100">
              <img
                src={product.img}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Right card */}
          <div className="w-full rounded-2xl border border-slate-200 bg-white p-7 md:w-1/2">
            <div className="flex h-[560px] flex-col">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{product.title}</h1>

                <div className="mt-6 space-y-3 text-[15px] text-slate-700">
                  <p>
                    <span className="font-semibold text-slate-900">SKU</span> : {product.sku}
                  </p>

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">Category:</p>
                      <Link
                        href={product.categoryLink}
                        className="mt-1 inline-flex items-center gap-2 font-semibold text-purple-600 hover:underline"
                      >
                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-sm border border-purple-600 text-[10px]">
                          ✓
                        </span>
                        {product.categoryName}
                      </Link>
                    </div>

                    <div className="items-center gap-3 pt-1">
                      <button className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 hover:bg-slate-200">
                        <Heart className="h-5 w-5 text-slate-700" />
                      </button>
                    </div>
                  </div>

                  <p>
                    <span className="font-semibold text-slate-900">Status</span> :{" "}
                    <span
                      className={`font-semibold ${
                        product.status === "In Stock" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {product.status}
                    </span>
                  </p>
                </div>

                {/* price row */}
                <div className="mt-7 flex flex-wrap items-center gap-5">
                  <div className="text-4xl font-extrabold text-orange-600">
                    TK {product.price}.00
                  </div>
                  <div className="text-slate-500 line-through">TK {product.oldPrice}.00</div>
                  {product.discount ? (
                    <span className="rounded-full bg-red-500 px-4 py-1 text-xs font-bold text-white">
                      {toOffLabel(product.discount)}
                    </span>
                  ) : null}
                </div>

                {/* qty*/}
                <div className="mt-7 flex items-center gap-4">
                  <span className="text-sm font-semibold tracking-wide text-slate-900">
                    QUANTITY :
                  </span>

                  <div className="flex items-center overflow-hidden rounded-md border border-slate-300">
                    <button
                      type="button"
                      onClick={dec}
                      className="flex h-10 w-12 items-center justify-center bg-white hover:bg-slate-100"
                    >
                      <Minus className="h-4 w-4 text-black" />
                    </button>

                    <div className="flex h-10 w-14 items-center justify-center bg-white text-black text-sm font-semibold">
                      {qty}
                    </div>

                    <button
                      type="button"
                      onClick={inc}
                      className="flex h-10 w-12 items-center justify-center bg-white hover:bg-slate-100"
                    >
                      <Plus className="h-4 w-4 text-black" />
                    </button>
                  </div>
                </div>

                <div className="mt-6 h-px w-full bg-slate-200" />
              </div>

              {/* bottom button */}
              <div className="mt-auto">
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Link
                    href={`/checkout?product=${product.id}&qty=${qty}`}
                    className="w-full justify-center rounded-md bg-[#785E4C] font-semibold text-white hover:opacity-95 inline-flex items-center"
                  >
                    Buy Now
                  </Link>

                  <button
                    type="button"
                    onClick={() => addToCart({ ...product, qty })}
                    className="h-12 rounded-lg bg-[#D09200] font-semibold text-white hover:opacity-95"
                  >
                    Add To Cart
                  </button>
                </div>

                <button className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#0B6156] font-semibold text-white hover:opacity-95">
                  <MessageCircle className="h-5 w-5" />
                  হোয়াটসঅ্যাপ অর্ডার
                </button>

                <button className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#0A77FF] font-semibold text-white hover:opacity-95">
                  <Phone className="h-5 w-5" />
                  কলে অর্ডার করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
