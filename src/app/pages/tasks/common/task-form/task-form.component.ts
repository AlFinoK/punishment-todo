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
  FormArray,
  FormBuilder,
  FormControl,
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
  CheckboxComponent,
  AlertService,
} from '@shared/components';
import {
  CreateTaskInterface,
  TaskHelperService,
  TaskInterface,
  TaskService,
  TaskStatusEnum,
  TaskTagsInterface,
  TaskTagValueEnum,
} from '@modules/task-module';
import { tags } from '@shared/data';

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
    CheckboxComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormComponent implements OnInit {
  protected readonly taskTagValueEnum: typeof TaskTagValueEnum =
    TaskTagValueEnum;
  protected readonly taskStatusEnum: typeof TaskStatusEnum = TaskStatusEnum;
  protected readonly tags: TaskTagsInterface[] = tags;

  public task: InputSignal<TaskInterface | null> = input<TaskInterface | null>(
    null
  );
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

  get formTags(): FormArray {
    return this.form?.get('tags') as FormArray;
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _taskService: TaskService,
    private _alertService: AlertService,
    private _taskHelperService: TaskHelperService
  ) {}

  private _initForm(): void {
    this.form = this._formBuilder.group({
      name: [null, Validators.required],
      description: [null],
      isImportant: [false],
      endTime: [null],
      endDate: [this.currentDate, Validators.required],
      status: [this.taskStatusEnum.IN_PROGRESS],
      tags: this._formBuilder.array(
        this.tags.map((): boolean => false),
        Validators.required
      ),
    });
  }

  private _fillForm(task: TaskInterface): void {
    if (!this.form) return;

    this.form.patchValue({
      name: task.name,
      description: task.description,
      isImportant: task.isImportant,
      endTime: task.endTime,
      status: task.status,
      endDate: task.endDate,
    });

    const tagBooleans = this.tags.map(
      (tag) => task.tags?.includes(tag.value) ?? false
    );

    this.formTags.controls.forEach((control, idx) => {
      control.setValue(tagBooleans[idx]);
    });
  }

  private _initFillForm(): void {
    const task: TaskInterface | null = this.task();
    if (!task) return;
    this._fillForm(task);
  }

  protected onSubmit(): void {
    if (!this.form) return;

    if (!!this.task()?._id) {
      this.onSubmitEditTask();
    } else {
      this.onSubmitCreateTask();
    }
  }

  protected onSubmitCreateTask(): void {
    if (!this.form) return;

    const formValue: CreateTaskInterface = this.form.value;

    const selectedTags: any[] = this.formTags.controls
      .map((control, idx: number): string | null =>
        control.value ? this.tags[idx].value : null
      )
      .filter((tag: string | null): tag is string => tag !== null);

    formValue.tags = selectedTags;

    this.isLoadingSubmit.set(true);

    this._taskService
      .createTask(formValue)
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        (task: TaskInterface): void => {
          this.isLoadingSubmit.set(false);
          this._taskHelperService.createdTask$.next(task);
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
    if (!this.form) return;

    const formValue: CreateTaskInterface = this.form.value;

    const selectedTags: any[] = this.formTags.controls
      .map((control, idx: number): string | null =>
        control.value ? this.tags[idx].value : null
      )
      .filter((tag: string | null): tag is string => tag !== null);

    formValue.tags = selectedTags;

    this.isLoadingSubmit.set(true);

    this._taskService
      .editTask(formValue, this.task()?._id ?? '')
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        (task: TaskInterface): void => {
          this.isLoadingSubmit.set(false);
          this._taskHelperService.updatedTask$.next(task);
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
    this._initFillForm();
  }
}
