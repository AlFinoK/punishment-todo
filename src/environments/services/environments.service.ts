import { Observable, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentsHelperService } from './environments-helper.service';
import { EnvironmentsApiUrlInterface } from '../interfaces';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentsService {
  protected readonly date: DateConstructor = Date;
  constructor(
    private _http: HttpClient,
    private _environmentsHelperService: EnvironmentsHelperService
  ) {}

  public getEnvironmentsConfigs(): Observable<EnvironmentsApiUrlInterface> {
    const params: HttpParams = new HttpParams().append('_', this.date.now());

    return this._http
      .get<EnvironmentsApiUrlInterface>(environment.api_url, {
        params,
      })
      .pipe(
        tap((response: EnvironmentsApiUrlInterface): void => {
          this._environmentsHelperService.environmentsConfigs$.next(response);
        })
      );
  }
}
