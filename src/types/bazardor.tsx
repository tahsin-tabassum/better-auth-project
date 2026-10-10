export type Category = {
    id: string;
    nameBn: string;
    icon: string;
};

export type Product ={
    id: string | number;
    nameBn : string ;
    slug?: string ;
    icon: string ;
    category?:string;
    categoryId?:string ;
    unit:string ;
    price : string ;
    previousPrice?: number;
    change:number;
    description?: string ;
};


export type ApiProduct = Record<string, unknown>;