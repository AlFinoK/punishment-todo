import { Component } from '@angular/core';
import {
  TasksListComponent,
  PageTitleComponent,
  SearchFilterComponent,
} from '../common';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrl: './my-tasks.component.scss',
  imports: [TasksListComponent, PageTitleComponent, SearchFilterComponent],
})
export class MyTasksComponent {}
