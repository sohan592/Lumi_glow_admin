interface reviewDataType {
  id: string;
  type: string;
  author: {
    name: string;
    avatar?: string;
    email: string;
    phone: string;
  };
  rating: number;
  review: string;
  product: {
    name: string;
    url: string;
  };
  submitted_on: string;
}
export type { reviewDataType };
