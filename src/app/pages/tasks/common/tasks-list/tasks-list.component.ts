import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
  signal,
  WritableSignal,
} from '@angular/core';
import { DndDropEvent, DndModule } from 'ngx-drag-drop';

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

  public localTasks: WritableSignal<TaskInterface[]> = signal<TaskInterface[]>(
    []
  );

  constructor() {}

  public refreshLocalTasks(): void {
    const tasks: TaskInterface[] | null = this.tasks();
    this.localTasks.set(tasks ? [...tasks] : []);
  }

  protected onTaskDrop(event: DndDropEvent): void {
    const localTasks: TaskInterface[] = this.localTasks();
    if (!localTasks || !localTasks.length) return;

    const draggedTask: TaskInterface = event.data;
    const fromIndex: number = localTasks.findIndex(
      (task: TaskInterface): boolean => task._id === draggedTask._id
    );
    const toIndex =
      event.index !== undefined ? event.index : localTasks.length - 1;

    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;

    const updatedLocalTasks: TaskInterface[] = [...localTasks];
    const [moved]: TaskInterface[] = updatedLocalTasks.splice(fromIndex, 1);
    updatedLocalTasks.splice(toIndex, 0, moved);

    this.localTasks.set(updatedLocalTasks);
  }

  ngOnInit(): void {
    this.refreshLocalTasks();
  }
}
