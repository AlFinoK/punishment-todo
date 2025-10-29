import { Observable, of } from 'rxjs';
import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentRef, Injectable } from '@angular/core';

import { AlertComponent } from '@shared/components/alert';
import { OverlayService } from '@modules/overlay-module';

import { AlertVariantType } from '../types';

interface AlertOptions {
  variant: AlertVariantType;
  autoClose?: number;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  constructor(private overlayService: OverlayService) {}

  open(message: string, options?: AlertOptions): Observable<void> {
    const {
      overlayRef,
      componentRef,
    }: { overlayRef: OverlayRef; componentRef: ComponentRef<AlertComponent> } =
      this.overlayService.open(AlertComponent);

    componentRef.instance.show(
      message,
      options?.variant || 'success',
      options?.autoClose || 5000
    );

    setTimeout(
      (): void => this.overlayService.close(overlayRef),
      options?.autoClose || 5000
    );

    return of();
  }
}
