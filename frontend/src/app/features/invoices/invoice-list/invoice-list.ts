import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { InvoiceService } from '../../../core/services/invoice.service';
import { Invoice } from '../../../core/models/invoice.model';
import { Client } from '../../../core/models/client.model';

@Component({
  selector: 'app-invoice-list',
  imports: [RouterLink, FormsModule, DatePipe, CurrencyPipe],
  templateUrl: './invoice-list.html',
  styleUrl: './invoice-list.css'
})
export class InvoiceList implements OnInit {
  private invoiceService = inject(InvoiceService);

  invoices = signal<Invoice[]>([]);
  total = signal(0);
  page = signal(1);
  limit = 10;
  statusFilter = '';
  loading = signal(true);
  error = signal('');

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.invoiceService.getAll(this.page(), this.limit, this.statusFilter || undefined).subscribe({
      next: (res) => {
        this.invoices.set(res.data);
        this.total.set(res.total);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les factures.');
        this.loading.set(false);
      }
    });
  }

  get totalPages() {
    return Math.ceil(this.total() / this.limit);
  }

  prevPage() {
    if (this.page() > 1) { this.page.set(this.page() - 1); this.load(); }
  }

  nextPage() {
    if (this.page() < this.totalPages) { this.page.set(this.page() + 1); this.load(); }
  }

  onFilterChange() {
    this.page.set(1);
    this.load();
  }

  getClientName(client: Client | string): string {
    return typeof client === 'object' ? client.name : client;
  }

  statusClass(status: string): string {
    const map: Record<string, string> = { paid: 'badge-green', partial: 'badge-orange', unpaid: 'badge-red' };
    return map[status] || '';
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = { paid: 'Payée', partial: 'Partielle', unpaid: 'Impayée' };
    return map[status] || status;
  }
}
