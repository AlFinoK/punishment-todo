import { LucideAngularModule } from 'lucide-angular';
import { Component, input, InputSignal } from '@angular/core';

import {
  BadgeComponent,
  BadgeTypeEnum,
  ButtonComponent,
  ButtonSizeEnum,
  ButtonVariantEnum,
} from '@shared/components';

import { TaskInterface } from './core';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
  imports: [BadgeComponent, ButtonComponent, LucideAngularModule],
})
export class TaskCardComponent {
  protected readonly badgeTypeEnum: typeof BadgeTypeEnum = BadgeTypeEnum;
  protected readonly buttonSizeEnum: typeof ButtonSizeEnum = ButtonSizeEnum;
  protected readonly buttonVariantEnum: typeof ButtonVariantEnum =
    ButtonVariantEnum;

  public task: InputSignal<TaskInterface | null> = input<TaskInterface | null>(
    null
  );

  constructor() {}
}
