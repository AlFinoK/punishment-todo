import { Component } from '@angular/core';

import {
  BadgeComponent,
  BadgeTypeEnum,
  ButtonComponent,
  ButtonSizeEnum,
  ButtonVariantEnum,
} from '@shared/ui-kit';
import { LucideAngularModule } from 'lucide-angular';

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

  constructor() {}
}
