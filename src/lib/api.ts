
import type { Category, Product } from "@/types/bazardor";

const API_URLS = [
  process.env.MAIN_API_URL,
  process.env.BASE_URL_2,
  process.env.BASE_URL_1,
].filter((url): url is string => Boolean(url));

type ApiRecord = Record<string, unknown>;

function first(
  obj: ApiRecord,
  keys: string[],
  fallback: unknown = undefined,
): unknown {
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) {
      return obj[key];
    }
  }

  return fallback;
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/[৳,\s]/g, ""));
    if (Number.isFinite(parsed)) return parsed;
  }

  return fallback;
}

function toString(value: unknown, fallback = ""): string {
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : fallback;
}

function unwrapResponse(data: unknown): unknown {
  if (Array.isArray(data)) return data;

  if (data && typeof data === "object") {
    const obj = data as ApiRecord;

    for (const key of ["data", "products", "categories", "result"]) {
      if (obj[key] !== undefined) {
        const nested = obj[key];

        if (Array.isArray(nested)) return nested;

        if (nested && typeof nested === "object") {
          return nested;
        }
      }
    }
  }

  return data;
}

async function fetchAPI<T>(endpoint: string): Promise<T> {
  if (API_URLS.length === 0) {
    throw new Error(
      "API URL missing. Add MAIN_API_URL, BASE_URL_2 and BASE_URL_1 to .env.local.",
    );
  }

  let lastError: unknown;

  for (const baseUrl of API_URLS) {
    try {
      const response = await fetch(
        `${baseUrl.replace(/\/+$/, "")}${endpoint}`,
        {
          cache: "no-store",
          signal: AbortSignal.timeout(8000),
        },
      );

      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${endpoint}`);
      }

      const json: unknown = await response.json();
      return unwrapResponse(json) as T;
    } catch (error) {
      lastError = error;
      console.error(`API request failed: ${baseUrl}${endpoint}`, error);
    }
  }

  throw new Error(`Unable to fetch ${endpoint}`, {
    cause: lastError,
  });
}

/* Normalize one category */
export function normalizeCategory(value: unknown): Category {
  const obj = (value ?? {}) as ApiRecord;

  const id = toString(
    first(obj, ["id", "_id", "slug", "categoryId"], "unknown"),
  );

  return {
    ...obj,
    id,
    slug: toString(first(obj, ["slug", "id", "_id"], id)),
    nameBn: toString(
      first(obj, ["nameBn", "name_bn", "name", "categoryName", "title"]),
      "অন্যান্য",
    ),
    icon: toString(first(obj, ["icon", "emoji"], "🛒")),
  } as Category;
}

/* Normalize one product */
export function normalizeProduct(value: unknown): Product {
  const obj = (value ?? {}) as ApiRecord;

  const id = first(obj, ["id", "_id", "productId"], "unknown");
  const name = toString(
    first(obj, ["nameBn", "name_bn", "name", "productName", "title"]),
    "পণ্যের নাম নেই",
  );

  const categoryValue = first(
    obj,
    ["category", "categoryId", "categorySlug"],
    "",
  );

  const category =
    typeof categoryValue === "object" && categoryValue !== null
      ? toString(
          first(categoryValue as ApiRecord, ["slug", "id", "nameBn", "name"]),
        )
      : toString(categoryValue);

  const price = toNumber(
    first(obj, ["price", "currentPrice", "todayPrice", "priceToday"]),
  );

  const previousPrice = toNumber(
    first(obj, ["previousPrice", "oldPrice", "yesterdayPrice", "lastPrice"]),
    price,
  );

  const change = toNumber(
    first(obj, ["change", "changePercent", "priceChange"]),
    previousPrice === 0
      ? 0
      : ((price - previousPrice) / previousPrice) * 100,
  );

  return {
    ...obj,
    id: typeof id === "number" ? id : String(id),
    slug: toString(first(obj, ["slug"], String(id))),
    nameBn: name,
    icon: toString(first(obj, ["icon", "emoji"], "🛒")),
    category,
    categoryId: category,
    unit: toString(first(obj, ["unit", "unitName"], "কেজি")),
    price,
    previousPrice,
    change,
  } as Product;
}

/* Get all categories */
export async function getCategories(): Promise<Category[]> {
  const data = await fetchAPI<unknown>("/categories");
  const result = unwrapResponse(data);

  if (!Array.isArray(result)) {
    throw new Error("Categories API did not return an array.");
  }

  return result.map(normalizeCategory);
}

/* Get all products or products in one category */
export async function getProducts(
  category?: string,
): Promise<Product[]> {
  const endpoint = category
    ? `/products?category=${encodeURIComponent(category)}`
    : "/products";

  const data = await fetchAPI<unknown>(endpoint);
  const result = unwrapResponse(data);

  if (!Array.isArray(result)) {
    throw new Error("Products API did not return an array.");
  }

  return result.map(normalizeProduct);
}

/* Get one product by ID or slug */
export async function getProduct(
  id: string,
): Promise<Product | null> {
  try {
    const data = await fetchAPI<unknown>(
      `/products/${encodeURIComponent(id)}`,
    );

    const result = unwrapResponse(data);

    if (Array.isArray(result)) {
      const match = result[0];
      return match ? normalizeProduct(match) : null;
    }

    if (!result || typeof result !== "object") {
      return null;
    }

    return normalizeProduct(result);
  } catch (error) {
    console.error(`Failed to get product ${id}:`, error);
    return null;
  }
}

    

