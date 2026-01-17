"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

const ITEMS = [
  {
    id: "kitchen-decor",
    discount: "24% off",
    title: "Customized Wooden Kitchen Decor",
    price: 650,
    oldPrice: 850,
    img: "/product/11.jpg",
  },
  {
    id: "key-holder",
    discount: "14% off",
    title: "Customized Wooden Key Holder",
    price: 1200,
    oldPrice: 1400,
    img: "/product/12.jpg",
  },
  {
    id: "money-box",
    discount: "14% off",
    title: "Customized Wooden Money Saving Box",
    price: 1500,
    oldPrice: 1750,
    img: "/product/13.jpg",
  },
  {
    id: "chopping-board",
    discount: "14% off",
    title: "Customized Wooden Chopping Board",
    price: 1800,
    oldPrice: 2100,
    img: "/product/14.jpg",
  },
  {
    id: "photo-frame-1",
    discount: "13% off",
    title: "Customized Wooden Photo Frame",
    price: 1050,
    oldPrice: 1200,
    img: "/product/15.jpg",
  },
  {
    id: "photo-frame-2",
    discount: "21% off",
    title: "Customized Wooden Photo Frame",
    price: 950,
    oldPrice: 1200,
    img: "/product/16.jpg",
  },
  {
    id: "bookmark-1",
    discount: "25% off",
    title: "Customized Wooden Bookmark",
    price: 150,
    oldPrice: 200,
    img: "/product/17.jpg",
  },
  {
    id: "bookmark-2",
    discount: "25% off",
    title: "Customized Wooden Bookmark",
    price: 150,
    oldPrice: 200,
    img: "/product/18.jpg",
  },
  {
    id: "tray-1",
    discount: "15% off",
    title: "Customized Wooden Tea/Serving Tray",
    price: 850,
    oldPrice: 1000,
    img: "/product/19.jpg",
  },
  {
    id: "tray-2",
    discount: "18% off",
    title: "Customized Wooden Tea/Serving Tray",
    price: 820,
    oldPrice: 999,
    img: "/product/20.jpg",
  },
];

export default function NewArrivals() {
  return (
    <section className="w-full bg-[#F3F6FF] py-10">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-6 text-2xl font-semibold text-slate-900">
          New Arrivals
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {ITEMS.map((item) => (
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
