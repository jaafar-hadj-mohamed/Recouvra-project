export interface Payment {
  _id: string;
  invoice: string;
  amount: number;
  date: string;
  method: 'cash' | 'card' | 'bank';
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentDto {
  invoice: string;
  amount: number;
  date?: string;
  method?: 'cash' | 'card' | 'bank';
}
