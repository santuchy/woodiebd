"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  User,
  ChevronDown,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Music2,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { openCart, count } = useCart();
  const [openCat, setOpenCat] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="w-full bg-[#785E4C]">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:h-[70px] md:py-0">
          {/* Logo */}
          <Link href="" className="flex items-center">
            <div className="flex items-center gap-2">
              <img className="h-12 w-auto md:h-15 md:w-30" src="/WOODIE (1).webp" alt="" />
            </div>
          </Link>

          {/* Search (Desktop) */}
          <div className="hidden flex-1 items-center justify-center md:flex">
            <div className="relative w-full max-w-4xl">
              <input
                type="text"
                placeholder="Search Product"
                className="h-[40px] w-full rounded-md border border-white/40 bg-white px-4 pr-12 text-[14px] text-slate-700 outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 hover:bg-slate-100"
                aria-label="Search"
              >
                <Search className="h-5 w-5 text-slate-700" />
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="ml-auto flex items-center gap-2 md:gap-4">
            {/* Cart */}
            <button
              onClick={openCart}
              className="relative flex h-10 w-10 items-center justify-center"
              aria-label="Cart"
            >
              <ShoppingBag className="h-6 w-6 text-white" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                  {count}
                </span>
              )}
            </button>

            {/* User icon*/}
            <button className="rounded-md p-2 hover:bg-white/10" aria-label="Account">
              <User className="h-6 w-6 text-white" />
            </button>

            {/* Login Button (Desktop only) */}
            <Link
              href="/"
              className="hidden rounded-md border border-white px-4 py-2 text-[14px] font-semibold text-white hover:bg-white hover:text-[#785E4C] md:inline-flex"
            >
              Login
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenu((p) => !p)}
              className="inline-flex items-center justify-center rounded-md p-2 hover:bg-white/10 md:hidden"
              aria-label="Menu"
            >
              {mobileMenu ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
            </button>
          </div>
        </div>

        {/* Search (Mobile) */}
        <div className="px-4 pb-3 md:hidden">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search Product"
              className="h-[40px] w-full rounded-md border border-white/40 bg-white px-4 pr-12 text-[14px] text-slate-700 outline-none placeholder:text-slate-400"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 hover:bg-slate-100"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-slate-700" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {mobileMenu ? (
          <div className="border-t border-white/15 bg-[#785E4C] md:hidden">
            <div className="mx-auto max-w-7xl px-4 py-4">
              <div className="flex flex-col gap-3 text-[14px] text-white">
                <div className="rounded-md bg-white/10">
                  <button
                    type="button"
                    onClick={() => setOpenCat((p) => !p)}
                    className="flex w-full items-center justify-between px-4 py-3"
                  >
                    <span>Categories</span>
                    <ChevronDown className={`h-4 w-4 transition ${openCat ? "rotate-180" : ""}`} />
                  </button>
                </div>

                <Link
                  href="/"
                  className="rounded-md bg-white/10 px-4 py-3 hover:bg-white/15"
                  onClick={() => setMobileMenu(false)}
                >
                  Home
                </Link>
                <Link
                  href="/allproducts"
                  className="rounded-md bg-white/10 px-4 py-3 hover:bg-white/15"
                  onClick={() => setMobileMenu(false)}
                >
                  All Product
                </Link>
                <Link
                  href="/"
                  className="rounded-md bg-white/10 px-4 py-3 hover:bg-white/15"
                  onClick={() => setMobileMenu(false)}
                >
                  Offer
                </Link>
                <Link
                  href="/"
                  className="rounded-md bg-white/10 px-4 py-3 hover:bg-white/15"
                  onClick={() => setMobileMenu(false)}
                >
                  About
                </Link>
                <Link
                  href="/"
                  className="rounded-md bg-white/10 px-4 py-3 hover:bg-white/15"
                  onClick={() => setMobileMenu(false)}
                >
                  Contact
                </Link>
                <Link
                  href="/"
                  className="rounded-md bg-white/10 px-4 py-3 hover:bg-white/15"
                  onClick={() => setMobileMenu(false)}
                >
                  Free Delivery
                </Link>

                {/* Login (Mobile) */}
                <Link
                  href="/"
                  className="mt-1 inline-flex items-center justify-center rounded-md border border-white px-4 py-3 text-[14px] font-semibold text-white hover:bg-white hover:text-[#785E4C]"
                  onClick={() => setMobileMenu(false)}
                >
                  Login
                </Link>

                {/* Social icons (Mobile) */}
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <SocialIcon href="#" aria="Facebook" bg="bg-[#1877F2]">
                    <Facebook className="h-4 w-4 text-white" />
                  </SocialIcon>

                  <SocialIcon
                    href="#"
                    aria="Instagram"
                    bg="bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#515BD4]"
                  >
                    <Instagram className="h-4 w-4 text-white" />
                  </SocialIcon>

                  <SocialIcon href="#" aria="YouTube" bg="bg-[#FF0000]">
                    <Youtube className="h-4 w-4 text-white" />
                  </SocialIcon>

                  <SocialIcon href="#" aria="TikTok" bg="bg-black">
                    <Music2 className="h-4 w-4 text-white" />
                  </SocialIcon>

                  <SocialIcon href="#" aria="WhatsApp" bg="bg-[#25D366]">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </SocialIcon>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Bottom Bar (Desktop) */}
      <div className="hidden w-full bg-white md:block">
        <div className="mx-auto flex h-[52px] max-w-7xl items-center justify-between px-4">
          {/* Left nav links */}
          <nav className="flex items-center gap-6 text-[14px] text-slate-700">
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenCat((p) => !p)}
                className="flex items-center gap-2 py-2 hover:text-slate-900"
              >
                Categories
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            <Link href="/" className="py-2 hover:text-slate-900">
              Home
            </Link>
            <Link href="/allproducts" className="py-2 hover:text-slate-900">
              All Product
            </Link>
            <Link href="/" className="py-2 hover:text-slate-900">
              Offer
            </Link>
            <Link href="/" className="py-2 hover:text-slate-900">
              About
            </Link>
            <Link href="/" className="py-2 hover:text-slate-900">
              Contact
            </Link>
            <Link href="/" className="py-2 hover:text-slate-900">
              Free Delivery
            </Link>
          </nav>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            <SocialIcon href="#" aria="Facebook" bg="bg-[#1877F2]">
              <Facebook className="h-4 w-4 text-white" />
            </SocialIcon>

            <SocialIcon
              href="#"
              aria="Instagram"
              bg="bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#515BD4]"
            >
              <Instagram className="h-4 w-4 text-white" />
            </SocialIcon>

            <SocialIcon href="#" aria="YouTube" bg="bg-[#FF0000]">
              <Youtube className="h-4 w-4 text-white" />
            </SocialIcon>

            {/* TikTok */}
            <SocialIcon href="#" aria="TikTok" bg="bg-black">
              <Music2 className="h-4 w-4 text-white" />
            </SocialIcon>

            {/* WhatsApp */}
            <SocialIcon href="#" aria="WhatsApp" bg="bg-[#25D366]">
              <MessageCircle className="h-4 w-4 text-white" />
            </SocialIcon>
          </div>
        </div>
      </div>
    </header>
  );
}

/* -------------------- Small UI -------------------- */

function IconWithBadge({ count, label, children }) {
  return (
    <button className="relative rounded-md p-2 hover:bg-white/10" aria-label={label}>
      {children}
      <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-white px-1 text-[11px] font-bold text-[#785E4C]">
        {count}
      </span>
    </button>
  );
}

function SocialIcon({ href, aria, bg, children }) {
  return (
    <a
      href={href}
      aria-label={aria}
      className={`flex h-9 w-9 items-center justify-center rounded-full ${bg} shadow-sm hover:opacity-90`}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}
