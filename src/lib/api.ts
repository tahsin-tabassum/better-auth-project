
import type { Category, Product, Market } from "@/types/bazardor";

const API_URL =
  process.env.MAIN_API_URL ||
  "https://openapi.programming-hero.com/api/bazardor";

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

    for (const key of [
      "data",
      "products",
      "categories",
      "result",
    ]) {
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
  const url = `${API_URL.replace(/\/+$/, "")}${endpoint}`;

  const response = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(
      `API Error: ${response.status} ${response.statusText}`
    );
  }

  const json: unknown = await response.json();

  return unwrapResponse(json) as T;
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

  const today = toNumber(
    first(obj, ["today", "price", "currentPrice", "todayPrice"])
  );

  const yesterday = toNumber(
    first(obj, [
      "yesterday",
      "previousPrice",
      "oldPrice",
      "yesterdayPrice",
    ]),
    today
  );

  const rawChange = obj.change;

  let change = 0;

  if (
    rawChange &&
    typeof rawChange === "object" &&
    !Array.isArray(rawChange)
  ) {
    const changeObj = rawChange as ApiRecord;

    const percentage = toNumber(changeObj.pct);

    if (changeObj.dir === "up") {
      change = percentage;
    } else if (changeObj.dir === "down") {
      change = -percentage;
    }
  } else {
    change = toNumber(
      first(obj, ["changePercent", "priceChange"]),
      yesterday === 0
        ? 0
        : ((today - yesterday) / yesterday) * 100
    );
  }

  const markets: Market[] = Array.isArray(obj.markets)
    ? obj.markets.map((item: unknown) => {
        const market = item as ApiRecord;

        return {
          market: toString(market.market),
          division: toString(market.division),
          min: toNumber(market.min),
          max: toNumber(market.max),
        };
      })
    : [];

  return {
    id: typeof id === "number" ? id : String(id),
    slug: toString(first(obj, ["slug"], String(id))),
    nameBn: toString(first(obj, ["nameBn", "name"]), "পণ্যের নাম নেই"),

    category: toString(obj.category),
    categoryNameBn: toString(obj.categoryNameBn),
    categoryIcon: toString(obj.categoryIcon),

    icon: toString(first(obj, ["image", "icon", "emoji"]), "🛒"),
    image: toString(first(obj, ["image", "icon", "emoji"]), "🛒"),

    unit: toString(obj.unit, "kg"),

    price: today,
    previousPrice: yesterday,
    change,

    today,
    yesterday,
    lastWeek: toNumber(obj.lastWeek),
    lastMonth: toNumber(obj.lastMonth),

    markets,
  };
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

    

