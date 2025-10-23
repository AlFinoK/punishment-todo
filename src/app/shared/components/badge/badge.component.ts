import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
} from '@angular/core';

import type { TaskFeaturesInterface } from '@pages/tasks';

import { BadgeTypeEnum } from './core';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  protected readonly badgeTypeEnum: typeof BadgeTypeEnum = BadgeTypeEnum;

  public badgeType: InputSignal<TaskFeaturesInterface> =
    input<TaskFeaturesInterface>({
      feature: this.badgeTypeEnum.PRODUCTIVITY,
    });

  constructor() {}
}
