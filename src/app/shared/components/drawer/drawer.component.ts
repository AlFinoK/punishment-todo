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
  public isOpen: InputSignal<boolean> = input<boolean>(false);
  public closeDrawer: OutputEmitterRef<boolean> = output<boolean>();

  @ViewChild('drawerTemplate', { static: true })
  protected drawerTemplate: TemplateRef<unknown> | undefined;

  private bodyHost?: HTMLElement | null;

  constructor(
    private _renderer: Renderer2,
    private _viewContainerRef: ViewContainerRef
  ) {}

  private _createBodyContainer(): void {
    this.bodyHost = this._renderer.createElement('div');
    this._renderer.addClass(this.bodyHost, 'drawer-root');
    this._renderer.appendChild(document.body, this.bodyHost);
  }

  private _moveDrawerToBody(): void {
    if (!this.drawerTemplate || !this.bodyHost) return;

    const view = this.drawerTemplate.createEmbeddedView(null);
    this._viewContainerRef.insert(view);

    view.rootNodes.forEach((node) => {
      this._renderer.appendChild(this.bodyHost, node);
    });
  }

  private _removeBodyContainer(): void {
    if (this.bodyHost && document.body.contains(this.bodyHost)) {
      this._renderer.removeChild(document.body, this.bodyHost);
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
