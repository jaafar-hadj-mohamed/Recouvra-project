import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActionService } from '../../../core/services/action.service';
import { ClientService } from '../../../core/services/client.service';
import { UserService } from '../../../core/services/user.service';
import { Client } from '../../../core/models/client.model';
import { User } from '../../../core/models/user.model';
import { CreateActionDto } from '../../../core/models/action.model';

@Component({
  selector: 'app-action-form',
  imports: [FormsModule, RouterLink],
  templateUrl: './action-form.html',
  styleUrl: './action-form.css'
})
export class ActionForm implements OnInit {
  private actionService = inject(ActionService);
  private clientService = inject(ClientService);
  private userService = inject(UserService);
  private router = inject(Router);

  clients = signal<Client[]>([]);
  users = signal<User[]>([]);
  loading = signal(false);
  error = signal('');

  form: CreateActionDto = {
    client: '',
    type: 'call',
    note: '',
    date: new Date().toISOString().split('T')[0],
    agent: ''
  };

  ngOnInit() {
    this.clientService.getAll(1, 100).subscribe({ next: (res) => this.clients.set(res.data) });
    this.userService.getAll().subscribe({ next: (res) => this.users.set(res.data) });
  }

  onSubmit() {
    if (!this.form.client || !this.form.type) {
      this.error.set('Client et type sont requis.');
      return;
    }
    this.loading.set(true);
    this.error.set('');

    const dto: CreateActionDto = { ...this.form };
    if (!dto.agent) delete dto.agent;

    this.actionService.create(dto).subscribe({
      next: () => this.router.navigate(['/actions']),
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Erreur lors de la création.');
      }
    });
  }
}
