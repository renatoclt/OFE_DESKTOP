import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';

import { ConformidadServicio, Servicio } from "app/model/conformidadservicio";
import { ResponseError } from '../model/responseerror';
/*import { Configuration } from '../app.constants';*/
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppUtils } from "app/utils/app.utils";
import { URL_DETALLE_HAS } from 'app/utils/app.constants';
declare var DatatableFunctions: any;
@Injectable()
export class ConformidadServicioService {
  util: AppUtils;

  constructor(private http: Http) {
  }

  convertStringToDate(strDate: string): Date {
    return new Date(strDate);
  }

  obtener(id: string): Observable<ConformidadServicio> {
    let items$ = this.http
      .get(URL_DETALLE_HAS + id, { headers: this.getHeaders() })
      .map(this.mapHAS)
      .catch(this.handleError);
    return items$;
  }

  private mapHAS(res: Response): ConformidadServicio {
    //console.log('extractData2', res);
    let respuesta = {
      status: res ? res.status : -1,
      statusText: res ? res.statusText : "ERROR",
      data: res ? res.json() || {} : {},
    }

    let objeto_json = res.json();


    let cs: ConformidadServicio = {

      nroerpdocmaterial: objeto_json.data.DocumentoMaterial,
      nroconformidadservicio: objeto_json.data.NumeroHAS,
      comprador: objeto_json.data.RazonSocialComprador,
      ruccomprador: objeto_json.data.RucComprador,

      rucproveedor: objeto_json.data.RucProveedor,
      razonsocialproveedor: objeto_json.data.RazonSocialProveedor,
      estadoComprador: objeto_json.data.EstadoComprador,//EstadoProveedor
      estadoProveedor: objeto_json.data.EstadoComprador,//EstadoProveedor
      fechaemision: DatatableFunctions.ConvertStringToDatetime2(objeto_json.data.FechaEmision),
      correoproveedor: objeto_json.data.EmailProveedor,

      moneda: objeto_json.data.MonedaHAS, //'0000008'

      recibidoaceptadopor: objeto_json.data.AceptadoPor,
      autorizadopor: objeto_json.data.AprobadoPor,
      fecharecepcion: DatatableFunctions.ConvertStringToDatetime2(objeto_json.data.FechaAprobacion),
      CodigoHASERP: objeto_json.data.HASERP,
      EjercicioHAS: objeto_json.data.EjercicioHAS,

      productos: []
    };

    if (objeto_json.data.ItemHAS) {
      let index = 1, numItem = 1;
      for (let item of objeto_json.data.ItemHAS) {
        let p: Servicio = {

          id: index++,
          nroitem: (numItem++)+ '',
          nroordenservicio: item.NumeroOC?item.NumeroOC:'',
          nroitemordenservicio: item.NumeroItemOC?item.NumeroItemOC:'',
          nroitemhas: item.NumeroItemHas?item.NumeroItemHas:'',
          descripcion: ('DescripcionItem' in item) ? item.DescripcionItem : ''  ,
          estado: item.Estado,
          cantidad: DatatableFunctions.FormatNumber(item.CantidadItem),
          unidad: item.UnidadMedidaItem,
          valorrecibido: DatatableFunctions.FormatNumber(item.SubTotalItemMonedaDocumento),
          es_subitem: false,
          tienesubitem: false,
          servicio: "",
          IdServicioxHAS: item.IdServicioxHAS,
          IdTablaUnidad: item.IdTablaUnidad,
          IdRegistroUnidad: item.IdRegistroUnidad,
          NumeroParte: ('NumeroParte' in item) ? item.NumeroParte : '', 
          IdHAS: item.IdHAS,
          cantidadatendida: ('CantidadAtendida' in item) ? item.CantidadAtendida : '',
          PrecioItem : item.PrecioItem
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
              servicio: "",
              estado: ""
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
    let  data= error ? error.json() || {} : {};     
    if (data && data.error && data.error === "invalid_token")
      DatatableFunctions.logout();
    return Observable.throw(error.message || error);
  }

  private getHeaders() {
    // I included these headers because otherwise FireFox
    // will request text/html
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('origen_datos', 'PEB2M');
    headers.append("tipo_empresa", localStorage.getItem('tipo_empresa'));
    headers.append('org_id', localStorage.getItem('org_id'));    
    /*
    if (tipo_empresa != "") {
      headers.append("tipo_empresa", tipo_empresa);
    }
    */
    // headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
    headers.append("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
    return headers;
  }

}
