import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService) { }

  // check if user is logged in or not
  canActivate(route, state: RouterStateSnapshot) {
    console.log('in CanActivate');
    if (this.authService.isLoggedIn()) { return true; }
    // else
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
