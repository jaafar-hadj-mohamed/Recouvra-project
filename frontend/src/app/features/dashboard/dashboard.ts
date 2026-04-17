import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StatsService } from '../../core/services/stats.service';
import { Stats } from '../../core/models/stats.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private statsService = inject(StatsService);

  stats = signal<Stats | null>(null);
  loading = signal(true);
  error = signal('');

  ngOnInit() {
    this.statsService.getStats().subscribe({
      next: (res) => {
        this.stats.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les statistiques.');
        this.loading.set(false);
      }
    });
  }
}
