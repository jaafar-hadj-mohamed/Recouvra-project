import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User, CreateUserDto } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/users`;

  getAll() {
    return this.http.get<{ success: boolean; data: User[] }>(this.baseUrl);
  }

  create(dto: CreateUserDto) {
    return this.http.post<{ success: boolean; data: User }>(this.baseUrl, dto);
  }
}
