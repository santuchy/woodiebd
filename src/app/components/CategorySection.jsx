"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  { title: "Wooden Door Plate", img: "/cat1.jpg" },
  { title: "Wooden Ludo Board", img: "/cat2.jpg" },
  { title: "Wooden Mirror", img: "/cat3.jpg" },
  { title: "Wooden Tea/Serving Tray", img: "/cat4.jpg" },
  { title: "Wooden Bookmark", img: "/cat5.jpg" },
  { title: "Wooden Photo Frame", img: "/cat6.jpg" },
  { title: "Wooden Chopping Board", img: "/cat7.jpg" },
];

export default function CategorySection() {
  return (
    <section className="w-full bg-[#F3F6FF] py-10">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">Category</h2>
        </div>

        {/* Category */}
        <div className="relative flex items-center gap-4">
          {/* Left Arrow */}
          <button className="absolute -left-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow">
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </button>

          {/* Cards */}
          <div className="flex w-full gap-5 overflow-hidden px-6">
            {categories.map((cat, index) => (
              <div
                key={index}
                className="min-w-[160px] rounded-lg bg-white p-4 text-center shadow-sm"
              >
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-md">
                  <img
                    src={cat.img}
                    alt={cat.title}
                    className="h-full w-full object-contain"
                  />
                </div>
                <p className="text-sm text-black font-bold">{cat.title}</p>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button className="absolute -right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow">
            <ChevronRight className="h-5 w-5 text-slate-600" />
          </button>
        </div>
      </div>
    </section>
  );
}
