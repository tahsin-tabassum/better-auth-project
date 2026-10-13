import type { Category, Product } from "@/types/bazardor";


const BASE_URLS = ["https://openapi.programming-hero.com/api/bazardor", 
   " https://api.api-store.workers.dev/api/bazardor" ,
    
];

async function fetchAPI <T>(endpoint:string): Promise <T> {
    let lastError: unknown;

    for (const baseUrl of BASE_URLS){
        try {
            const response = await fetch (`${baseUrl}${endpoint}` , {
                next: {revalidate: 300},

            });
            if (!response.ok) {
                throw new Error (`Request failed: ${response.status}`);
            }

            return (await response.json()) as T;
        }
        catch(error){
            lastError = error;
        }
    }

throw lastError ?? new Error ("Both Bazardor APIs failed.");

}


function unwrapArray(data:unknown): Record<string, unknown> [] {
     if (Array.isArray(data)){
        return data as Record<string, unknown> [] ;
     }

if (data && typeof data === "object"){
    const obj = data as Record<string, unknown>;
    for (const key of ["data", "products", "categories", "results"]){
        if (Array.isArray(obj[key])){
            return obj[key] as Record<string, unknown> [] ;
        }
    }
}
return [];  
}


function getText(
    obj: Record<string, unknown>,
    keys: string [],
    fallback = " "
): string {
    for (const key of keys) {
        const value = obj[key];
        if (typeof value === "string" || typeof value === "number"){
            return String(value);
        }
    }
    return fallback;
}

function getNumber(
  obj: Record<string, unknown>,
  keys: string[],
  fallback = 0
): number {
    for (const key of keys) {
        const value = obj[key];
      
        if(typeof value === "number" && Number.isFinite(value)) {
            return value;
        }
        if (typeof value === "string" && value.trim() !== "") {
            const parsed = Number(value.replace(/,/g,""));
            if (Number.isFinite(parsed)) return parsed;
        }
    }
    return fallback;
}

export async function getCategories(): Promise<Category[]> {
const data = await fetchAPI<unknown>("/categories");

return unwrapArray(data).map((item) => ({
    id: getText(item, ["id", "slug"]),
    slug: getText(item, [ "slug", "id"]),
    nameBn: getText(item, ["nameBn", "name", "title"], "নাম নেই"),
    icon: getText(item, ["icon", "emoji"], "🛒"),
}));

}


export async function getProducts(
    category?: string

): Promise<Product[]>
{
    const endpoint= category ? `/products?category=${encodeURIComponent(category)}`:"/products";

    const data = await fetchAPI<unknown> (endpoint);

    return unwrapArray(data).map((item)=> {
        const price = getNumber(item , [
            "price", 
            "currentPrice",
      "priceToday",
      "todayPrice",
        ]);

        const previousPrice = getNumber(item, [
            "previousPrice", 
            "oldPrice",
      "yesterdayPrice",
      "priceYesterday",
        ]);

        const explicitChange = getNumber(item, [
            "change",
             "changePercent",
      "priceChange",
      "percentageChange",
        ], Number.NaN);
    
const change = Number.isFinite (explicitChange)
? explicitChange:
previousPrice>0 ? ((price - previousPrice)/ previousPrice)* 100: 0;

return {
    id: getText(item, ["id", "_id", "slug"]),
    nameBn: getText(
        item, ["nameBn",  "name", "title", "productName"], "নাম নেই"

    ),
    slug: getText(item, ["slug"]),
    icon: getText (item, ["icon", "emoji"], "🛒" ),
    category: getText(item, ["categoryId"]),
    unit: getText(item, ["unit", "unitBn", "priceUnit"], "প্রতি কেজি"),
    price:String(price), 
    previousPrice,
    change,
    description: getText(item, ["description", "descriptionBn"]),
};
    });
}

export async function getProduct(
    id: string
): Promise<Product|null> {
    try{
        const data = await fetchAPI<unknown>(
             `/products/${encodeURIComponent(id)}`
        );

const item = data && typeof data === "object" && !Array.isArray(data)?
((data as Record<string, unknown>).data ?? data)
: data;

if(!item || typeof item !== "object") return null;

const obj = item as Record<string, unknown>;
const product = (await getProducts()).find(
(p) => String(p.id) ===id
);


if(!("id" in obj) && product) return product;

const price = getNumber(obj, [
   "price",
      "currentPrice",
      "priceToday",
      "todayPrice", 
]);
 const previousPrice = getNumber(obj, [
      "previousPrice",
      "oldPrice",
      "yesterdayPrice",
      "priceYesterday",
    ]);

    const explicitChange = getNumber(obj, [
      "change",
      "changePercent",
      "priceChange",
      "percentageChange",
    ], Number.NaN);

 return {
      id: getText(obj, ["id", "_id", "slug"], id),
      nameBn: getText(
        obj,
        ["nameBn", "name", "title", "productName"],
        "নাম নেই"
      ),
      slug: getText(obj, ["slug"]),
      icon: getText(obj, ["icon", "emoji"], "🛒"),
      category: getText(obj, ["category", "categorySlug"]),
      categoryId: getText(obj, ["categoryId"]),
      unit: getText(obj, ["unit", "unitBn", "priceUnit"], "প্রতি কেজি"),
      price:String(price),
      previousPrice,
      change: Number.isFinite(explicitChange)
        ? explicitChange
        : previousPrice > 0
          ? ((price - previousPrice) / previousPrice) * 100
          : 0,
      description: getText(obj, ["description", "descriptionBn"]),
    };

    } catch {
        return null;
    }
}
