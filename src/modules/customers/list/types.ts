interface CustomerDataType {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  createdAt?: string;
  username?: string;
  lastActive?: string;
  dateRegistered?: string;
  orders?: number;
  totalSpend?: number;
  AOV?: number;
  city?: string;
}

export type { CustomerDataType };
