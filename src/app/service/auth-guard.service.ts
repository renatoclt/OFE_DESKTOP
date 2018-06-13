import { Injectable } from '@angular/core';
import {Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {LoginService} from './login.service';
import {Observable} from 'rxjs/Observable';
@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {

  constructor(public auth: LoginService, public router: Router) {
  }

  canActivate(): boolean {
      return this.verificarLogeo();
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.verificarLogeo();
  }

  verificarLogeo(): boolean {
      const expira = Number(localStorage.getItem('expires'));
      const actual = new Date().getTime();
      const diferencia = expira - actual;

      setTimeout(
        () => {
          this.router.navigate(['/login']);
          return false;
        }, diferencia);
      return true;
  }
}