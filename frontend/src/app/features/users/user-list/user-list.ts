import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-user-list',
  imports: [RouterLink, DatePipe],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserList implements OnInit {
  private userService = inject(UserService);
  auth = inject(AuthService);

  users = signal<User[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit() {
    this.userService.getAll().subscribe({
      next: (res) => {
        this.users.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les utilisateurs.');
        this.loading.set(false);
      }
    });
  }

  roleClass(role: string): string {
    const map: Record<string, string> = { admin: 'badge-red', manager: 'badge-orange', agent: 'badge-blue' };
    return map[role] || '';
  }
}
