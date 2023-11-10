import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from 'app/auth/service';
import { SecurityService } from 'app/services/security.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  /**
   *
   * @param {Router} _router
   * @param {AuthenticationService} _authenticationService
   */
  constructor(private _router: Router, private _securityService: SecurityService) {}

  // canActivate
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this._securityService.getCurrentUser();

    if (currentUser) {
      
        let rol = this._securityService.getRol();
      // check if route is restricted by role
      if (route.data.role && route.data.role.indexOf(rol) === -1) {
        // role not authorised so redirect to not-authorized page
        this._router.navigate(['/main/miscellaneous/not-authorized']);
            console.log("no tiene acceso a esta pagina")
        return false;
      }

      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this._router.navigate(['/pages/authentication/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
