import { ComponentRef } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, Type } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';

@Injectable({ providedIn: 'root' })
export class OverlayService {
  constructor(private overlay: Overlay, private injector: Injector) {}

  public open<T>(
    component: Type<T>,
    config?: OverlayConfig
  ): { overlayRef: OverlayRef; componentRef: ComponentRef<T> } {
    const overlayRef = this.overlay.create(config);
    const portal = new ComponentPortal(component, null, this.injector);
    const componentRef = overlayRef.attach(portal);
    return { overlayRef, componentRef };
  }

  public close(overlayRef: OverlayRef): void {
    overlayRef.detach();
    overlayRef.dispose();
  }
}
