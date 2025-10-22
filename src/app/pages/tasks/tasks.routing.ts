import { Routes } from '@angular/router';

export const TasksRouting: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./tasks.component').then((m) => m.TasksComponent),
    children: [
      { path: '', redirectTo: 'my-tasks', pathMatch: 'full' },
      {
        path: 'my-tasks',
        loadComponent: () =>
          import('./my-tasks').then((m) => m.MyTasksComponent),
      },
      {
        path: 'finished-tasks',
        loadComponent: () =>
          import('./finished-tasks').then((m) => m.FinishedTasksComponent),
      },
      {
        path: 'important-tasks',
        loadComponent: () =>
          import('./important-tasks').then((m) => m.ImportantTasksComponent),
      },
      {
        path: 'deleted-tasks',
        loadComponent: () =>
          import('./deleted-tasks').then((m) => m.DeletedTasksComponent),
      },
    ],
  },
];
