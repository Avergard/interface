export interface GoodsInfo {
  id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  supplier: string;
  arrivalDate: string;
}

export interface Good {
  id: number;
  goods_code: string;
  name: string;
  count: number;
  description: string;
  category: string;
  created_at?: string;
  created_by_user_id?: number;
  created_by_username?: string;
  created_by_role?: string;
}

export interface GoodsState {
  goodsInfo: GoodsInfo | null;
  goodsList: Good[];
  loading: boolean;
  error: string | null;
} 