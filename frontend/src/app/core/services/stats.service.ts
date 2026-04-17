import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { StatsResponse } from '../models/stats.model';

@Injectable({ providedIn: 'root' })
export class StatsService {
  private http = inject(HttpClient);

  getStats() {
    return this.http.get<StatsResponse>(`${environment.apiUrl}/stats`);
  }
}
