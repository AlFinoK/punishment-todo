import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
  signal,
  WritableSignal,
} from '@angular/core';
import { DndModule, DndDropEvent } from 'ngx-drag-drop';

import { TaskInterface } from '@modules/task-module';

import { TaskCardComponent } from '../task-card';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss',
  imports: [TaskCardComponent, DndModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksListComponent {
  public tasks: InputSignal<TaskInterface[] | null> = input<
    TaskInterface[] | null
  >(null);
  protected localTasks: WritableSignal<TaskInterface[]> = signal<
    TaskInterface[]
  >([]);

  constructor() {}

  private _initTasks(): void {
    const tasks: TaskInterface[] | null = this.tasks();
    if (tasks) this.localTasks.set([...tasks]);
  }

  protected onTaskDrop(event: DndDropEvent, targetTask: TaskInterface): void {
    const tasks: TaskInterface[] = [...this.localTasks()];
    const draggedTask: TaskInterface = event.data;

    if (!draggedTask) return;

    const fromIndex: number = tasks.findIndex(
      (task: TaskInterface): boolean => task._id === draggedTask._id
    );
    if (fromIndex !== -1) tasks.splice(fromIndex, 1);

    if (targetTask) {
      const toIndex: number = tasks.findIndex(
        (task: TaskInterface): boolean => task._id === targetTask._id
      );

      tasks.splice(toIndex, 0, draggedTask);
    } else {
      tasks.push(draggedTask);
    }

    this.localTasks.set(tasks);
  }

  ngOnInit(): void {
    this._initTasks();
  }
}
