import {
  ChangeDetectionStrategy,
  Component,
  InputSignal,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  input,
  output,
  OutputEmitterRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
  imports: [CommonModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerComponent implements OnInit, OnDestroy {
  public isOpen: InputSignal<boolean> = input(false);
  public closeDrawer: OutputEmitterRef<boolean> = output();

  @ViewChild('drawerTemplate', { static: true })
  drawerTemplate: TemplateRef<unknown> | undefined;

  private renderer: Renderer2 = inject(Renderer2);
  private viewContainerRef: ViewContainerRef = inject(ViewContainerRef);

  private bodyHost?: HTMLElement;

  private _createBodyContainer(): void {
    this.bodyHost = this.renderer.createElement('div');
    this.renderer.addClass(this.bodyHost, 'drawer-root');
    this.renderer.appendChild(document.body, this.bodyHost);
  }

  private _moveDrawerToBody(): void {
    if (!this.drawerTemplate || !this.bodyHost) return;

    const view = this.drawerTemplate.createEmbeddedView(null);
    this.viewContainerRef.insert(view);

    view.rootNodes.forEach((node) => {
      this.renderer.appendChild(this.bodyHost, node);
    });
  }

  private _removeBodyContainer(): void {
    if (this.bodyHost && document.body.contains(this.bodyHost)) {
      this.renderer.removeChild(document.body, this.bodyHost);
    }
  }

  protected onCloseDrawer(): void {
    this.closeDrawer.emit(false);
  }

  ngOnInit(): void {
    this._createBodyContainer();
    this._moveDrawerToBody();
  }

  ngOnDestroy(): void {
    this._removeBodyContainer();
  }
}
