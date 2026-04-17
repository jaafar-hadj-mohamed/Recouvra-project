import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../core/services/client.service';
import { CreateClientDto } from '../../../core/models/client.model';

@Component({
  selector: 'app-client-form',
  imports: [FormsModule, RouterLink],
  templateUrl: './client-form.html',
  styleUrl: './client-form.css'
})
export class ClientForm implements OnInit {
  private clientService = inject(ClientService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  clientId = signal<string | null>(null);
  isEdit = signal(false);
  loading = signal(false);
  error = signal('');

  form: CreateClientDto = { name: '', email: '', phone: '', address: '' };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.clientId.set(id);
      this.isEdit.set(true);
      this.clientService.getById(id).subscribe({
        next: (res) => {
          const c = res.data;
          this.form = { name: c.name, email: c.email || '', phone: c.phone || '', address: c.address || '' };
        },
        error: () => this.error.set('Client introuvable.')
      });
    }
  }

  onSubmit() {
    if (!this.form.name) {
      this.error.set('Le nom est requis.');
      return;
    }
    this.loading.set(true);
    this.error.set('');

    const obs = this.isEdit()
      ? this.clientService.update(this.clientId()!, this.form)
      : this.clientService.create(this.form);

    obs.subscribe({
      next: () => this.router.navigate(['/clients']),
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Erreur lors de la sauvegarde.');
      }
    });
  }
}
