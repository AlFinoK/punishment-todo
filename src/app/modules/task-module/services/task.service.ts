import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { environment } from 'src/environments/environment';

import { TaskHelperService } from './task-helper.service';
import {
  TaskInterface,
  CreateTaskInterface,
  EditTaskInterface,
} from '../interfaces';
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

  public getAllTasks(): Observable<TaskInterface[]> {
    return this._http.get<TaskInterface[]>(`${environment.api_url}/tasks`);
  }

  public createTask(data: CreateTaskInterface): Observable<TaskInterface> {
    return this._http.post<TaskInterface>(`${environment.api_url}/tasks`, data);
  }

  public editTask(
    data: EditTaskInterface,
    id: string
  ): Observable<TaskInterface> {
    return this._http.patch<TaskInterface>(
      `${environment.api_url}/tasks/${id}`,
      data
    );
  }

  public deleteTaskById(id: string): Observable<TaskInterface> {
    return this._http.delete<TaskInterface>(
      `${environment.api_url}/tasks/${id}`
    );
  }

  public getTaskById(id: string): Observable<TaskInterface> {
    return this._http.get<TaskInterface>(`${environment.api_url}/tasks/${id}`);
  }

  public getTaskByStatus(status: string): Observable<any> {
    return this._http.get(`${environment.api_url}/tasks/status/${status}`);
  }
}
