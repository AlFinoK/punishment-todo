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
import { TaskTagValueEnum } from '@modules/task-module';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss',
  imports: [TitleCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
  protected readonly taskTagValueEnum: typeof TaskTagValueEnum =
    TaskTagValueEnum;

  public tagVariant: InputSignal<TagVariantType> =
    input<TagVariantType>('primary');
  public tagValue: InputSignal<TaskTagValueEnum> = input<TaskTagValueEnum>(
    this.taskTagValueEnum.PRODUCTIVITY
  );
  public tagClick: OutputEmitterRef<void> = output<void>();

  protected onTagClick(): void {
    this.tagClick.emit();
  }

  constructor() {}
}
