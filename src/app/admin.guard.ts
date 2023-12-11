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
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private _auth: AuthService) {}
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
      if(user.type === 'admin'){
        return true;
      }else
      this.router.navigate(["/listings"])
      return false
    }
    this.router.navigate([""])
    return false;
  }
}
