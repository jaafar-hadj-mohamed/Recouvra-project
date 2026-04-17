import { Client } from './client.model';

export interface Invoice {
  _id: string;
  client: Client | string;
  amount: number;
  dueDate: string;
  status: 'unpaid' | 'partial' | 'paid';
  payments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceDto {
  client: string;
  amount: number;
  dueDate: string;
  status?: 'unpaid' | 'partial' | 'paid';
}
