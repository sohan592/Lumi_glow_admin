interface DataType {
  name: string;
  sku: string;
  barcode: string;
  category: string;
  price: number;
  saleprice: number;
  stock: number;
  status: string;
}
interface ProductDataType {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  price: number;
  saleprice: number;
  stock: number;
  status: string;
}
export type { DataType, ProductDataType };
