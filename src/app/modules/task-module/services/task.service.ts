import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { environment } from 'src/environments/environment';

import { TaskHelperService } from './task-helper.service';
import { TaskInterface, CreateTaskInterface } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(
    private _http: HttpClient,
    private _taskHelperService: TaskHelperService
  ) {}

  public getAllTasks(): Observable<TaskInterface[]> {
    this._taskHelperService.isLoadingTasks$.next(true);

    return this._http.get<TaskInterface[]>(`${environment.api_url}/tasks`).pipe(
      tap((tasks: TaskInterface[]): void => {
        this._taskHelperService.tasks$.next(tasks);
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

  public deleteTaskById(id: string) {
    this._taskHelperService.isLoadingTasks$.next(true);

    return this._http.delete(`${environment.api_url}/tasks/${id}`).pipe(
      tap((): void => {
        const currentTasks: TaskInterface[] =
          this._taskHelperService.tasks$.getValue();
        const updatedTasks: TaskInterface[] = currentTasks.filter(
          (task: TaskInterface): boolean => task._id !== id
        );

        this._taskHelperService.tasks$.next(updatedTasks);
        this._taskHelperService.isLoadingTasks$.next(false);
      }),
      catchError((error: HttpErrorResponse): never => {
        this._taskHelperService.isLoadingTasks$.next(false);
        throw error;
      })
    );
  }
}
