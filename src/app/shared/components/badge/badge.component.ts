import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
} from '@angular/core';

import { TitleCasePipe } from '@angular/common';
import { TaskTagValueEnum } from '@modules/task-module';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  imports: [TitleCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  protected readonly taskTagValueEnum: typeof TaskTagValueEnum =
    TaskTagValueEnum;
  public badgeValue: InputSignal<string> = input<string>(
    this.taskTagValueEnum.PRODUCTIVITY
  );

  constructor() {}
}
