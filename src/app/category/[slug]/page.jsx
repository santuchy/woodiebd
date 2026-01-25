import CategoryClient from "./CategoryClient";

export const dynamic = "force-dynamic";

function getBaseUrlSafe() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/+$/, "");
  return "http://localhost:3000";
}

async function loadAllProducts(baseUrl) {
  try {
    const firstRes = await fetch(`${baseUrl}/api/products?page=1&limit=100`, {
      cache: "no-store",
    });
    if (!firstRes.ok) return [];

    const firstJson = await firstRes.json();
    const firstArr = Array.isArray(firstJson?.data?.data) ? firstJson.data.data : [];

    const meta = firstJson?.data?.meta || {};
    const total = Number(meta?.total ?? firstArr.length);
    const limit = Number(meta?.limit ?? 10);
    const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;

    let all = [...firstArr];

    if (totalPages > 1) {
      const promises = [];
      for (let p = 2; p <= totalPages; p++) {
        promises.push(
          fetch(`${baseUrl}/api/products?page=${p}&limit=${limit}`, { cache: "no-store" })
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

      const categoryName =
        Array.isArray(p?.category) && p.category.length > 0 ? p.category[0] : "";

      const categoryPath =
        Array.isArray(p?.categoryPath) && p.categoryPath.length > 0 ? p.categoryPath[0] : "";

      return {
        id: String(id),
        title: p?.name || "Product",
        price: Number(p?.salePrice ?? 0),
        oldPrice: Number(p?.productPrice ?? 0),
        discount:
          typeof p?.discount === "number" || typeof p?.discount === "string"
            ? `${p.discount}% off`
            : "",
        img,
        categoryName,
        categoryPath,
      };
    });
  } catch (e) {
    console.error("Category SSR products fetch error:", e);
    return [];
  }
}

export default async function CategoryPage(props) {
  const params = await props.params;
  const slug = params?.slug || "";

  const baseUrl = getBaseUrlSafe();

  const products = await loadAllProducts(baseUrl);
  const inCategory = products.filter((p) => p.categoryPath === slug);

  const categoryName = inCategory[0]?.categoryName || slug.replace(/-/g, " ");

  return (
    <CategoryClient slug={slug} categoryName={categoryName} products={inCategory} />
  );
}
