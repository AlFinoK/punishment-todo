import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

import { EnvironmentsApiUrlInterface } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentsHelperService {
  public environmentsConfigs$: BehaviorSubject<EnvironmentsApiUrlInterface | null> =
    new BehaviorSubject<EnvironmentsApiUrlInterface | null>(null);

  get apiUrl(): string | null {
    return this.environmentsConfigs$.getValue()?.api_url ?? null;
  }

  constructor() {}
}
