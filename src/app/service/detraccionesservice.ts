import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import 'rxjs/add/operator/map'
import {Observable} from 'rxjs/Observable';

import {Detracciones} from "app/model/detracciones";
/*import { Configuration } from '../app.constants';*/
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {AppUtils} from "app/utils/app.utils";
import {URL_DETALLE_HAS} from 'app/utils/app.constants';

declare var DatatableFunctions: any;
@Injectable()
export class detraccionesService {




  util: AppUtils;
  constructor(private http: Http) {

  }
  convertStringToDate(strDate: string): Date {
    return new Date(strDate);
  }

  obtener(id: string, tipo_empresa: string): Observable<Detracciones> {

    let items$ = this.http
      .get(URL_DETALLE_HAS + id, { headers: this.getHeaders(tipo_empresa) })
      .map(this.mapHAS)
      .catch(this.handleError);
    return items$;
  }

  private mapHAS(res: Response): Detracciones {
    //console.log('extractData2', res);
    let respuesta = {
      status: res ? res.status : -1,
      statusText: res ? res.statusText : "ERROR",
      data: res ? res.json() || {} : {},
    }

    let objeto_json = res.json();


    let cs: Detracciones = {


    };

    if (objeto_json.data.ItemHAS) {
      let index = 1, numItem = 1;
      for (let item of objeto_json.data.ItemHAS) {
        let p: Servicio = {

          id: index++,
          nroitem: (numItem++)+ '',
          nroordenservicio: item.NumeroOC?item.NumeroOC:'',
          nroitemordenservicio: item.NumeroItemOC?item.NumeroItemOC:'',
          descripcion: item.DescripcionItem,
          cantidad: DatatableFunctions.FormatNumber(item.CantidadItem),
          unidad: item.UnidadMedidaItem,
          valorrecibido: DatatableFunctions.FormatNumber(item.SubTotalItemMonedaDocumento),
          es_subitem: false,
          tienesubitem: false,
        }

        cs.productos.push(p);
        if (item.SubItemHAS) {
          for (let subitem of item.SubItemHAS) {
            p.tienesubitem=true;
            let sub: Servicio = {

              id: index++,
              nroitem: subitem.CodigoServicioSubItem,
              nroordenservicio: item.NumeroOC?item.NumeroOC:'',
              nroitemordenservicio: item.NumeroItemOC + '- ' + subitem.CodigoServicioSubItem,
              descripcion: subitem.DescripcionSubItem,
              cantidad: DatatableFunctions.FormatNumber(subitem.CantidadSubItem),
              unidad: subitem.UnidadMedidaSubItem,

              valorrecibido: DatatableFunctions.FormatNumber(subitem.SubTotalSubItem),
              es_subitem: true,
              tienesubitem: false,
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
