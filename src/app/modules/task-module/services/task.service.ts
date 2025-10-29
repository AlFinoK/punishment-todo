import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { environment } from 'src/environments/environment';

import { TaskHelperService } from './task-helper.service';
import { TaskInterface, CreateTaskInterface } from '../interfaces';
import { TaskStatusEnum } from '../enums';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  protected readonly taskStatusEnum: typeof TaskStatusEnum = TaskStatusEnum;

  constructor(
    private _http: HttpClient,
    private _taskHelperService: TaskHelperService
  ) {}

  public getAllTasks(
    status: TaskStatusEnum = this.taskStatusEnum.IN_PROGRESS,
    isImportant?: boolean,
    excludeStatuses: TaskStatusEnum[] = []
  ): Observable<TaskInterface[]> {
    this._taskHelperService.isLoadingTasks$.next(true);

    return this._http.get<TaskInterface[]>(`${environment.api_url}/tasks`).pipe(
      tap((tasks: TaskInterface[]): void => {
        const deletedStatus: boolean = status === this.taskStatusEnum.DELETED;
        const finishedStatus: boolean = status === this.taskStatusEnum.FINISHED;

        const filteredTasks: TaskInterface[] = tasks.filter(
          (task: TaskInterface): boolean =>
            !excludeStatuses.includes(task.status)
        );

        if (isImportant)
          this._taskHelperService.importantTasks$.next(
            filteredTasks.filter(
              (task: TaskInterface): boolean => task.isImportant
            )
          );
        if (deletedStatus)
          this._taskHelperService.deletedTasks$.next(
            filteredTasks.filter(
              (task: TaskInterface): boolean =>
                task.status === this.taskStatusEnum.DELETED
            )
          );
        if (finishedStatus)
          this._taskHelperService.finishedTasks$.next(
            filteredTasks.filter(
              (task: TaskInterface): boolean =>
                task.status === this.taskStatusEnum.FINISHED
            )
          );

        this._taskHelperService.isLoadingTasks$.next(false);
      }),
      catchError((error: HttpErrorResponse): never => {
        this._taskHelperService.isLoadingTasks$.next(false);
        throw error;
      })
    );
  }

  public createTask(data: CreateTaskInterface): Observable<any> {
    this._taskHelperService.isLoadingTasks$.next(true);

    return this._http
      .post<TaskInterface>(`${environment.api_url}/tasks`, data)
      .pipe(
        tap((newTask: TaskInterface): void => {
          this._taskHelperService.updateTasks(newTask);
          this._taskHelperService.isLoadingTasks$.next(false);
        }),
        catchError((error: HttpErrorResponse): never => {
          this._taskHelperService.isLoadingTasks$.next(false);
          throw error;
        })
      );
  }

  public deleteTaskById(id: string): Observable<any> {
    this._taskHelperService.isLoadingTasks$.next(true);

    return this._http.delete(`${environment.api_url}/tasks/${id}`).pipe(
      tap((): void => {
        const currentTasks: TaskInterface[] =
          this._taskHelperService.allTasks$.getValue();
        const updatedTasks: TaskInterface[] = currentTasks.filter(
          (task: TaskInterface): boolean => task._id !== id
        );

        this._taskHelperService.allTasks$.next(updatedTasks);
        this._taskHelperService.isLoadingTasks$.next(false);
      }),
      catchError((error: HttpErrorResponse): never => {
        this._taskHelperService.isLoadingTasks$.next(false);
        throw error;
      })
    );
  }
}
