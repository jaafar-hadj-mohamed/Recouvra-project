import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../core/models/client.model';

@Component({
  selector: 'app-client-list',
  imports: [RouterLink],
  templateUrl: './client-list.html',
  styleUrl: './client-list.css'
})
export class ClientList implements OnInit {
  private clientService = inject(ClientService);

  clients = signal<Client[]>([]);
  total = signal(0);
  page = signal(1);
  limit = 10;
  loading = signal(true);
  error = signal('');
  successMsg = signal('');

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.clientService.getAll(this.page(), this.limit).subscribe({
      next: (res) => {
        this.clients.set(res.data);
        this.total.set(res.total);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les clients.');
        this.loading.set(false);
      }
    });
  }

  get totalPages() {
    return Math.ceil(this.total() / this.limit);
  }

  prevPage() {
    if (this.page() > 1) {
      this.page.set(this.page() - 1);
      this.load();
    }
  }

  nextPage() {
    if (this.page() < this.totalPages) {
      this.page.set(this.page() + 1);
      this.load();
    }
  }

  delete(id: string) {
    if (!confirm('Supprimer ce client ?')) return;
    this.clientService.delete(id).subscribe({
      next: () => {
        this.successMsg.set('Client supprimé.');
        this.load();
        setTimeout(() => this.successMsg.set(''), 3000);
      },
      error: () => this.error.set('Erreur lors de la suppression.')
    });
  }
}
