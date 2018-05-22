import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Usuario} from '../../../model/usuario';


export class TokenInterceptorService implements HttpInterceptor {

  public usuario: Usuario;
  public access_token;
  public token_type;
  public ocp_apim_subscription_key;
  public origen_datos;
  public tipo_empresa;
  public org_id;

  constructor() {
    this.usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    this.access_token = localStorage.getItem('access_token');
    this.token_type = 'Bearer';
    this.ocp_apim_subscription_key = localStorage.getItem('Ocp_Apim_Subscription_Key');
    this.origen_datos = 'PEB2M';
    this.tipo_empresa = this.usuario.tipo_empresa;
    this.org_id = this.usuario.org_id;
  }



  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {
        Authorization: this.token_type + ' ' + this.access_token,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Ocp-Apim-Subscription-Key': this.ocp_apim_subscription_key,
        origen_datos: this.origen_datos,
        tipo_empresa: this.tipo_empresa,
        org_id: this.org_id
      }
    });
    return next.handle(req);
  }

}
