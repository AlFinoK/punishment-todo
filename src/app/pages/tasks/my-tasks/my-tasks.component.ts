import { Component } from '@angular/core';
import { TasksListComponent } from '@shared/components';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrl: './my-tasks.component.scss',
  imports: [TasksListComponent],
})
export class MyTasksComponent {}
