export type Category = {
    id: string;
    slug: string;
    nameBn: string;
    icon: string;
};

export type Product = {
    id: string | number;
    nameBn : string ;
    slug: string ;
    icon: string ;
    category:string;
    categoryName?:string ;
    unit:string ;
    price : number ;
    previousPrice?: number;
    change:number;
    description?: string ;
      minPrice?: number;
  maxPrice?: number;
  averagePrice?: number;
  marketPrices?: {
    market: string;
    price: number;
     }[];
};

