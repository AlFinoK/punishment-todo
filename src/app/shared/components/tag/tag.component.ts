import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { TagColorType, TagValueType } from './core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
  protected readonly tagColorType: TagColorType = 'purple';
  protected readonly tagValueType: TagValueType = 'productivity';

  public tagColor: InputSignal<TagColorType> = input<TagColorType>('purple');
  public tagValue: InputSignal<TagValueType> =
    input<TagValueType>('productivity');
  public tagClick: OutputEmitterRef<void> = output<void>();

  onTagClick(): void {
    this.tagClick.emit();
  }

  constructor() {}
}
