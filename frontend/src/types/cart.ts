export interface CartItem {
  id: string;
  name: string;
  mrp: number;
  salePrice: number;
  quantity: number;
  image?: string;
  unit?: string; 
}
