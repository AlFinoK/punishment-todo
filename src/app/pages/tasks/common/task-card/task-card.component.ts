import { LucideAngularModule } from 'lucide-angular';
import { Component, input, InputSignal } from '@angular/core';

import { BadgeComponent, ButtonComponent } from '@shared/components';

import { TaskInterface } from './core';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
  imports: [BadgeComponent, ButtonComponent, LucideAngularModule],
})
export class TaskCardComponent {
  public task: InputSignal<TaskInterface | null> = input<TaskInterface | null>(
    null
  );

  constructor() {}
}
