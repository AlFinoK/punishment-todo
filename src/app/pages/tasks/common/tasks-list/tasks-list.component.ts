import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
} from '@angular/core';

import { TaskInterface } from '@modules/task-module';

import { TaskCardComponent } from '../task-card';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss',
  imports: [TaskCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksListComponent {
  public tasks: InputSignal<TaskInterface[] | null> = input<
    TaskInterface[] | null
  >(null);

  constructor() {}
}
