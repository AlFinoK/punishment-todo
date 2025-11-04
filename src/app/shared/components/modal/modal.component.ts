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
  EmbeddedViewRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent implements OnInit, OnDestroy {
  public isOpen: InputSignal<boolean> = input<boolean>(false);
  public closeModal: OutputEmitterRef<boolean> = output<boolean>();

  @ViewChild('modalTemplate', { static: true })
  protected modalTemplate: TemplateRef<unknown> | undefined;

  private _bodyHost?: HTMLElement | null;

  constructor(
    private _renderer: Renderer2,
    private _viewContainerRef: ViewContainerRef
  ) {}

  private _createBodyContainer(): void {
    this._bodyHost = this._renderer.createElement('div');
    this._renderer.addClass(this._bodyHost, 'modal-root');
    this._renderer.appendChild(document.body, this._bodyHost);
  }

  private _moveModalToBody(): void {
    if (!this.modalTemplate || !this._bodyHost) return;

    const view: EmbeddedViewRef<unknown> =
      this.modalTemplate.createEmbeddedView(null);
    this._viewContainerRef.insert(view);

    view.rootNodes.forEach((node: Node): void => {
      this._renderer.appendChild(this._bodyHost, node);
    });
  }

  private _removeBodyContainer(): void {
    if (this._bodyHost && document.body.contains(this._bodyHost)) {
      this._renderer.removeChild(document.body, this._bodyHost);
    }
  }

  protected onCloseModal(): void {
    this.closeModal.emit(false);
  }

  ngOnInit(): void {
    this._createBodyContainer();
    this._moveModalToBody();
  }

  ngOnDestroy(): void {
    this._removeBodyContainer();
  }
}
