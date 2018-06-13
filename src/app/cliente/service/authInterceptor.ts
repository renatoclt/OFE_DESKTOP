import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { OCP_APIM_SUBSCRIPTION_KEY } from 'app/utils/app.constants';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // req = req.clone({
    //   setHeaders: {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json',
    //     'Ocp-Apim-Subscription-Key': OCP_APIM_SUBSCRIPTION_KEY,
    //   }
    // });
    const authReq = req.clone({
      headers: req.headers.set('Ocp-Apim-Subscription-Key', OCP_APIM_SUBSCRIPTION_KEY)
    });
    return next.handle(authReq);
  }
}
