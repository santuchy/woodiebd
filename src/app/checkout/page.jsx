"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useCart } from "../context/CartContext";

const AREAS = [
  { value: "inside_dhaka", label: "Inside Dhaka City (ঢাকা সিটির ভিতর)", fee: 100 },
  { value: "outside_dhaka", label: "Outside Dhaka City (সাভার, আশুলিয়া, কেরানীগঞ্জ)", fee: 130 },
  { value: "others", label: "Others (অন্যান্য জেলা)", fee: 150 },
];

export default function CheckoutPage() {
  const sp = useSearchParams();
  const productId = sp.get("product");
  const qtyFromUrl = sp.get("qty");

  const { items: cartItems, inc, dec, removeItem } = useCart();

  const [buyNowProduct, setBuyNowProduct] = useState(null);
  const [loadingBuyNow, setLoadingBuyNow] = useState(false);

  const isBuyNow = !!productId;

  // buy now qty
  const [buyQty, setBuyQty] = useState(1);
  useEffect(() => {
    if (isBuyNow) {
      const n = Number(qtyFromUrl || 1);
      setBuyQty(!Number.isNaN(n) && n > 0 ? n : 1);
    }
  }, [isBuyNow, qtyFromUrl]);

  useEffect(() => {
    const loadBuyNow = async () => {
      if (!productId) {
        setBuyNowProduct(null);
        return;
      }

      try {
        setLoadingBuyNow(true);

        const res = await fetch(`/api/product/path/${encodeURIComponent(productId)}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          setBuyNowProduct(null);
          return;
        }

        const json = await res.json();
        const p = json?.data || null;

        if (!p) {
          setBuyNowProduct(null);
          return;
        }

        const img =
          Array.isArray(p?.imageURLs) && p.imageURLs.length > 0
            ? p.imageURLs[0]
            : "/product/11.jpg";

        const normalized = {
          id: String(p?.path || p?._id || productId),
          title: p?.name || "Product",
          price: Number(p?.salePrice ?? 0),
          oldPrice: Number(p?.productPrice ?? 0),
          img,
        };

        setBuyNowProduct(normalized);
      } catch (e) {
        console.error("Buy now product fetch error:", e);
        setBuyNowProduct(null);
      } finally {
        setLoadingBuyNow(false);
      }
    };

    loadBuyNow();
  }, [productId]);

  const [area, setArea] = useState(AREAS[0].value);

  const selectedArea = useMemo(() => AREAS.find((a) => a.value === area), [area]);

  // list for UI
  const checkoutItems = useMemo(() => {
    if (isBuyNow) {
      if (!buyNowProduct) return [];
      return [
        {
          id: buyNowProduct.id,
          title: buyNowProduct.title,
          img: buyNowProduct.img,
          price: buyNowProduct.price,
          oldPrice: buyNowProduct.oldPrice,
          qty: buyQty,
          mode: "buynow",
        },
      ];
    }

    // cart items
    return cartItems.map((it) => ({
      ...it,
      img: it?.img || "/product/11.jpg",
      oldPrice: typeof it?.oldPrice === "number" ? it.oldPrice : it.price,
      mode: "cart",
    }));
  }, [isBuyNow, buyNowProduct, buyQty, cartItems]);

  const subtotal = useMemo(() => {
    return checkoutItems.reduce((sum, it) => sum + Number(it.price || 0) * Number(it.qty || 0), 0);
  }, [checkoutItems]);

  const deliveryFee = selectedArea?.fee || 0;
  const total = subtotal + deliveryFee;

  // qty handlers
  const decLocal = () => setBuyQty((p) => (p > 1 ? p - 1 : 1));
  const incLocal = () => setBuyQty((p) => p + 1);

  return (
    <section className="w-full bg-white py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* left side entry field */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-300 bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-900">Shipping Address</h2>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Your Name</label>
                  <input
                    type="text"
                    placeholder="Enter Your Name"
                    className="h-11 w-full rounded-md border border-gray-300 px-3 text-gray-800 text-sm outline-none focus:border-[#785E4C]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    placeholder="Mobile Number"
                    className="h-11 w-full rounded-md border border-gray-300 px-3 text-gray-800 text-sm outline-none focus:border-[#785E4C]"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Select your area
                </label>

                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="h-11 w-full rounded-md border border-gray-300 text-gray-800 bg-white px-3 text-sm outline-none focus:border-[#785E4C]"
                >
                  {AREAS.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label} - Delivery Charge ৳{a.fee}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Your Address
                </label>
                <input
                  type="text"
                  placeholder="Enter your full address (Road, Area, District, Postal Code)"
                  className="h-11 w-full rounded-md border border-gray-300 px-3 text-gray-800 text-sm outline-none focus:border-[#785E4C]"
                />
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Your Note (Optional)
                </label>
                <textarea
                  placeholder="Note..."
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-3 py-3 text-gray-800 text-sm outline-none focus:border-[#785E4C]"
                />
              </div>

              <div className="mt-6">
                <p className="mb-3 text-sm font-semibold text-slate-900">Payment Info :</p>
                <div className="rounded-md bg-slate-50 p-4">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <input type="radio" name="pay" defaultChecked />
                    CASH ON DELIVERY(COD)
                  </label>
                  <label className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <input type="radio" name="pay" />
                    PAYMENT METHOD
                  </label>
                </div>
              </div>

              <button className="mt-6 h-12 w-full rounded-md bg-[#785E4C] text-sm font-bold text-white hover:opacity-95">
                CONFIRM ORDER
              </button>
            </div>
          </div>

          {/* right side checkout card */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-gray-300 bg-white p-6">
              <h3 className="text-sm font-bold text-slate-900">Product List</h3>

              {isBuyNow && loadingBuyNow ? (
                <div className="mt-4 rounded-md border border-gray-300 p-3 text-center text-sm text-slate-500">
                  Loading...
                </div>
              ) : checkoutItems.length === 0 ? (
                <div className="mt-4 rounded-md border border-gray-300 p-3 text-center text-sm text-slate-500">
                  Cart is empty
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {checkoutItems.map((p) => (
                    <div key={p.id} className="rounded-md border border-gray-300 p-3">
                      <div className="flex items-start gap-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-md bg-gray-300">
                          <Image src={p.img} alt={p.title} fill className="object-cover" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-xs text-slate-400 line-through">৳{p.oldPrice}</p>
                              <p className="text-sm font-bold text-[#785E4C]">৳{p.price}</p>
                            </div>

                            <div className="text-xs font-semibold text-slate-900">{p.title}</div>
                          </div>

                          <div className="mt-2 inline-flex items-center overflow-hidden rounded-md border border-slate-200">
                            <button
                              type="button"
                              onClick={() => (p.mode === "buynow" ? decLocal() : dec(p.id))}
                              className="h-8 w-8 bg-white hover:bg-gray-400"
                            >
                              −
                            </button>
                            <span className="flex h-8 w-10 items-center justify-center text-gray-800 text-sm font-semibold">
                              {p.mode === "buynow" ? buyQty : p.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => (p.mode === "buynow" ? incLocal() : inc(p.id))}
                              className="h-8 w-8 bg-white hover:bg-gray-400"
                            >
                              +
                            </button>
                          </div>

                          {p.mode === "cart" && (
                            <button
                              type="button"
                              onClick={() => removeItem(p.id)}
                              className="mt-2 text-xs font-semibold text-red-500 hover:underline"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <h3 className="text-sm font-bold text-slate-900">Order Summary</h3>
                <div className="mt-3 w-full bg-slate-200" />

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between text-slate-700">
                    <span>Subtotal</span>
                    <span>৳ {subtotal}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span>Delivery Fee</span>
                    <span>৳ {deliveryFee}</span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>Total</span>
                    <span className="text-green-600">৳ {total}</span>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    className="h-11 flex-1 rounded-md border border-gray-300 text-gray-300 px-3 text-sm outline-none focus:border-[#785E4C]"
                  />
                  <button className="h-11 rounded-md bg-[#785E4C] px-5 text-sm font-semibold text-white hover:opacity-95">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* end */}
        </div>
      </div>
    </section>
  );
}
