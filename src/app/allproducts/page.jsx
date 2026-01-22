import ProductsClient from "./ProductsClient";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

function getBaseUrlSafe() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/+$/, "");

  try {
    const h = headers();
    const host = typeof h?.get === "function" ? h.get("host") : "";
    if (host) {
      const proto = process.env.NODE_ENV === "development" ? "http" : "https";
      return `${proto}://${host}`;
    }
  } catch (e) {}

  return "http://localhost:3000";
}

async function loadAllProducts(baseUrl) {
  try {
    const firstRes = await fetch(`${baseUrl}/api/products?page=1&limit=100`, {
      cache: "no-store",
    });
    if (!firstRes.ok) return [];

    const firstJson = await firstRes.json();
    const firstArr = Array.isArray(firstJson?.data?.data)
      ? firstJson.data.data
      : [];

    const meta = firstJson?.data?.meta || {};
    const total = Number(meta?.total ?? firstArr.length);
    const limit = Number(meta?.limit ?? 10);
    const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;

    let all = [...firstArr];

    if (totalPages > 1) {
      const promises = [];
      for (let p = 2; p <= totalPages; p++) {
        promises.push(
          fetch(`${baseUrl}/api/products?page=${p}&limit=${limit}`, {
            cache: "no-store",
          })
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null)
        );
      }

      const results = await Promise.all(promises);
      results.forEach((j) => {
        const arr = Array.isArray(j?.data?.data) ? j.data.data : [];
        all.push(...arr);
      });
    }

    return all.map((p) => {
      const id = p?.path || p?._id;

      const img =
        Array.isArray(p?.imageURLs) && p.imageURLs.length > 0
          ? p.imageURLs[0]
          : "/product/11.jpg";

      const category =
        Array.isArray(p?.category) && p.category.length > 0 ? p.category[0] : "";

      return {
        id: String(id),
        discount: p?.discount ? `${p.discount}% off` : "",
        title: p?.name || "Product",
        price: Number(p?.salePrice ?? 0),
        oldPrice: Number(p?.productPrice ?? 0),
        img,
        category,
      };
    });
  } catch (e) {
    console.error("Products fetch error:", e);
    return [];
  }
}

async function loadCategories(baseUrl) {
  try {
    const res = await fetch(`${baseUrl}/api/categories`, { cache: "no-store" });
    if (!res.ok) return [];

    const json = await res.json();
    const arr = Array.isArray(json?.data) ? json.data : [];

    const cats = arr
      .filter((c) => c?.status === true)
      .map((c) => c?.parentCategory)
      .filter(Boolean);

    return Array.from(new Set(cats));
  } catch (e) {
    console.error("Category fetch error:", e);
    return [];
  }
}

export default async function ProductsPage() {
  const baseUrl = getBaseUrlSafe();

  const [products, categories] = await Promise.all([
    loadAllProducts(baseUrl),
    loadCategories(baseUrl),
  ]);

  return (
    <ProductsClient
      initialProducts={products}
      initialCategories={categories}
    />
  );
}
