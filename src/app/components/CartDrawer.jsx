"use client";

import { X, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const router = useRouter();
  const { isOpen, closeCart, items, inc, dec, removeItem, subtotal } = useCart();

  const goCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <>
      {/* backdrop */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* drawer */}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-[360px] max-w-[90vw] bg-white shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* header */}
        <div className="flex items-center justify-between bg-[#785E4C] px-4 py-4 text-white">
          <h3 className="text-base font-semibold">Shopping Cart</h3>
          <button
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* body */}
        <div className="h-[calc(100%-140px)] overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="mt-10 text-center text-sm text-slate-500">
              Cart is empty
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="rounded-lg border border-slate-200 bg-white p-3"
                >
                  <div className="flex gap-3">
                    <div className="h-14 w-14 overflow-hidden rounded-md bg-slate-100">
                      <img
                        src={it.img}
                        alt={it.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {it.title}
                      </p>

                      <div className="mt-1 flex items-center gap-2 text-xs">
                        <span className="text-slate-400 line-through">
                          ৳{it.oldPrice}
                        </span>
                        <span className="font-bold text-slate-900">
                          ৳{it.price}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="inline-flex items-center overflow-hidden rounded-md border border-slate-200">
                          <button
                            onClick={() => dec(it.id)}
                            className="h-8 w-8 bg-white hover:bg-slate-100"
                          >
                            −
                          </button>
                          <span className="flex h-8 w-10 items-center justify-center text-sm font-semibold text-slate-900">
                            {it.qty}
                          </span>
                          <button
                            onClick={() => inc(it.id)}
                            className="h-8 w-8 bg-white hover:bg-slate-100"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(it.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 hover:bg-slate-200"
                          aria-label="Remove"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* footer */}
        <div className="absolute bottom-0 left-0 w-full border-t bg-white p-4">
          <div className="flex items-center gap-3 rounded-lg bg-[#785E4C] p-3">
            <button
              type="button"
              onClick={goCheckout}
              className="flex-1 text-center text-sm font-semibold text-white"
            >
              Proceed To Checkout
            </button>

            <div className="rounded-md bg-white px-3 py-2 text-sm font-bold text-slate-900">
              ৳ {subtotal}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
