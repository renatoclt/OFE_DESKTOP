import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';

import { Retenciones, Caracteristicas } from "app/model/sm-retenciones";
import { ResponseError } from '../model/responseerror';
/*import { Configuration } from '../app.constants';*/
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppUtils } from "app/utils/app.utils";
import { URL_DETALLE_RETENCIONES } from 'app/utils/app.constants';
declare var DatatableFunctions: any;
@Injectable()
export class retencionesService {
  util: AppUtils;

  constructor(private http: Http) {
  }

  convertStringToDate(strDate: string): Date {
      return new Date(strDate);
  }

  //ESTA OBTENIENDO DOS CAMPOS QUE SON LOS PARAMETROS DE JSON DE DETRACCIONES 
  //obtener(id: string, tipo_empresa: string): Observable<Detracciones> {
  obtener(id: string): Observable<Retenciones> {
      let items$ = this.http
        //.get(URL_DETALLE_DETRACCION + id, { headers: this.getHeaders(tipo_empresa) })
        .get(URL_DETALLE_RETENCIONES + id, { headers: this.getHeaders(localStorage.getItem('tipo_empresa')) })
        .map(this.mapRETENCIONES)
        .catch(this.handleError);
      return items$;
  }

  private mapRETENCIONES(res: Response): Retenciones {
    //console.log('extractData2', res);
    let respuesta = {
      status: res ? res.status : -1,
      statusText: res ? res.statusText : "ERROR",
      data: res ? res.json() || {} : {},
    }

    let objeto_json = res.json();

console.log('*****  en mapeo retencion  ******');


    let ret: Retenciones = {
      razonsocialcompradora:objeto_json.CERTUPLOAD.Razonsocialcompradora,
      ruccompradora: objeto_json.CERTUPLOAD.Ruccompradora,
      serieretencion: objeto_json.CERTUPLOAD.Serieretencion,
      numeroretencion: objeto_json.CERTUPLOAD.Numeroretencion,

      rucproveedora:objeto_json.CERTUPLOAD.Rucproveedora,
      razonsocialprov: objeto_json.CERTUPLOAD.Razonsocialproveedora,
      direccionproveedora: objeto_json.CERTUPLOAD.Direccionproveedora,
      txtnrodocpagoerp: objeto_json.CERTUPLOAD.Txtnrodocpagoerp,
      moneda:objeto_json.CERTUPLOAD.Moneda,
      fechaemision: DatatableFunctions.ConvertStringToDatetime(objeto_json.CERTUPLOAD.Fechaemision),
      banco: objeto_json.CERTUPLOAD.Banco,
      estado:objeto_json.CERTUPLOAD.Estadoproveedor,
      tipocambio: objeto_json.CERTUPLOAD.Tipocambio,
      numcorrida: objeto_json.CERTUPLOAD.Numcorrida,
      obs:objeto_json.CERTUPLOAD.Obs,

     
      detalle:[]      
      
    };

    if (objeto_json.CERTUPLOAD.Detalle) {
      let index = 1, numItem = 1;
      for (let item of objeto_json.CERTUPLOAD.Detalle) {
        let d: Caracteristicas = {

          //id: index++,
          ditemretencion: (numItem++)+ '',
          dtipodocumento: item.Dtipodocumento?item.Dtipodocumento:'',
          dseriedocumento: item.Dseriedocumento?item.Dseriedocumento:'',
          dnumerodocumento: item.Dnumerodocumento,
          dfechadocumento: DatatableFunctions.ConvertStringToDatetime(item.Dfechadocumento),
          dmoneda: item.Dmoneda,
          dmontoorigen: DatatableFunctions.FormatNumber(item.Dmontoorigen),
          dmontopago: DatatableFunctions.FormatNumber(item.Dmontopago),
          dmontoretenido: DatatableFunctions.FormatNumber(item.Dmontoretenido),
          dvcnrodocerpitem:item.Dvcnrodocerpitem,
         
        }

        ret.detalle.push(d);
      }
    }
    console.log(ret);
    return ret;
    //return body || {};

  }

  private handleError(error: Response | any) {

    console.error('handleError', error.message || error);
    let  data = error ? error.json() || {} : {};     
    if (data && data.error && data.error === "invalid_token")
      //DatatableFunctions.logout();
    return Observable.throw(error.message || error);
  
  }

  private getHeaders(tipo_empresa: string) {
    // I included these headers because otherwise FireFox
    // will request text/html
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('origen_datos', 'PEB2M');
    headers.append('tipo_empresa', localStorage.getItem('tipo_empresa') )
    headers.append('org_id', localStorage.getItem('org_id'));

    /*if (tipo_empresa != "") {
      headers.append("tipo_empresa", tipo_empresa);
    }
*/
    
   headers.append('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
    // headers.append('Access-Control-Allow-Origin', '*');

    headers.append("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
    return headers;
  }
}