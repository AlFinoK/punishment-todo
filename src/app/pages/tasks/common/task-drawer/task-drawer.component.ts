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
import { LucideAngularModule } from 'lucide-angular';

import { DrawerComponent, ButtonComponent } from '@shared/components';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TodoService } from 'src/app/modules/todo-module/services/todo.service';
import { TodoInterface } from 'src/app/modules/todo-module';

@Component({
  selector: 'app-task-drawer',
  templateUrl: './task-drawer.component.html',
  styleUrl: './task-drawer.component.scss',
  imports: [LucideAngularModule, DrawerComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDrawerComponent implements OnInit, OnDestroy {
  public onDrawerToggle: OutputEmitterRef<boolean> = output<boolean>();

  public isOpenDrawer: InputSignal<boolean> = input<boolean>(false);

  private _destroy$: Subject<void> = new Subject<void>();

  protected form: FormGroup | null = null;
  protected isLoading: WritableSignal<boolean> = signal(false);

  constructor(
    private _formBuilder: FormBuilder,
    private _todoService: TodoService
  ) {}

  private _initForm(): void {
    this.form = this._formBuilder.group({});
  }

  protected onDrawerToggles(event: boolean): void {
    // rename in the future
    this.onDrawerToggle.emit(event);
  }

  protected onSubmit(): void {
    if (this.form?.invalid) return;

    const formValue: TodoInterface = this.form?.value;
    this.isLoading.set(true);
    this._todoService
      .requestCreateTodo(formValue)
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        (response: TodoInterface): void => {
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
