"use client";

import { useEffect, useState } from "react";

export default function Banner() {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    const loadBanner = async () => {
      try {
        const res = await fetch("/api/banner", { cache: "no-store" });
        if (!res.ok) return;

        const json = await res.json();
        const list = json?.data?.data;

        if (Array.isArray(list) && list.length > 0) {
          setBanner(list[0]);
        }
      } catch (err) {
        console.error("Banner fetch error:", err);
      }
    };

    loadBanner();
  }, []);

  return (
    <section className="w-full bg-[#F3F6FF] py-6">
      <div className="mx-auto max-w-7xl px-4">
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          {banner && (
            <img
              src={banner.image}
              alt={banner.title}
              className="h-auto w-full object-cover"
            />
          )}
        </div>
      </div>
    </section>
  );
}
