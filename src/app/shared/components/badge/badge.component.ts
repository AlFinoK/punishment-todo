import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
} from '@angular/core';

import { BadgeValueType } from './core';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  imports: [TitleCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  public badgeValue: InputSignal<BadgeValueType> =
    input<BadgeValueType>('productivity');

  constructor() {}
}
