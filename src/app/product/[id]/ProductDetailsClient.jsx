"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Heart, Minus, Plus, Phone, MessageCircle } from "lucide-react";
import { useCart } from "../../context/CartContext";
import ReactImageMagnifier from "simple-image-magnifier/react";

const toOffLabel = (text) => (text ? String(text).toUpperCase() : "");

function normalizeAttributes(attributesObj) {
  if (!attributesObj || typeof attributesObj !== "object") return [];
  return Object.entries(attributesObj)
    .map(([name, values]) => ({
      name,
      values: Array.isArray(values) ? values : [],
    }))
    .filter((x) => x.name && x.values.length > 0);
}

function getRequiredAttrNames(attributesObj) {
  if (!attributesObj || typeof attributesObj !== "object") return [];
  return Object.keys(attributesObj).filter(Boolean);
}

function findMatchingVariant(variants, requiredNames, selectedAttrs) {
  if (!Array.isArray(variants) || variants.length === 0) return null;

  // must select all required attributes
  for (const n of requiredNames) {
    if (!selectedAttrs?.[n]) return null;
  }

  return (
    variants.find((v) => {
      const vAttrs = v?.attributes || {};
      return requiredNames.every(
        (n) => String(vAttrs?.[n] || "") === String(selectedAttrs?.[n] || "")
      );
    }) || null
  );
}

function buildDefaultSelectedAttrs(apiProduct) {
  const required = getRequiredAttrNames(apiProduct?.attributes);
  const firstVar = Array.isArray(apiProduct?.variant) ? apiProduct.variant[0] : null;
  const vAttrs =
    firstVar?.attributes && typeof firstVar.attributes === "object"
      ? firstVar.attributes
      : {};

  const next = {};
  required.forEach((k) => {
    if (vAttrs?.[k]) next[k] = vAttrs[k];
  });
  return next;
}

