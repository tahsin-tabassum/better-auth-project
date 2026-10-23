
export type Category = {
  id: string | number;
  slug: string;
  nameBn: string;
  icon: string;
  description?: string;
};

export type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};

export type Product = {
  id: string | number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn?: string;
  categoryIcon?: string;
  icon: string;
  image?: string;
  unit: string;

  price: number;
  previousPrice: number;
  change: number;

  today: number;
  yesterday: number;
  lastWeek?: number;
  lastMonth?: number;

  markets: Market[];
};
