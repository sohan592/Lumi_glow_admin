interface DataType {
  name: string;
}
interface CategoryDataType {
  id: string;
  name: string;
  icon: object;
  description: string;
  totalProducts: number;
  parentCategory?: string;
}

export type { DataType, CategoryDataType };
