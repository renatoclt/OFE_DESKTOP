import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Header } from 'app/@core/header';

import { TransporteServicio, Transporte, Entrega } from 'app/model/transporteservicio';

import { ResponseError } from '../model/responseerror';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppUtils } from 'app/utils/app.utils';

import { URL_DETALLE_TRANSPORTE } from 'app/utils/app.constants';

declare var DatatableFunctions: any;
@Injectable()
export class TransporteServicioService {
  private header: Header;
  util: AppUtils;
  constructor(
    private http: Http,
    private httpClient: HttpClient
  ) {
      this.header = new Header();
  }

  convertStringToDate(strDate: string): Date {
    return new Date(strDate);
  }

  obtener(id: string): Observable<TransporteServicio> {
    const items$ = this.http
      .get(URL_DETALLE_TRANSPORTE + id, { headers: this.getHeaders(localStorage.getItem('tipo_empresa')) })
      .map(this.mapTransporte)
      .catch(this.handleError);
    return items$;
  }

  private mapTransporte(res: Response): TransporteServicio {
    let respuesta = {
      status: res ? res.status : -1,
      statusText: res ? res.statusText : 'ERROR',
      data: res ? res.json() || {} : {},
    };

    let objeto_json = res.json();
    let ts = new TransporteServicio();

    ts.documentoERP = objeto_json.data.Header.DocumentoERP;
    ts.ruccliente = objeto_json.data.Header.RucCliente;
    ts.razonsocialcliente = objeto_json.data.Header.RazonSocialCliente;
    ts.rucproveedor = objeto_json.data.Header.RucProveedor;
    ts.razonsocialproveedor = objeto_json.data.Header.RazonSocialProveedor;
    // tslint:disable-next-line:no-unused-expression
    ts.fechaaceptacion = objeto_json.data.Header.FechaAceptacion !== '' ? DatatableFunctions.FormatDatetimeForDisplay(new Date(objeto_json.data.Header.FechaAceptacion)) : null,
    ts.subtotal = objeto_json.data.Header.SubTotal;
    ts.impuesto = objeto_json.data.Header.Impuesto;
    ts.total = objeto_json.data.Header.Total;
    ts.moneda = objeto_json.data.Header.Moneda;
    ts.detraccion = objeto_json.data.Header.Detraccion;

    ts.productos = [];

    let index = 1;

    for (let item of objeto_json.data.Transporte) {
      let p = new Transporte();

      p.idtransporte = item.IdTransporte;
      // tslint:disable-next-line:no-unused-expression
      p.numerotransporte = item.Numerotransporte ? item.Numerotransporte : '',
      p.fechainicio = item.FechaInicio !== '' ? DatatableFunctions.FormatDatetimeForDisplay(new Date(item.FechaInicio)) : null,
      p.costoproveedor = DatatableFunctions.FormatNumber(item.CostoProveedorTotal),
      p.costoreferencial = DatatableFunctions.FormatNumber(item.CostoReferencialTotal),
      p.placa = item.Placa ? item.Placa : '',
      p.pesototal = DatatableFunctions.FormatNumber(item.PesoTotal, 3),
      p.unidadpesototal = item.UnidadPesoTotal ? item.UnidadPesoTotal : '',
      p.confvehiculo = item.ConfVehiculo ? item.ConfVehiculo : '',

      p.entregas = new Array();

      if ('DetalleTransporte' in item) {
        for (let entregas of item.DetalleTransporte) {

          let subentrega = {
            numeroguia: entregas.NumeroGuia ? entregas.NumeroGuia : '',
            numeroentrega: entregas.NumeroEntrega ? entregas.NumeroEntrega : '',
            peso: entregas.Peso ? entregas.Peso : '',
            unidadpeso: entregas.UnidadPeso ? entregas.UnidadPeso : '',
            costoproveedor: entregas.CostoProveedor ? entregas.CostoProveedor : '',
            costoreferencial: entregas.CostoReferencial ? entregas.CostoReferencial : '',
          };

          p.entregas.push(subentrega);
        }
      }

      ts.productos.push(p);
    }
    return ts;

    }

  private handleError(error: Response | any) {

    console.error('handleError', error.message || error);
    let  data = error ? error.json() || {} : {};
    // tslint:disable-next-line:curly
    if (data && data.error && data.error === 'invalid_token')
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
    headers.append('tipo_empresa', localStorage.getItem('tipo_empresa'));
    headers.append('org_id', localStorage.getItem('org_id'));

    headers.append('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
    headers.append('Ocp-Apim-Subscription-Key', localStorage.getItem('Ocp_Apim_Subscription_Key'));
    return headers;
  }

   /**
   * extractData
   * @param response
   */
  private extractData(response: Response) {
    let body = response.json();
    return body || {};
  }

}
