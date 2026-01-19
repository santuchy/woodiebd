export async function GET() {
  const res = await fetch(
    "https://ecommerce-saas-server-wine.vercel.app/api/v1/banner/website?status=active&sort=position",
    {
      headers: {
        "store-id": process.env.STORE_ID,
      },
      cache: "no-store",
    }
  );

  const data = await res.json();

  return Response.json(data, {
    status: res.status,
  });
}
