import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
} from '@angular/core';

import type { TaskFeaturesInterface } from '@pages/tasks';

import { BadgeValueType } from './core';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  protected readonly badgeValueType: BadgeValueType = 'productivity';

  public badgeValue: InputSignal<TaskFeaturesInterface> =
    input<TaskFeaturesInterface>({ feature: 'productivity' });

  constructor() {}
}
