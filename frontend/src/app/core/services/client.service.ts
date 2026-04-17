import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Client, CreateClientDto, PaginatedResponse } from '../models/client.model';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/clients`;

  getAll(page = 1, limit = 10) {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http
      .get<{ success: boolean; data: PaginatedResponse<Client> }>(this.baseUrl, { params })
      .pipe(map(res => res.data));
  }

  getById(id: string) {
    return this.http.get<{ success: boolean; data: Client }>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateClientDto) {
    return this.http.post<{ success: boolean; data: Client }>(this.baseUrl, dto);
  }

  update(id: string, dto: Partial<CreateClientDto>) {
    return this.http.put<{ success: boolean; data: Client }>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: string) {
    return this.http.delete<{ success: boolean; message: string }>(`${this.baseUrl}/${id}`);
  }
}
