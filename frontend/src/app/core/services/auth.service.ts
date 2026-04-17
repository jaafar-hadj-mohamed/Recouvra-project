import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthUser, AuthResponse } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  currentUser = signal<AuthUser | null>(this.getStoredUser());

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(
      `${environment.apiUrl}/auth/login`,
      { email, password }
    ).pipe(
      tap(res => {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        this.currentUser.set(res.data.user);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    // Guard against stale "undefined" string from a previous bug
    return token && token !== 'undefined' ? token : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private getStoredUser(): AuthUser | null {
    const user = localStorage.getItem('user');
    if (!user || user === 'undefined') return null;
    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }
}
