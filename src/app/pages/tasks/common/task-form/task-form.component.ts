import {
  Component,
  ChangeDetectionStrategy,
  signal,
  output,
  OutputEmitterRef,
  WritableSignal,
  OnInit,
  InputSignal,
  input,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TitleCasePipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { HttpErrorResponse } from '@angular/common/http';
import { DpDatePickerModule, IDatePickerConfig } from 'ng2-date-picker';

import {
  ButtonComponent,
  InputComponent,
  TextareaComponent,
} from '@shared/components';
import {
  CreateTaskInterface,
  TaskService,
  TaskTagsInterface,
  TaskTagValueEnum,
} from '@modules/task-module';
import { tags } from '@shared/data';
import { AlertService } from '@shared/components/alert/core';

import { TaskFormActionType } from './core';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
  imports: [
    LucideAngularModule,
    ButtonComponent,
    DpDatePickerModule,
    ReactiveFormsModule,
    TitleCasePipe,
    InputComponent,
    TextareaComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormComponent implements OnInit {
  protected readonly taskTagValueEnum: typeof TaskTagValueEnum =
    TaskTagValueEnum;
  protected readonly tags: TaskTagsInterface[] = tags;

  public action: InputSignal<TaskFormActionType> =
    input<TaskFormActionType>('create');
  public formSubmitted: OutputEmitterRef<void> = output<void>();

  private _destroy$: Subject<void> = new Subject<void>();

  protected isLoadingSubmit: WritableSignal<boolean> = signal(false);
  protected currentDate: string = new Date().toISOString().split('T')[0];
  protected form: FormGroup | null = null;

  protected datePickerConfig: IDatePickerConfig = {
    format: 'YYYY-MM-DD',
    firstDayOfWeek: 'mo',
    min: this.currentDate,
    showNearMonthDays: false,
  };

  protected get getButtonTextByAction() {
    return this.isLoadingSubmit()
      ? this.action() === 'create'
        ? 'Saving...'
        : 'Editing...'
      : this.action() === 'create'
      ? 'Add'
      : 'Edit';
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _taskService: TaskService,
    private _alertService: AlertService
  ) {}

  private _initForm(): void {
    this.form = this._formBuilder.group({
      name: [null, Validators.required],
      description: [null],
      isImportant: [false],
      endTime: [null, Validators.required],
      endDate: [this.currentDate, Validators.required],
      tags: [this.taskTagValueEnum, Validators.required],
    });
  }

  protected onSubmit(): void {
    if ('create' === this.action()) {
      this.onSubmitCreateTask();
    } else {
      this.onSubmitEditTask();
    }
  }

  protected onSubmitCreateTask(): void {
    const formValue: CreateTaskInterface = this.form?.value;

    this.isLoadingSubmit.set(true);

    this._taskService
      .createTask(formValue)
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        (): void => {
          this.isLoadingSubmit.set(false);
          this._alertService
            .open('The task was successfully added!', { variant: 'success' })
            .subscribe();

          this.formSubmitted.emit();
        },
        (error: HttpErrorResponse): void => {
          const errorMsg: string = error.error.message;
          this._alertService.open(errorMsg, { variant: 'error' }).subscribe();
          this.isLoadingSubmit.set(false);
        }
      );
  }

  protected onSubmitEditTask(): void {
    const formValue: CreateTaskInterface = this.form?.value;

    this.isLoadingSubmit.set(true);

    this._taskService
      .editTask(formValue, '123')
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        (): void => {
          this.isLoadingSubmit.set(false);
          this._alertService
            .open('The task was successfully edited!', { variant: 'success' })
            .subscribe();

          this.formSubmitted.emit();
        },
        (error: HttpErrorResponse): void => {
          const errorMsg: string = error.error.message;
          this._alertService.open(errorMsg, { variant: 'error' }).subscribe();
          this.isLoadingSubmit.set(false);
        }
      );
  }

  ngOnInit(): void {
    this._initForm();
  }
}
