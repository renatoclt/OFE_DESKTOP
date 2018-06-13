import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {LoginService} from './login.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.verificarLogeo();
  }
  constructor(public auth: LoginService, public router: Router) {}
  canActivate(): boolean {
   return this.verificarLogeo();
  }

  verificarLogeo(): boolean {
    const expira = Number(localStorage.getItem('expires'));
    const actual = new Date().getTime();
    const diferencia = 1000000;

    setTimeout(
      () => {
        //this.router.navigate(['/login']);
        return false;
      }, diferencia);
    return true;
  }
}
