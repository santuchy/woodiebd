export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");

  // original backend endpoint
  const baseUrl =
    "https://ecommerce-saas-server-wine.vercel.app/api/v1/product/website";

  const url = new URL(baseUrl);

  // query params forward
  if (page) url.searchParams.set("page", page);
  if (limit) url.searchParams.set("limit", limit);

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "store-id": process.env.NEXT_PUBLIC_STORE_ID,
      },
      cache: "no-store",
    });

    const data = await res.text();

    return new Response(data, {
      status: res.status,
      headers: {
        "Content-Type":
          res.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Products fetch failed",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
