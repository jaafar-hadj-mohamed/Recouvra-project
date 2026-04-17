import { Client } from './client.model';
import { User } from './user.model';

export interface CollectionAction {
  _id: string;
  client: Client | string;
  type: 'call' | 'email' | 'visit';
  note?: string;
  date: string;
  agent?: User | string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateActionDto {
  client: string;
  type: 'call' | 'email' | 'visit';
  note?: string;
  date?: string;
  agent?: string;
}
