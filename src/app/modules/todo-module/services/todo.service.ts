import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvironmentsHelperService } from 'src/environments';
import { TodoInterface } from '../interfaces/todo.interface';
import { CreateTodoRequestInterface } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  constructor(
    private _http: HttpClient,
    private _environmentsHelperService: EnvironmentsHelperService
  ) {}

  public getAllTodo(): Observable<TodoInterface[]> {
    return this._http.get<TodoInterface[]>(
      `${this._environmentsHelperService.apiUrl}/api/tasks`
    );
  }

  public requestCreateTodo(data: CreateTodoRequestInterface): Observable<any> {
    return this._http.post<CreateTodoRequestInterface>(
      `${this._environmentsHelperService.apiUrl}/api/tasks`,
      data
    );
  }
}
