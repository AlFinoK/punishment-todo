import { Injectable } from '@angular/core';
import { OverlayConfig } from '@angular/cdk/overlay';
import { Observable, of } from 'rxjs';
import { AlertVariantType } from '../types';
import { OverlayService } from '@modules/overlay-module';
import { AlertComponent } from '../../alert.component';

interface AlertOptions {
  variant?: AlertVariantType;
  autoClose?: number;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  constructor(private overlayService: OverlayService) {}

  open(message: string, options?: AlertOptions): Observable<void> {
    const config: OverlayConfig = {
      hasBackdrop: false,
      panelClass: 'alert-overlay-panel',
      positionStrategy: this.overlayService['overlay']
        .position()
        .global()
        .top('20px')
        .centerHorizontally(),
    };

    const { overlayRef, componentRef } = this.overlayService.open(
      AlertComponent,
      config
    );

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
