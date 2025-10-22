import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
} from '@angular/core';

import { BadgeTypeEnum } from './core';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  protected readonly badgeTypeEnum: typeof BadgeTypeEnum = BadgeTypeEnum;

  public badgeType: InputSignal<string> = input<string>(
    this.badgeTypeEnum.PRODUCTIVITY
  );

  constructor() {}
}
