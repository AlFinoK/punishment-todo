import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full',
  },
  {
    path: '',
    children: [
      {
        path: 'tasks',
        loadChildren: () =>
          import('./pages/tasks/tasks.routing').then((m) => m.TasksRouting),
      },
      {
        path: '404',
        loadComponent: () =>
          import('./pages/not-found/not-found.component').then(
            (m) => m.NotFoundComponent
          ),
      },
      {
        path: '**',
        redirectTo: '404',
      },
    ],
  },
];
