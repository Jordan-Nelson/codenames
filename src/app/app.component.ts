import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CopySnackBarComponent } from './copy-snack-bar/copy-snack-bar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'codenames';

  constructor(private _snackBar: MatSnackBar) {}

  copy() {
    var dummy = document.createElement('input'),
      text = window.location.href;

    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);

    this._snackBar.openFromComponent(CopySnackBarComponent, {
      duration: 2000,
    });
  }
}
