"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#F5F5F5] border-t">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">

          {/* About */}
          <div>
            <img
              src="/WOODIE (1).webp"
              alt="Woodie Logo"
              className="mb-4 h-12"
            />
            <p className="text-sm leading-relaxed text-slate-600">
              Woodie Crafts Timeless Wooden Products Inspired By Nature –
              Simple, Elegant, And Made With Care.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-slate-900">
              Contact Us
            </h4>

            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                📧 woodieofficial@gmail.com
              </li>
              <li className="flex items-center gap-2">
                📞 01976580855
              </li>
              <li className="flex items-start gap-2">
                📍 Pahartali, Chittagong, Bangladesh
              </li>
            </ul>
          </div>

          {/* Quick link */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-slate-900">
              Quick Links
            </h4>

            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <Link href="/" className="hover:underline">
                  Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:underline">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-slate-900">
              Customer Service
            </h4>

            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <Link href="/" className="hover:underline">
                  Support Center
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:underline">
                  Privacy & Policy
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:underline">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom */}
      <div className="border-t bg-[#EFEFEF] py-4">
        <p className="text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Woodie BD. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
