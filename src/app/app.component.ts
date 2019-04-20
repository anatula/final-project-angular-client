import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Mobile data market Place';

  constructor(
    public authService: AuthService,
    public router: Router,
  ) { }

  logout() {
    console.log('Log out');
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
