import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { Login } from './features/auth/login/login';
import { Layout } from './shared/layout/layout';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'clients',
        loadComponent: () => import('./features/clients/client-list/client-list').then(m => m.ClientList)
      },
      {
        path: 'clients/new',
        loadComponent: () => import('./features/clients/client-form/client-form').then(m => m.ClientForm)
      },
      {
        path: 'clients/:id/edit',
        loadComponent: () => import('./features/clients/client-form/client-form').then(m => m.ClientForm)
      },
      {
        path: 'invoices',
        loadComponent: () => import('./features/invoices/invoice-list/invoice-list').then(m => m.InvoiceList)
      },
      {
        path: 'invoices/new',
        loadComponent: () => import('./features/invoices/invoice-form/invoice-form').then(m => m.InvoiceForm)
      },
      {
        path: 'payments/new',
        loadComponent: () => import('./features/payments/payment-form/payment-form').then(m => m.PaymentForm)
      },
      {
        path: 'actions',
        loadComponent: () => import('./features/actions/action-list/action-list').then(m => m.ActionList)
      },
      {
        path: 'actions/new',
        loadComponent: () => import('./features/actions/action-form/action-form').then(m => m.ActionForm)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/users/user-list/user-list').then(m => m.UserList)
      },
      {
        path: 'users/new',
        loadComponent: () => import('./features/users/user-form/user-form').then(m => m.UserForm)
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
