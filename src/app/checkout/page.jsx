"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useCart } from "../context/CartContext";

const PRODUCTS = [
  { id: "kitchen-decor", title: "Customized Wooden Kitchen Decor", price: 650, oldPrice: 850, img: "/product/11.jpg" },
  { id: "key-holder", title: "Customized Wooden Key Holder", price: 1200, oldPrice: 1400, img: "/product/12.jpg" },
  { id: "money-box", title: "Customized Wooden Money Saving Box", price: 1500, oldPrice: 1750, img: "/product/13.jpg" },
  { id: "chopping-board", title: "Customized Wooden Chopping Board", price: 1800, oldPrice: 2100, img: "/product/14.jpg" },
  { id: "photo-frame-1", title: "Customized Wooden Photo Frame", price: 1050, oldPrice: 1200, img: "/product/15.jpg" },
  { id: "photo-frame-2", title: "Customized Wooden Photo Frame", price: 950, oldPrice: 1200, img: "/product/16.jpg" },
  { id: "bookmark-1", title: "Customized Wooden Bookmark", price: 150, oldPrice: 200, img: "/product/17.jpg" },
  { id: "bookmark-2", title: "Customized Wooden Bookmark", price: 150, oldPrice: 200, img: "/product/18.jpg" },
  { id: "tray-1", title: "Customized Wooden Tea/Serving Tray", price: 850, oldPrice: 1000, img: "/product/19.jpg" },
  { id: "tray-2", title: "Customized Wooden Tea/Serving Tray", price: 820, oldPrice: 999, img: "/product/20.jpg" },
];

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

  const buyNowProduct = useMemo(() => {
    if (!productId) return null;
    return PRODUCTS.find((p) => p.id === productId) || null;
  }, [productId]);

  const isBuyNow = !!buyNowProduct;

  // buy now qty
  const [buyQty, setBuyQty] = useState(1);
  useEffect(() => {
    if (isBuyNow) {
      const n = Number(qtyFromUrl || 1);
      setBuyQty(!Number.isNaN(n) && n > 0 ? n : 1);
    }
  }, [isBuyNow, qtyFromUrl]);

  const [area, setArea] = useState(AREAS[0].value);

  const selectedArea = useMemo(() => AREAS.find((a) => a.value === area), [area]);

  // list for UI
  const checkoutItems = useMemo(() => {
    if (isBuyNow) {
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
    return cartItems.map((it) => ({ ...it, mode: "cart" }));
  }, [isBuyNow, buyNowProduct, buyQty, cartItems]);

  const subtotal = useMemo(() => {
    return checkoutItems.reduce((sum, it) => sum + it.price * it.qty, 0);
  }, [checkoutItems]);

  const deliveryFee = selectedArea?.fee || 0;
  const total = subtotal + deliveryFee;

  // qty handlers (buy now / cart both)
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
                  <label className="mb-2 block text-sm font-medium text-slate-700">Mobile Number</label>
                  <input
                    type="text"
                    placeholder="Mobile Number"
                    className="h-11 w-full rounded-md border border-gray-300 px-3 text-gray-800 text-sm outline-none focus:border-[#785E4C]"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-slate-700">Select your area</label>

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
                <label className="mb-2 block text-sm font-medium text-slate-700">Your Address</label>
                <input
                  type="text"
                  placeholder="Enter your full address (Road, Area, District, Postal Code)"
                  className="h-11 w-full rounded-md border border-gray-300 px-3 text-gray-800 text-sm outline-none focus:border-[#785E4C]"
                />
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-slate-700">Your Note (Optional)</label>
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

              {checkoutItems.length === 0 ? (
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
        </div>
      </div>
    </section>
  );
}
