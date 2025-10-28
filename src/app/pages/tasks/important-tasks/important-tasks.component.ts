import { Component, signal, WritableSignal } from '@angular/core';

import { SearchFilterComponent, PageTitleComponent } from '../common';
import { TaskInterface, TaskService } from '@modules/task-module';

@Component({
  selector: 'app-important-tasks',
  templateUrl: './important-tasks.component.html',
  styleUrl: './important-tasks.component.scss',
  imports: [SearchFilterComponent, PageTitleComponent],
})
export class ImportantTasksComponent {
  public tasks: WritableSignal<TaskInterface[]> = signal<TaskInterface[]>([]);

  constructor(private _taskService: TaskService) {}

  private _listenAllTasks(): void {
    this._taskService
      .getAllTasks()
      .subscribe((tasks: TaskInterface[]): void => {
        this.tasks.set(tasks);
      });
  }

  ngOnInit(): void {
    this._listenAllTasks();
  }
}
