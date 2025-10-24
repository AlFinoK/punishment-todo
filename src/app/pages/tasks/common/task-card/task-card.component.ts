import { LucideAngularModule } from 'lucide-angular';
import { Component, input, InputSignal } from '@angular/core';

import { ButtonComponent } from '@shared/components';
import { TodoInterface } from 'src/app/modules/todo-module';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
  imports: [ButtonComponent, LucideAngularModule],
})
export class TaskCardComponent {
  public task: InputSignal<TodoInterface | null> = input<TodoInterface | null>(
    null
  );

  constructor() {}
}
