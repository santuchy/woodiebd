export async function GET() {
  const url = "https://ecommerce-saas-server-wine.vercel.app/api/v1/category/website/0000130";

  const res = await fetch(url, {
    headers: { "store-id": process.env.NEXT_PUBLIC_STORE_ID },
    cache: "no-store",
  });

  const data = await res.text();

  return new Response(data, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") || "application/json" },
  });
}
