import {
  ChangeDetectionStrategy,
  Component,
  InputSignal,
  WritableSignal,
  signal,
  computed,
  input,
  OnInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DndModule, DndDropEvent } from 'ngx-drag-drop';

import {
  TaskHelperService,
  TaskInterface,
  TaskStatusEnum,
  TaskTagsInterface,
} from '@modules/task-module';

import { TaskCardComponent } from '../task-card';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss',
  imports: [TaskCardComponent, DndModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksListComponent implements OnInit, OnChanges, OnDestroy {
  protected readonly taskStatusEnum: typeof TaskStatusEnum = TaskStatusEnum;

  /** Входящие задачи от родителя (MyTasksComponent) */
  public tasks: InputSignal<TaskInterface[]> = input<TaskInterface[]>([]);

  /** Локальная копия задач для Drag’n’Drop и фильтрации */
  protected localTasks: WritableSignal<TaskInterface[]> = signal<
    TaskInterface[]
  >([]);

  /** Активные теги */
  private activeTags: WritableSignal<TaskTagsInterface[]> = signal<
    TaskTagsInterface[]
  >([]);

  private readonly _destroy$ = new Subject<void>();

  /** Фильтрация */
  protected filteredTasks = computed(() => {
    const all = this.localTasks();
    const tags = this.activeTags();
    if (!tags.length) return all;

    const tagValues = tags.map((t) => t.value);
    return all.filter((task) =>
      task.tags.some((tag) => tagValues.includes(tag))
    );
  });

  constructor(private readonly _taskHelperService: TaskHelperService) {}

  ngOnInit(): void {
    this.localTasks.set(this.tasks());

    this._taskHelperService.activeTags$
      .pipe(takeUntil(this._destroy$))
      .subscribe((tags) => this.activeTags.set(tags));
  }

  /** 🔹 Реакция на изменение входных задач */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tasks']) {
      this.localTasks.set(this.tasks());
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  protected onTaskDrop(event: DndDropEvent, targetTask: TaskInterface): void {
    const tasks = [...this.localTasks()];
    const dragged = event.data as TaskInterface;
    if (!dragged) return;

    const fromIndex = tasks.findIndex((t) => t._id === dragged._id);
    if (fromIndex !== -1) tasks.splice(fromIndex, 1);

    if (targetTask) {
      const toIndex = tasks.findIndex((t) => t._id === targetTask._id);
      tasks.splice(toIndex, 0, dragged);
    } else {
      tasks.push(dragged);
    }

    this.localTasks.set(tasks);
  }
}
