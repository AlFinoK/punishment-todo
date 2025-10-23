import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';

import { TagColorEnum } from './core/enum';
import { TagTypeEnum } from './core/enum/tag-type.enum';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
  protected readonly tagColorEnum: typeof TagColorEnum = TagColorEnum;
  protected readonly tagTypeEnum: typeof TagTypeEnum = TagTypeEnum;

  public tagColor: InputSignal<string> = input<string>(
    this.tagColorEnum.PURPLE
  );
  public tagType: InputSignal<string> = input<string>(
    this.tagTypeEnum.PRODUCTIVITY
  );
  public tagClick: OutputEmitterRef<void> = output<void>();

  onTagClick(): void {
    this.tagClick.emit();
  }

  constructor() {}
}