export default function ProductDetailsClient({ apiProduct }) {
  const { addToCart } = useCart();

  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");

  const requiredAttrNames = useMemo(
    () => getRequiredAttrNames(apiProduct?.attributes),
    [apiProduct]
  );

  // ✅ safe initial selection
  const [selectedAttrs, setSelectedAttrs] = useState(() =>
    buildDefaultSelectedAttrs(apiProduct)
  );

  // ✅ if user opens another product page, reset default attrs for that product
  useEffect(() => {
    setSelectedAttrs(buildDefaultSelectedAttrs(apiProduct));
  }, [apiProduct]);

  const product = useMemo(() => {
    if (!apiProduct) return null;

    const images =
      Array.isArray(apiProduct?.imageURLs) && apiProduct.imageURLs.length > 0
        ? apiProduct.imageURLs
        : ["/product/11.jpg"];

    const categoryName =
      Array.isArray(apiProduct?.category) && apiProduct.category.length > 0
        ? apiProduct.category[0]
        : "";

    const categoryPath =
      Array.isArray(apiProduct?.categoryPath) && apiProduct.categoryPath.length > 0
        ? apiProduct.categoryPath[0]
        : "";

    return {
      id: apiProduct?.path || apiProduct?._id,
      title: apiProduct?.name || "Product",
      sku: apiProduct?.sku || "",

      // base (fallback)
      basePrice: Number(apiProduct?.salePrice ?? 0),
      baseOldPrice: Number(apiProduct?.productPrice ?? 0),
      baseDiscount:
        typeof apiProduct?.discount === "number" || typeof apiProduct?.discount === "string"
          ? `${apiProduct.discount}% OFF`
          : "",

      status: apiProduct?.stock ? "In Stock" : "Out of Stock",
      categoryName,
      categoryLink: categoryPath ? `/category/${categoryPath}` : "#",

      descriptionHtml: apiProduct?.description || "",
      reviewCount: Array.isArray(apiProduct?.review) ? apiProduct.review.length : 0,
      youtube: apiProduct?.youtube || "",

      images,
      attributes: normalizeAttributes(apiProduct?.attributes),
      variants: Array.isArray(apiProduct?.variant) ? apiProduct.variant : [],
    };
  }, [apiProduct]);

  // ✅ prevent crash
  const safeProduct = product || {
    id: "",
    title: "",
    sku: "",
    basePrice: 0,
    baseOldPrice: 0,
    baseDiscount: "",
    status: "",
    categoryName: "",
    categoryLink: "#",
    descriptionHtml: "",
    reviewCount: 0,
    youtube: "",
    images: ["/product/11.jpg"],
    attributes: [],
    variants: [],
  };

  const [imgActive, setImgActive] = useState(0);

  // keep imgActive valid if images count changes
  useEffect(() => {
    setImgActive((p) => {
      const max = (safeProduct.images?.length || 1) - 1;
      if (p < 0) return 0;
      if (p > max) return 0;
      return p;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeProduct.images?.length]);

  const dec = () => setQty((p) => (p > 1 ? p - 1 : 1));
  const inc = () => setQty((p) => p + 1);

  const setAttr = (name, value) => {
    setSelectedAttrs((p) => ({ ...p, [name]: value }));
  };

  // ✅ active variant (safe)
  const activeVariant = useMemo(() => {
    return findMatchingVariant(
      safeProduct.variants,
      requiredAttrNames,
      selectedAttrs
    );
  }, [safeProduct.variants, requiredAttrNames, selectedAttrs]);

  // ✅ dynamic price from variant
  const displayPrice = activeVariant
    ? Number(activeVariant.salePrice ?? safeProduct.basePrice)
    : safeProduct.basePrice;

  const displayOldPrice = activeVariant
    ? Number(activeVariant.productPrice ?? safeProduct.baseOldPrice)
    : safeProduct.baseOldPrice;

  const displayDiscount =
    activeVariant && activeVariant.discount !== undefined && activeVariant.discount !== null
      ? `${activeVariant.discount}% OFF`
      : safeProduct.baseDiscount;

  const addToCartWithAttrs = () => {
    addToCart({
      ...safeProduct,
      price: displayPrice,
      oldPrice: displayOldPrice,
      discount: displayDiscount,
      qty,
      selectedAttributes: selectedAttrs,
      variantId: activeVariant?._id || null,
    });
  };

  const CARD_H = 640;
  const IMG_W = 520;
  const IMG_H = 520;

  return (
    <section className="w-full bg-white py-10">
      <div className="mx-auto w-full max-w-6xl px-4">
        {/* top section */}
        <div className="flex flex-col items-stretch gap-10 md:flex-row">
          {/* LEFT CARD */}
          <div
            className="w-full rounded-2xl border border-slate-200 bg-white p-6 md:w-1/2"
            style={{ height: CARD_H }}
          >
            <div className="flex h-full flex-col">
              {/* image area */}
              <div className="flex flex-1 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                <ReactImageMagnifier
                  srcPreview={safeProduct.images[imgActive]}
                  srcOriginal={safeProduct.images[imgActive]}
                  width={IMG_W}
                  height={IMG_H}
                  objectFit="cover"
                  className="bg-slate-100 rounded-xl"
                />
              </div>

              {/* thumbnail below */}
              <div className="mt-4 flex gap-3">
                {safeProduct.images.slice(0, 6).map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setImgActive(i)}
                    className={`h-16 w-16 overflow-hidden rounded-md border bg-white ${
                      imgActive === i ? "border-red-500" : "border-slate-200"
                    }`}
                    aria-label={`Preview ${i + 1}`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div
            className="w-full rounded-2xl border border-slate-200 bg-white p-7 md:w-1/2 overflow-hidden"
            style={{ height: CARD_H }}
          >
            <div className="flex h-full flex-col">
              {/* this part can scroll if content grows */}
              <div className="min-h-0 flex-1 overflow-auto pr-1">
                <h1 className="text-3xl font-bold text-slate-900">
                  {safeProduct.title}
                </h1>

                <div className="mt-6 space-y-3 text-[15px] text-slate-700">
                  <p>
                    <span className="font-semibold text-slate-900">SKU</span> :{" "}
                    {safeProduct.sku}
                  </p>

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">Category:</p>
                      <Link
                        href={safeProduct.categoryLink}
                        className="mt-1 inline-flex items-center gap-2 font-semibold text-purple-600 hover:underline"
                      >
                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-sm border border-purple-600 text-[10px]">
                          ✓
                        </span>
                        {safeProduct.categoryName}
                      </Link>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <button className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 hover:bg-slate-200">
                        <Heart className="h-5 w-5 text-slate-700" />
                      </button>
                    </div>
                  </div>

                  <p>
                    <span className="font-semibold text-slate-900">Status</span>{" "}
                    :{" "}
                    <span
                      className={`font-semibold ${
                        safeProduct.status === "In Stock"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {safeProduct.status}
                    </span>
                  </p>
                </div>

                {/* price row */}
                <div className="mt-7 flex flex-wrap items-center gap-5">
                  <div className="text-4xl font-extrabold text-orange-600">
                    TK {displayPrice}.00
                  </div>

                  <div className="text-slate-500 line-through">
                    TK {displayOldPrice}.00
                  </div>

                  {displayDiscount ? (
                    <span className="rounded-full bg-red-500 px-4 py-1 text-xs font-bold text-white">
                      {toOffLabel(displayDiscount)}
                    </span>
                  ) : null}
                </div>

                {/* attributes */}
                {safeProduct.attributes.length > 0 ? (
                  <div className="mt-6 space-y-5">
                    {safeProduct.attributes.map((attr) => (
                      <div key={attr.name}>
                        <p className="text-sm font-semibold text-slate-900">
                          {attr.name} :
                        </p>

                        <div className="mt-2 flex flex-wrap gap-3">
                          {attr.values.map((val) => {
                            const active = selectedAttrs[attr.name] === val;
                            return (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setAttr(attr.name, val)}
                                className={`rounded-md border px-4 py-2 text-sm font-semibold transition ${
                                  active
                                    ? "border-red-500 text-red-500"
                                    : "border-slate-300 text-slate-700 hover:border-slate-400"
                                }`}
                              >
                                {val}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {/* qty */}
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

              {/* bottom buttons */}
              <div className="pt-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Link
                    href={`/checkout?product=${safeProduct.id}&qty=${qty}`}
                    className="w-full justify-center rounded-md bg-[#785E4C] font-semibold text-white hover:opacity-95 inline-flex h-12 items-center"
                  >
                    Buy Now
                  </Link>

                  <button
                    type="button"
                    onClick={addToCartWithAttrs}
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

        {/* below section */}
        <div className="mt-12 rounded-2xl border text-gray-800 bg-white p-6">
          {/* tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setTab("description")}
              className={`rounded-full px-5 py-2 text-sm font-semibold ${
                tab === "description"
                  ? "bg-[#785E4C] text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Description
            </button>

            <button
              type="button"
              onClick={() => setTab("review")}
              className={`rounded-full px-5 py-2 text-sm font-semibold ${
                tab === "review"
                  ? "bg-[#785E4C] text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Review ({safeProduct.reviewCount})
            </button>

            <button
              type="button"
              onClick={() => setTab("video")}
              className={`rounded-full px-5 py-2 text-sm font-semibold ${
                tab === "video"
                  ? "bg-[#785E4C] text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Video
            </button>
          </div>

          <div className="mt-6">
            {tab === "description" ? (
              <div
                className="prose max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-1"
                dangerouslySetInnerHTML={{
                  __html: safeProduct.descriptionHtml || "<p>No description found.</p>",
                }}
              />
            ) : null}

            {tab === "review" ? (
              <div className="text-slate-700">
                {safeProduct.reviewCount > 0 ? (
                  <p>Reviews loaded from API (you can render them here).</p>
                ) : (
                  <p>No reviews yet.</p>
                )}
              </div>
            ) : null}

            {tab === "video" ? (
              <div className="text-slate-700">
                {safeProduct.youtube ? (
                  <div className="aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
                    <iframe
                      className="h-full w-full"
                      src={safeProduct.youtube}
                      title="Product Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <p>No video available.</p>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
