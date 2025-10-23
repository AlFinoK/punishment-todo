import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ButtonComponent } from '@shared/components';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
  imports: [ButtonComponent],
})
export class NotFoundComponent {
  constructor(private _router: Router) {}

  protected goBack(): void {
    this._router.navigate(['tasks']);
  }
}
