import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Payment, CreatePaymentDto } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/payments`;

  create(dto: CreatePaymentDto) {
    return this.http.post<{ success: boolean; data: Payment }>(this.baseUrl, dto);
  }
}
