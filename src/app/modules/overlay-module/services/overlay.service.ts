import { ComponentRef } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, Type } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';

@Injectable({ providedIn: 'root' })
export class OverlayService {
  constructor(private _overlay: Overlay, private _injector: Injector) {}

  public open<T>(
    component: Type<T>,
    config?: OverlayConfig
  ): { overlayRef: OverlayRef; componentRef: ComponentRef<T> } {
    const overlayRef: OverlayRef = this._overlay.create(config);
    const portal: ComponentPortal<T> = new ComponentPortal(
      component,
      null,
      this._injector
    );
    const componentRef: ComponentRef<T> = overlayRef.attach(portal);
    return { overlayRef, componentRef };
  }

  public close(overlayRef: OverlayRef): void {
    overlayRef.detach();
    overlayRef.dispose();
  }
}
