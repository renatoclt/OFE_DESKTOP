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
import { Usuario } from "app/model/administracion/usuario";

@Injectable()
export class UsuarioService {
  URI_USUARIO_EVENTO = 'https://dev.ebizlatindata.com/usuarios/msproductor/v1/comandos/usuario'
  URI_USUARIO = 'https://dev.ebizlatindata.com/usuarios/msusuario/v1/usuarios/'
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

  public obtenerUsuarioPorId(id: string ): Observable <Usuario> {
    return this.http
      .get(this.URI_USUARIO + 'detalle/' + id, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public obtenerListaNombreUsuarioUsuario(){
    return this.http.get(this.URI_USUARIO+'?column_names=NombreUsuario', this.options)
    .map(this.extractData)
    .catch(this.handleError);
  }
  
  private extractData(response: Response) {
    let body = response.json();
    return body.data || {};
  }

  public crearUsuario(usuario: Usuario) {
    return this.http.post(this.URI_USUARIO_EVENTO, usuario, this.options)
      .catch(this.handleError);
  }

  public editarUsuario(usuario: Usuario) {
    return this.http.put(this.URI_USUARIO_EVENTO, usuario, this.options)
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
