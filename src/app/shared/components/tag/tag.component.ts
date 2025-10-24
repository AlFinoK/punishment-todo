import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { TagColorType, TagValueType, TagVariantType } from './core';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss',
  imports: [TitleCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
  public tagVariant: InputSignal<TagVariantType> =
    input<TagVariantType>('primary');
  public tagColor: InputSignal<TagColorType> = input<TagColorType>('purple');
  public tagValue: InputSignal<TagValueType> =
    input<TagValueType>('productivity');
  public tagClick: OutputEmitterRef<void> = output<void>();

  protected onTagClick(): void {
    this.tagClick.emit();
  }

  constructor() {}
}
