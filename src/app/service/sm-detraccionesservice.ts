import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';

import { Detraccion, Caracteristicas } from "app/model/sm-detracciones";
import { ResponseError } from '../model/responseerror';
/*import { Configuration } from '../app.constants';*/
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppUtils } from "app/utils/app.utils";
import { URL_DETALLE_DETRACCION } from 'app/utils/app.constants';


declare var DatatableFunctions: any;
@Injectable()
export class detraccionesService {
  util: AppUtils;
  constructor(private http: Http) {

  }
  convertStringToDate(strDate: string): Date {
    return new Date(strDate);
  } 
  //ESTA OBTENIENDO DOS CAMPOS QUE SON LOS PARAMETROS DE JSON DE DETRACCIONES 
  //obtener(id: string, tipo_empresa: string): Observable<Detracciones> {
  obtener(id: string): Observable<Detraccion> {
    let items$ = this.http
      //.get(URL_DETALLE_DETRACCION + id, { headers: this.getHeaders(tipo_empresa) })
      .get(URL_DETALLE_DETRACCION + id, { headers: this.getHeaders(localStorage.getItem('tipo_empresa')) })
      .map(this.mapDETRACCION)
      .catch(this.handleError);
    return items$;
  }

  private mapDETRACCION(res: Response): Detraccion {
    //console.log('extractData2', res);
    let respuesta = {
      status: res ? res.status : -1,
      statusText: res ? res.statusText : "ERROR",
      data: res ? res.json() || {} : {},
    }

    let objeto_json = res.json();
    let det: Detraccion = {
      razonsocialcomprador:objeto_json.data.RazonSocialComprador,
      ruccomprador: objeto_json.data.RucComprador,
      nroconstancia: objeto_json.data.NumeroConstancia,
      razonsocialprov:objeto_json.data.RazonSocialProveedor,
      direccionprov: objeto_json.data.DireccionProveedor,
      rucproveedor: objeto_json.data.RucProveedor,
      nrocuentadetraccion: objeto_json.data.NumCuentaNacionProveedor,
      nrodocpagoerp:objeto_json.data.NumeroDocPagoERP,
      nrooperacion: objeto_json.data.NumeroOperacion,
      codbienservicio: objeto_json.data.CodBienServicio,
      nombienservicio: objeto_json.data.NomBienServicio,
      montodeposito: objeto_json.data.MontoDeposito,
      codtipooperacion:objeto_json.data.CodOperacion,
      nrotipooperacion: objeto_json.data.NomTipoOperacion,
      fechapago:DatatableFunctions.ConvertStringToDatetime2(objeto_json.data.FechaHoraPago),
      periodotributario:objeto_json.data.PeriodoTributario,
      observacion:objeto_json.data.Observacion,
      totalmontopago:DatatableFunctions.FormatNumber(objeto_json.data.TotalMontoPago),
      totalmontodetraccion:DatatableFunctions.FormatNumber(objeto_json.data.TotalMontoDetraccion),
      totalsaldofactura:DatatableFunctions.FormatNumber(objeto_json.data.TotalSaldoFactura),

      detalles:[],
      //docadjuntos: [],      
      
    };

    if (objeto_json.data.Detalles) {
      let index = 1, numItem = 1;
      for (let item of objeto_json.data.Detalles) {
        let d: Caracteristicas = {

          id: index++,
          tipodocumento: (numItem++)+ '',
          seriedocumento: item.SerieDocumento?item.SerieDocumento:'',
          nrodocumento: item.NumeroDocumento?item.NumeroDocumento:'',
          fechadocumento: DatatableFunctions.FormatNumber(item.FechaDocumento),
          monedadet: item.Monedadet,
          tipocambio: item.TipoCambio,
          montooriginal: DatatableFunctions.FormatNumber(item.MontoOriginal),
          montopago: DatatableFunctions.FormatNumber(item.MontoPago),
          montodetractado: DatatableFunctions.FormatNumber(item.MontoDetractado),
          saldofactura:DatatableFunctions.FormatNumber(item.SaldoFactura),
        }

        det.detalles.push(d);
      }
    }
  /*det.docadjuntos = [];
    if (objeto_json.data.Archivos) {
        let index = 1;
        for (let adjunto of objeto_json.data.Adjuntos) {
            det.docadjuntos.push({
              id: index++,
              codigo: adjunto.iddetraccion ? adjunto.iddetraccion : '',
              nombre: adjunto.nombre ? adjunto.nombre : '',
              descripcion: adjunto.archivo ? adjunto.archivo : '',
              url: adjunto.url ? adjunto.url : '',
            });
        }
    }*/
    console.log(det);
    return det;
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