import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Header } from 'app/@core/header';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { GrupoEmpresarial } from "app/model/administracion/grupoempresarial";

@Injectable()
export class GrupoEmpresarialService {
  URI_GRUPOEMPRESARIAL_EVENTO = 'https://dev.ebizlatindata.com/organizacion/msproductor/v1/comandos/grupoempresarial'
  URI_GRUPOEMPRESARIAL = 'https://dev.ebizlatindata.com/organizacion/msorganizacion/v1/orgs/'
  private header:Header;
  constructor(
    private http: Http, 
    private httpClient: HttpClient
  ) {
      this.header = new Header();
  }

  public obtenerListaGrupoEmpresarial(arrayParams:any){    
    return this.http.get(this.URI_GRUPOEMPRESARIAL+'listaGE/', this.header.getOptions(arrayParams))
      .map(this.extractData)
      .catch(this.handleError);
  }

  public inhabilitarGrupoEmpresarial(arrayInhabilitarIds:any) {
    return this.http.put(this.URI_GRUPOEMPRESARIAL_EVENTO, arrayInhabilitarIds, this.header.getOptions([]))
      .catch(this.handleError);
  }

  public habilitarGrupoEmpresarial(arrayHabilitarIds:any) {
    return this.http.put(this.URI_GRUPOEMPRESARIAL_EVENTO, arrayHabilitarIds, this.header.getOptions([]))
      .catch(this.handleError);
  }

  public crearGrupoEmpresarial(grupoEmpresarial: GrupoEmpresarial) {
    return this.http.post(this.URI_GRUPOEMPRESARIAL_EVENTO, grupoEmpresarial, this.header.getOptions([]))
      .catch(this.handleError);
  }

  public editarGrupoEmpresarial(grupoEmpresarial: GrupoEmpresarial) {
    return this.http.put(this.URI_GRUPOEMPRESARIAL_EVENTO, grupoEmpresarial, this.header.getOptions([]))
      .catch(this.handleError);
  }

  public obtenerGrupoEmpresarialPorId(id: string ): Observable <GrupoEmpresarial> {
    return this.http
      .get(this.URI_GRUPOEMPRESARIAL + 'detalleGE/' + id, this.header.getOptions([]))
      .map(this.extractData)
      .catch(this.handleError);
  }

  
/*
  public obtenerListaCodigosGrupoEmpresarial(){
    return this.http.get(this.URI_GRUPOEMPRESARIAL+'listaGE/?column_names=Codigo', this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }*/

  /**
   * extractData
   * @param response 
   */
  private extractData(response: Response) {
    let body = response.json();
    return body || {};
  }
  /**
   * handleError
   * @param error 
   */
  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Observable.throw(errMsg);
  } 
}
