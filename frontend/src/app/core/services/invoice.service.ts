import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Invoice, CreateInvoiceDto } from '../models/invoice.model';
import { PaginatedResponse } from '../models/client.model';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/invoices`;

  getAll(page = 1, limit = 10, status?: string) {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (status) params = params.set('status', status);
    return this.http
      .get<{ success: boolean; data: PaginatedResponse<Invoice> }>(this.baseUrl, { params })
      .pipe(map(res => res.data));
  }

  create(dto: CreateInvoiceDto) {
    return this.http.post<{ success: boolean; data: Invoice }>(this.baseUrl, dto);
  }

  update(id: string, dto: Partial<CreateInvoiceDto>) {
    return this.http.put<{ success: boolean; data: Invoice }>(`${this.baseUrl}/${id}`, dto);
  }
}
