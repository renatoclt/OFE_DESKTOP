import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import { RFQCompradorInsert, Atributo,ProveedorInvitado, Proveedor, Producto,  AtributoxProducto } from "app/model/sm-rfqcomprador";
import { ResponseError } from '../../model/responseerror';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppUtils } from "app/utils/app.utils";
import { Organizacion } from "app/model/administracion/organizacion";

@Injectable()
export class OrganizacionService {
  URI_ORGANIZACION_EVENTO = 'https://dev.ebizlatindata.com/organizacion/msproductor/v1/comandos/organizacion/'
  URI_ORGANIZACION = 'https://dev.ebizlatindata.com/organizacion/msorganizacion/v1/orgs/'
  util: AppUtils;
  headers:Headers
  options:RequestOptions = new RequestOptions({ headers: this.headers });
  constructor(
    private http: Http, 
    private httpClient: HttpClient
  ) {
      this.headers = this.getHeaders();
      this.options = new RequestOptions({ headers: this.headers });
  }

  private convertStringToDate(strDate: string): Date {
    return new Date(strDate);
  } 

  public obtenerListaRUCOrganización(){
    return this.http.get(this.URI_ORGANIZACION+'?column_names=Ruc', this.options)
    .map(this.extractData)
    .catch(this.handleError);
  }

  public obtenerOrganizacionPorId(id: string ): Observable <Organizacion> {
    return this.http
      .get(this.URI_ORGANIZACION + 'detalle/' + id, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  
  private extractData(response: Response) {
    let body = response.json();
    return body.data || {};
  }

  public crearOrganizacion(organizacion: Organizacion) {
    return this.http.post(this.URI_ORGANIZACION_EVENTO, organizacion, this.options)
      .catch(this.handleError);
  }

  public editarOrganizacion(organizacion: Organizacion) {
    return this.http.put(this.URI_ORGANIZACION_EVENTO, organizacion, this.options)
      .catch(this.handleError);
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Observable.throw(errMsg);
  }

  private getHeaders() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('origen_datos', 'PEB2M');
    headers.append('tipo_empresa', localStorage.getItem('tipo_empresa') )
    headers.append('org_id', localStorage.getItem('org_id'));    
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
    headers.append("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
    return headers;
  }  
}
