export interface Product {
  id: number;       // ✅ keep as number (same as API)
  title: string;    // ✅ same as API
  price: number;
  image: string;
  category: string;
}
