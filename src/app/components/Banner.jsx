// components/Banner.jsx
"use client";

export default function Banner() {
  return (
    <section className="w-full bg-[#F3F6FF] py-6">
      <div className="mx-auto max-w-7xl px-4">
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          {/* শুধু নিচের src টা তোমার banner image path দিয়ে replace করলেই হবে */}
          <img
            src="/Woodie banner (1).webp"
            alt="Woodie Banner"
            className="h-auto w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
