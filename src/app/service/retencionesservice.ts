import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import 'rxjs/add/operator/map'
import {Observable} from 'rxjs/Observable';

import {Retenciones, Servicio} from "app/model/retenciones";
/*import { Configuration } from '../app.constants';*/
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {AppUtils} from "app/utils/app.utils";
import {URL_DETALLE_RETENCIONES} from 'app/utils/app.constants';

declare var DatatableFunctions: any;
@Injectable()
export class retencionesService {




  util: AppUtils;
  constructor(private http: Http) {

  }
  convertStringToDate(strDate: string): Date {
    return new Date(strDate);
  }

  obtener(id: string, tipo_empresa: string): Observable<Retenciones> {

    let items$ = this.http
      .get(URL_DETALLE_RETENCIONES + id, { headers: this.getHeaders(tipo_empresa) })
      .map(this.mapHAS)
      .catch(this.handleError);
    return items$;
  }

  private mapHAS(res: Response): Retenciones {
    //console.log('extractData2', res);
    let respuesta = {
      status: res ? res.status : -1,
      statusText: res ? res.statusText : "ERROR",
      data: res ? res.json() || {} : {},
    }

    let objeto_json = res.json();


    let cs: Retenciones = {





    };

    if (objeto_json.data.ItemRetenciones) {
      let index = 1, numItem = 1;
      for (let item of objeto_json.data.ItemRetenciones) {
        let p: Servicio = {


        }

        cs.productos.push(p);
        if (item.SubItemRetenciones) {
          for (let subitem of item.SubItemRetenciones) {
            p.tienesubitem=true;
            let sub: Servicio = {


            }

            cs.productos.push(sub);
          }
        }
      }
    }
    console.log(cs);
    return cs;
    //return body || {};

  }

  private handleError(error: Response | any) {

    console.error('handleError', error.message || error);
    return Observable.throw(error.message || error);
  }

  private getHeaders(tipo_empresa: string) {
    // I included these headers because otherwise FireFox
    // will request text/html
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('origen_datos', 'PEB2M');

    if (tipo_empresa != "") {
      headers.append("tipo_empresa", tipo_empresa);
    }

    headers.append('org_id', sessionStorage.getItem('org_id'));
    headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token_oc'));
    // headers.append('Access-Control-Allow-Origin', '*');

    headers.append("Ocp-Apim-Subscription-Key", sessionStorage.getItem('Ocp_Apim_Subscription_Key'));
    return headers;
  }
}
