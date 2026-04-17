import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ActionService } from '../../../core/services/action.service';
import { CollectionAction } from '../../../core/models/action.model';
import { Client } from '../../../core/models/client.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-action-list',
  imports: [RouterLink, DatePipe],
  templateUrl: './action-list.html',
  styleUrl: './action-list.css'
})
export class ActionList implements OnInit {
  private actionService = inject(ActionService);

  actions = signal<CollectionAction[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit() {
    this.actionService.getAll().subscribe({
      next: (res) => {
        this.actions.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les actions.');
        this.loading.set(false);
      }
    });
  }

  getClientName(client: Client | string): string {
    return typeof client === 'object' ? client.name : client;
  }

  getAgentName(agent: User | string | undefined): string {
    if (!agent) return '—';
    return typeof agent === 'object' ? agent.name : agent;
  }

  typeLabel(type: string): string {
    const map: Record<string, string> = { call: 'Appel', email: 'Email', visit: 'Visite' };
    return map[type] || type;
  }

  typeClass(type: string): string {
    const map: Record<string, string> = { call: 'badge-blue', email: 'badge-purple', visit: 'badge-orange' };
    return map[type] || '';
  }
}
