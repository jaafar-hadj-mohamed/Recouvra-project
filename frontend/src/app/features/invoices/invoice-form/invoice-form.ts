import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../../../core/services/invoice.service';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../core/models/client.model';
import { CreateInvoiceDto } from '../../../core/models/invoice.model';

@Component({
  selector: 'app-invoice-form',
  imports: [FormsModule, RouterLink],
  templateUrl: './invoice-form.html',
  styleUrl: './invoice-form.css'
})
export class InvoiceForm implements OnInit {
  private invoiceService = inject(InvoiceService);
  private clientService = inject(ClientService);
  private router = inject(Router);

  clients = signal<Client[]>([]);
  loading = signal(false);
  error = signal('');

  form: CreateInvoiceDto = {
    client: '',
    amount: 0,
    dueDate: '',
    status: 'unpaid'
  };

  ngOnInit() {
    this.clientService.getAll(1, 100).subscribe({
      next: (res) => this.clients.set(res.data),
      error: () => this.error.set('Impossible de charger les clients.')
    });
  }

  onSubmit() {
    if (!this.form.client || !this.form.amount || !this.form.dueDate) {
      this.error.set('Tous les champs obligatoires doivent être remplis.');
      return;
    }
    this.loading.set(true);
    this.error.set('');

    this.invoiceService.create(this.form).subscribe({
      next: () => this.router.navigate(['/invoices']),
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Erreur lors de la création.');
      }
    });
  }
}
