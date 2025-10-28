import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
  OnDestroy,
  OnInit,
  output,
  OutputEmitterRef,
  signal,
  WritableSignal,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { FormBuilder, FormGroup } from '@angular/forms';

import { TaskInterface, TaskService } from '@modules/task-module';
import { DrawerComponent, ButtonComponent } from '@shared/components';

@Component({
  selector: 'app-task-drawer',
  templateUrl: './task-drawer.component.html',
  styleUrl: './task-drawer.component.scss',
  imports: [LucideAngularModule, DrawerComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDrawerComponent implements OnInit, OnDestroy {
  public isOpenDrawer: InputSignal<boolean> = input<boolean>(false);
  public toggleDrawer: OutputEmitterRef<boolean> = output<boolean>();

  private _destroy$: Subject<void> = new Subject<void>();

  protected form: FormGroup | null = null;
  protected isLoading: WritableSignal<boolean> = signal<boolean>(false);

  constructor(
    private _taskService: TaskService,
    private _formBuilder: FormBuilder
  ) {}

  private _initForm(): void {
    this.form = this._formBuilder.group({});
  }

  protected onToggleDrawer(event: boolean): void {
    this.toggleDrawer.emit(event);
  }

  protected onSubmit(): void {
    if (this.form?.invalid) return;

    const formValue: TaskInterface = this.form?.value;
    this.isLoading.set(true);
    this._taskService
      .createTask(formValue)
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        (response: TaskInterface): void => {
          this.isLoading.set(false);
        },
        (): void => {
          this.isLoading.set(false);
        }
      );
  }

  ngOnInit(): void {
    this._initForm();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
