import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import { RFQCompradorInsert, Atributo,ProveedorInvitado, Proveedor, Producto,  AtributoxProducto } from "app/model/sm-rfqcomprador";
import { ResponseError } from 'app/model/responseerror';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppUtils } from "app/utils/app.utils";
import { Modulo } from "app/model/administracion/modulo";

@Injectable()
export class ModuloService {
  URI_MODULO_EVENTO = 'https://dev.ebizlatindata.com/utils/msproductor/v1/comandos/modulo'
  URI_MODULO = 'https://dev.ebizlatindata.com/utils/msutils/v1/modulo/'
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

  public obtenerListarModulo(){
    return this.http.get(this.URI_MODULO+'lista/?column_names=IdModulo,Descripcion,Codigomodulo,nombre_corto,Habilitado', this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public obtenerListarCodigosModulo(){
    return this.http.get(this.URI_MODULO+'lista/?column_names=Codigomodulo', this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  
  public obtenerModuloPorId(id: string ): Observable <Modulo> {
    return this.http
            .get(this.URI_MODULO + 'menu/modulos/' + id, this.options)
            .map(this.extractData)
            .catch(this.handleError);
  }
  private extractData(response: Response) {
    let body = response.json();
    return body.data || {};
  }

  public crearModulo(modulo: Modulo) {
    //CAMBIAR POR QUE BACK RECIBE ESTO
    let POSMODULO = {'POSMODULO': modulo};
    return this.http.post('https://dev.ebizlatindata.com/utils/msproductor/v1/comandos/formulario', POSMODULO, this.options)
      .catch(this.handleError);
  }

  public editarModulo(modulo: Modulo) {
    return this.http.put(this.URI_MODULO_EVENTO, modulo, this.options)
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
