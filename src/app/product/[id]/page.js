import ProductDetailsClient from "./ProductDetailsClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

function getBaseUrlSafe() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/+$/, "");
  return "http://localhost:3000";
}

async function loadProductByPath(baseUrl, id) {
  try {
    const res = await fetch(`${baseUrl}/api/product/path/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json?.data || null;
  } catch (e) {
    console.error("Product details SSR fetch error:", e);
    return null;
  }
}

export default async function ProductDetailsPage(props) {
  const params = await props.params;
  const id = params?.id;

  if (!id) notFound();

  const baseUrl = getBaseUrlSafe();
  const apiProduct = await loadProductByPath(baseUrl, id);

  if (!apiProduct) notFound();

  return <ProductDetailsClient apiProduct={apiProduct} />;
}
