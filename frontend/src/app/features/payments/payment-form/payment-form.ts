import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../../core/services/payment.service';
import { InvoiceService } from '../../../core/services/invoice.service';
import { Invoice } from '../../../core/models/invoice.model';
import { Client } from '../../../core/models/client.model';
import { CreatePaymentDto } from '../../../core/models/payment.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-payment-form',
  imports: [FormsModule, CurrencyPipe, RouterLink],
  templateUrl: './payment-form.html',
  styleUrl: './payment-form.css'
})
export class PaymentForm implements OnInit {
  private paymentService = inject(PaymentService);
  private invoiceService = inject(InvoiceService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  invoices = signal<Invoice[]>([]);
  loading = signal(false);
  error = signal('');

  form: CreatePaymentDto = {
    invoice: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    method: 'cash'
  };

  ngOnInit() {
    this.invoiceService.getAll(1, 100, 'unpaid').subscribe({
      next: (res) => {
        const all = res.data;
        this.invoiceService.getAll(1, 100, 'partial').subscribe({
          next: (res2) => this.invoices.set([...all, ...res2.data])
        });
      }
    });

    const invoiceId = this.route.snapshot.queryParamMap.get('invoiceId');
    if (invoiceId) this.form.invoice = invoiceId;
  }

  getClientName(client: Client | string): string {
    return typeof client === 'object' ? client.name : client;
  }

  onSubmit() {
    if (!this.form.invoice || !this.form.amount) {
      this.error.set('Facture et montant sont requis.');
      return;
    }
    this.loading.set(true);
    this.error.set('');

    this.paymentService.create(this.form).subscribe({
      next: () => this.router.navigate(['/invoices']),
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Erreur lors de l\'enregistrement.');
      }
    });
  }
}
