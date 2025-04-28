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

export interface GoodsState {
  goodsInfo: GoodsInfo | null;
  loading: boolean;
  error: string | null;
} 