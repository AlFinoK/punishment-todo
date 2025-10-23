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
  protected tasks: TaskInterface[] = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      isImportant: false,
      isFinished: false,
      created_at: '2023-01-01',
      features: [],
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'Description 2',
      isImportant: false,
      isFinished: false,
      created_at: '2023-01-01',
      features: [],
    },
  ];
}
