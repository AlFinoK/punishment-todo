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
        const filteredTasks: TaskInterface[] =
          this._taskHelperService.filterTasks(
            tasks,
            status,
            isImportant,
            excludeStatuses
          );

        switch (status) {
          case this.taskStatusEnum.DELETED:
            this._taskHelperService.deletedTasks$.next(filteredTasks);
            break;
          case this.taskStatusEnum.FINISHED:
            this._taskHelperService.finishedTasks$.next(filteredTasks);
            break;
          default:
            this._taskHelperService.allTasks$.next(filteredTasks);
            break;
        }

        this._taskHelperService.isLoadingTasks$.next(false);
      }),
      catchError((error: HttpErrorResponse): never => {
        this._taskHelperService.isLoadingTasks$.next(false);
        throw error;
      })
    );
  }

  public createTask(data: CreateTaskInterface): Observable<TaskInterface> {
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
