import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { UserService } from 'app/core/user/user.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private userService: UserService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.authenticationService.userValue;
    const authenticated = this.authenticationService.isAuthenticated();

    if (!authenticated) {
      this.userService.emitUserAuthenticated(false);
      this.router.navigate(['authentication/login'], { queryParams: { redirectUrl: state.url } });
      return false;

    } else {

      // check if route is restricted by role
      if (route.data.roles && route.data.roles.indexOf(user.roles) === -1) {
        this.userService.emitUserAuthenticated(true);
        // role not authorised so redirect to home page
        this.router.navigate(['/property-search']).then(() => {
          window.location.reload();
        });
        return false;
      }

      this.userService.emitUserAuthenticated(true);
      return true;
    }
  }
}
