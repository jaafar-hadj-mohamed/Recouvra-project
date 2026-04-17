import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { CreateUserDto } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-form',
  imports: [FormsModule, RouterLink],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css'
})
export class UserForm {
  private userService = inject(UserService);
  private router = inject(Router);

  loading = signal(false);
  error = signal('');

  form: CreateUserDto = {
    name: '',
    email: '',
    password: '',
    role: 'agent'
  };

  onSubmit() {
    if (!this.form.name || !this.form.email || !this.form.password) {
      this.error.set('Tous les champs sont requis.');
      return;
    }
    this.loading.set(true);
    this.error.set('');

    this.userService.create(this.form).subscribe({
      next: () => this.router.navigate(['/users']),
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Erreur lors de la création.');
      }
    });
  }
}
