import { Injectable } from '@angular/core';
import { Servidores } from 'app/facturacion-electronica/general/services/servidores';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Parametros } from 'app/facturacion-electronica/general/models/parametros/parametros';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {TablaMaestra} from "../../models/documento/tablaMaestra";

@Injectable()
export class ParametrosService {
  private pathParametros: string;
  private pathSearch: string;
  private pathDominios: string;

  public urlParamatroByIdParametro: string;
  constructor(
      private _httpClient: HttpClient,
      private _servidores: Servidores) {
    this.pathParametros = '/parametros';
    this.pathSearch = '/search';
    this.pathDominios = '/dominios';

    this.urlParamatroByIdParametro = this._servidores.PARMQRY + this.pathParametros + this.pathSearch + this.pathDominios;
  }
  public obtenerParametrosPorId( id: number ): BehaviorSubject<Parametros[]> {
    const listaParametros: BehaviorSubject<Parametros[]> = new BehaviorSubject<Parametros[]>([]);
    const parametros = new HttpParams()
    .set('idparametro', id.toString());
    this._httpClient.get<Parametros[]>(
      this.urlParamatroByIdParametro, { params: parametros }
    ).take(1).subscribe(
        data => {
            listaParametros.next(data['_embedded']['parametroRedises']);
        }
    );
    return listaParametros;
  }

  obtenerPorCodigoDeTipoDeComprobante(listaItems: BehaviorSubject<Parametros[]>, listaCodigos: string[]): BehaviorSubject<Parametros[]> {
    const listaNuevaItems: BehaviorSubject<Parametros[]> = new BehaviorSubject<Parametros[]>([]);
    listaItems.map(
      items => items.filter(item => listaCodigos.includes(item.codigo_dominio))
    ).subscribe(
      data => {
        listaNuevaItems.next( data);
      }
    );
    return listaNuevaItems;
  }
}
