import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

import { tags } from '@shared/data';

import { TaskTagsInterface } from '../interfaces';
import { TaskStatusEnum, TaskTagValueEnum } from '../enums';

@Injectable({
  providedIn: 'root',
})
export class TaskHelperService {
  protected readonly tags: TaskTagsInterface[] = tags;
  protected readonly taskStatusEnum: typeof TaskStatusEnum = TaskStatusEnum;
  protected readonly taskTagValueEnum: typeof TaskTagValueEnum =
    TaskTagValueEnum;

  public activeTags$: BehaviorSubject<TaskTagsInterface[]> =
    new BehaviorSubject<TaskTagsInterface[]>([]);

  constructor() {}

  public filterTasksByTag(tag: TaskTagsInterface): void {
    const activeTags: TaskTagsInterface[] = this.activeTags$.getValue();
    const index: number = activeTags.findIndex(
      (activeTag) => activeTag.value === tag.value
    );

    if (index === -1) {
      activeTags.push(tag);
    } else {
      activeTags.splice(index, 1);
    }

    this.activeTags$.next([...activeTags]);
  }
}
