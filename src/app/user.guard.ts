import { AuthService } from './services/auth.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
  constructor(private _auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const user = this._auth.getUser();
    const token = this._auth.getToken();
    if (!!user && !!token ) {
      if(user.type === 'user'){
        return true;
      }else
      this.router.navigate(["/admin-listings"])
      return false
    }
    this.router.navigate([""])
    return false;
  }
}
