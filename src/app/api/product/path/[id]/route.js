import { NextResponse } from "next/server";

export async function GET(req, ctx) {
  try {
    let id = ctx?.params?.id;
    if (!id) {
      const pathname = req.nextUrl?.pathname || "";
      const parts = pathname.split("/api/product/path/");
      id = parts?.[1] || "";
    }

    id = String(id || "").trim().replace(/^\/|\/$/g, "");

    if (!id) {
      return NextResponse.json(
        {
          status: "false",
          message: "Missing id",
          errorMessages: [{ message: "Missing id", path: "id" }],
        },
        { status: 400 }
      );
    }

    const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "0000130";

    const apiUrl = `https://ecommerce-saas-server-wine.vercel.app/api/v1/product/path/${encodeURIComponent(
      id
    )}`;

    const res = await fetch(apiUrl, {
      headers: {
        "store-id": STORE_ID,
      },
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      {
        status: "false",
        message: "Server error",
        errorMessages: [{ message: err?.message || "Server error", path: "" }],
      },
      { status: 500 }
    );
  }
}
