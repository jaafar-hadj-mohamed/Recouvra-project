import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CollectionAction, CreateActionDto } from '../models/action.model';

@Injectable({ providedIn: 'root' })
export class ActionService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/actions`;

  getAll() {
    return this.http.get<{ success: boolean; data: CollectionAction[] }>(this.baseUrl);
  }

  create(dto: CreateActionDto) {
    return this.http.post<{ success: boolean; data: CollectionAction }>(this.baseUrl, dto);
  }
}
