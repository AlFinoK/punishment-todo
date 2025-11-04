import { TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { TaskHelperService, TaskTagsInterface } from '@modules/task-module';
import { tags } from '@shared/data';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss',
  imports: [TitleCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
  protected readonly tags: TaskTagsInterface[] = tags;

  public tag: InputSignal<TaskTagsInterface> = input<TaskTagsInterface>(
    this.tags[0]
  );
  public tagClick: OutputEmitterRef<void> = output<void>();

  get isActive(): boolean {
    const tag: TaskTagsInterface = this.tag();

    return this._taskHelperService.activeTags$.value.some(
      (activeTag: TaskTagsInterface): boolean => activeTag.value === tag.value
    );
  }

  constructor(private _taskHelperService: TaskHelperService) {}

  protected onTagClick(): void {
    this.tagClick.emit();
  }
}
