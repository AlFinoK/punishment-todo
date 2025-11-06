import { LucideAngularModule } from 'lucide-angular';
import {
  Component,
  input,
  InputSignal,
  signal,
  WritableSignal,
} from '@angular/core';

import {
  TaskHelperService,
  TaskInterface,
  TaskService,
  TaskStatusEnum,
} from '@modules/task-module';
import {
  ButtonComponent,
  BadgeComponent,
  DrawerComponent,
  AlertService,
  CheckboxComponent,
  ModalComponent,
} from '@shared/components';

import { TaskFormComponent } from '../task-form';
import { DndHandleDirective } from 'ngx-drag-drop';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
  imports: [
    ButtonComponent,
    LucideAngularModule,
    BadgeComponent,
    TaskFormComponent,
    ModalComponent,
    CheckboxComponent,
    DrawerComponent,
    DndHandleDirective,
  ],
})
export class TaskCardComponent {
  protected readonly taskStatusEnum: typeof TaskStatusEnum = TaskStatusEnum;

  public task: InputSignal<TaskInterface | null> = input<TaskInterface | null>(
    null
  );

  public isOpenDrawer: WritableSignal<boolean> = signal<boolean>(false);
  public isOpenModal: WritableSignal<boolean> = signal<boolean>(false);

  constructor(
    private _taskService: TaskService,
    private _alertService: AlertService,
    private _taskHelperService: TaskHelperService
  ) {}

  protected onCheckbox(): void {}

  protected openModal(): void {
    this.isOpenModal.set(true);
  }

  protected closeModal(): void {
    this.isOpenModal.set(false);
  }

  protected openDrawer(): void {
    this.isOpenDrawer.set(true);
  }

  protected closeDrawer(): void {
    this.isOpenDrawer.set(false);
  }

  protected onDeleteTask(): void {
    const task: TaskInterface | null = this.task();
    if (!task) return;

    this._taskService.deleteTaskById(task._id).subscribe((): void => {
      this.closeModal();
      this._taskHelperService.deletedTask$.next(task);
      this._alertService.open('The task successfully deleted', {
        variant: 'success',
      }),
        (): void => {
          this._alertService.open('Failed to delete task', {
            variant: 'error',
          });
        };
    });
  }
}
