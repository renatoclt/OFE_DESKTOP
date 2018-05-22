import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Servidores} from '../servidores';
import {ParametroDocumento} from '../../models/configuracionDocumento/parametroDocumento';
import { BehaviorSubject } from 'rxjs';
import { Parametros } from 'app/facturacion-electronica/general/models/parametros/parametros';

@Injectable()
export class ParametroDocumentoServicio {
  private url: string = '/parametros';
  private buscar: string = '/search';
  private buscarPorIdParametro: string = this.buscar + '/findByIdParametro';
  private buscarPorParametro: string = '/search/dominios';

  private parametrosDocumento: ParametroDocumento[];

  constructor(private httpClient: HttpClient,
              private servidores: Servidores) {
    this.url = this.servidores.AFEDOCUQRY + this.url;
    this.parametrosDocumento = [];
    this.obtenerTodos();
  }


  obtenerTodos() {
    this.obtener(this.url);
    return this.obtenerParametrosDocumento();
  }

  obtener(url: string, parametros: HttpParams = new HttpParams()) {
    this.httpClient.get(url, {
      params: parametros
    }).subscribe(
      (data) => {
        this.parametrosDocumento = data['_embedded']['parametroRedises'];
        console.log('parametros');
        console.log(this.parametrosDocumento);
        console.log(data);
      }
    );
  }

  obtenerPorId(id: number) {
    const parametros: HttpParams = new HttpParams()
      .set('id_parametro',id.toString());
    this.obtener(this.url+this.buscarPorIdParametro,parametros);
    const parametroDocumento = this.obtenerParametrosDocumento();
    if(parametroDocumento.length == 1)
      return this.obtenerParametrosDocumento()[0];
    return null;
  }

  obtenerParametrosPorId(id: number): BehaviorSubject<Parametros[]> {
    const parametros: HttpParams = new HttpParams()
      .set('idparametro',id.toString());
    this.obtener(this.url + this.buscarPorParametro, parametros);
    const parametroDocumento = this.obtenerParametrosDocumento();
    if(parametroDocumento.length == 1)
      return this.obtenerParametrosDocumento()[0];
    return null;
  }

  obtenerParametrosDocumento() {
    return this.parametrosDocumento;
  }
}
