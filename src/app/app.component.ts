import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionService } from './session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'codenames';

  displayName$ = this.sessionService.displayName$;

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.sessionService.getSession();
  }

  changeDisplayName() {
    this.sessionService.changeDisplayName();
  }
}
