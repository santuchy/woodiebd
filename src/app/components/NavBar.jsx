"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  User,
  ChevronDown,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Music2,
} from "lucide-react";

export default function Navbar() {
  const [openCat, setOpenCat] = useState(false);

  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="w-full bg-[#785E4C]">
        <div className="mx-auto flex h-[70px] max-w-7xl items-center gap-4 px-4">
          {/* Logo */}
          <Link href="" className="flex items-center">
            <div className="flex items-center gap-2">
              <img className="h-15 w-30" src="/WOODIE (1).webp" alt="" />
            </div>
          </Link>

          {/* Search */}
          <div className="flex flex-1 items-center justify-center">
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
          <div className="flex items-center gap-4">
            {/* Cart */}
            <IconWithBadge count={0} label="Cart">
              <ShoppingCart className="h-6 w-6 text-white" />
            </IconWithBadge>

            {/* User icon*/}
            <button
              className="rounded-md p-2 hover:bg-white/10"
              aria-label="Account"
            >
              <User className="h-6 w-6 text-white" />
            </button>

            {/* Login Button */}
            <Link
              href="/"
              className="rounded-md border border-white px-4 py-2 text-[14px] font-semibold text-white hover:bg-white hover:text-[#785E4C]"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full bg-white">
        <div className="mx-auto flex h-[52px] max-w-7xl items-center justify-between px-4">
          {/* Left nav links */}
          <nav className="flex items-center gap-6 text-[14px] text-slate-700">
            {/* Categories dropdown */}
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
            <Link href="/" className="py-2 hover:text-slate-900">
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
    <button
      className="relative rounded-md p-2 hover:bg-white/10"
      aria-label={label}
    >
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
