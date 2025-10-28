import { Component, signal, WritableSignal } from '@angular/core';

import { TaskInterface, TaskService } from '@modules/task-module';

import { SearchFilterComponent, PageTitleComponent } from '../common';

@Component({
  selector: 'app-finished-tasks',
  templateUrl: './finished-tasks.component.html',
  styleUrl: './finished-tasks.component.scss',
  imports: [SearchFilterComponent, PageTitleComponent],
})
export class FinishedTasksComponent {
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
