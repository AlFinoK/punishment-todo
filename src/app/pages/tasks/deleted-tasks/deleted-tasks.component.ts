import { Component, signal, WritableSignal } from '@angular/core';

import { TaskInterface, TaskService } from '@modules/task-module';

import { SearchFilterComponent, PageTitleComponent } from '../common';

@Component({
  selector: 'app-deleted-tasks',
  templateUrl: './deleted-tasks.component.html',
  styleUrl: './deleted-tasks.component.scss',
  imports: [SearchFilterComponent, PageTitleComponent],
})
export class DeletedTasksComponent {
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
