import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TaskCardComponent } from '../task-card';
import { TaskInterface } from '../task-card/core';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss',
  imports: [TaskCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksListComponent {
  protected tasks: TaskInterface[] = [];
}
