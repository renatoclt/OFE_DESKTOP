import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';

import { OrdenCompra, Producto, CambioEstado } from "app/model/ordencompra";
import { ResponseError } from '../model/responseerror';
/*import { Configuration } from '../app.constants';*/
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppUtils } from "app/utils/app.utils";
import { Factura, DetalleFactura } from "app/model/factura";
import { Param} from "app/model/param";
import { URL_EDITAR_PARAMETROS } from 'app/utils/app.constants';
import { Usuario } from "app/model/usuario";
import { TablaDeTabla } from "app/model/tabladetabla";
import { Parametros } from "app/model/param";
declare var DatatableFunctions: any;

@Injectable()
export class ParametroService {

  //test





  util: AppUtils;
  constructor(private http: Http) {

  }
  convertStringToDate(strDate: string): Date {
    return new Date(strDate);
  }
  crearParametro(body) {
    let headers = this.getHeaders(localStorage.getItem('tipo_empresa'));
    let options = new RequestOptions({ headers: headers });
    return this.http.post(URL_EDITAR_PARAMETROS, body, options)
      .catch(this.handleError);
  }

  editarParametro(body) {
    let headers = this.getHeaders("C");
    let options = new RequestOptions({ headers: headers });
    return this.http.put(URL_EDITAR_PARAMETROS, body, options)
      .catch(this.handleError);
  }

  private extractData(res: Response) {

    let respuesta = {
      status: res ? res.status : -1,
      statusText: res ? res.statusText : "ERROR",
      data: res ? res.json() || {} : {},
    }
    return respuesta;
    //return body.data || {};
  }
  private handleError(error: Response | any) {
    console.error('handleError', error.message || error);
    let data = error ? error.json() || {} : {};
    if (data && data.error && data.error === "invalid_token")
      DatatableFunctions.logout();
    return Observable.throw(error.message || error);
  }

  private getHeaders(tipo_empresa: string) {
    // I included these headers because otherwise FireFox
    // will request text/html
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('origen_datos', 'PEB2M');
    headers.append("org_id", localStorage.getItem('org_id'));
    if (tipo_empresa != "") {
      headers.append("tipo_empresa", tipo_empresa);
    }

    headers.append("Authorization", 'Bearer ' + localStorage.getItem('access_token'));
    headers.append("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));



    return headers;
  }

}
