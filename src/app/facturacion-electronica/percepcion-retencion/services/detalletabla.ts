import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Servidores } from '../../general/services/servidores';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BasePaginacion } from '../../general/services/base.paginacion';
import {SpinnerService} from '../../../service/spinner.service';

@Injectable()
export class Detalletabla {
  public urlQry = '/referencias/search/comprobanteID';

  public TIPO_ATRIBUTO_DOCUMENTO_MASIVO = 'documentoMasivoes';
  public TIPO_ATRIBUTO_DETALLE_DOCUMENTO_MASIVO = 'detalleMasivoes';
  public TIPO_ATRIBUTO_REFERENCIAS = 'tDocReferenciEntities';

  constructor(private httpClient: HttpClient,
              private servidores: Servidores,
              private _spinner: SpinnerService) {
    this.urlQry = this.servidores.HOSTLOCAL + this.urlQry;
  }

  get<T>(parametros: HttpParams, url: string = this.urlQry, nombreKeyJson: string = this.TIPO_ATRIBUTO_REFERENCIAS): BehaviorSubject<[BasePaginacion, T[]]> {
    const that = this;
    const number = Number(url);
    if (number >= 0 ) {
      parametros = parametros.set('page', number.toString());
    }
    const nuevaUrl = this.urlQry;

    const basePaginacion: BasePaginacion = new BasePaginacion();
    const dataRetornar: BehaviorSubject<[BasePaginacion, T[]]> = new BehaviorSubject<[BasePaginacion, T[]]>([basePaginacion, []]);
    this.httpClient.get<T[]>( nuevaUrl, {
      params: parametros
    }).take(1).
    subscribe(
      (data) => {
        const totalPaginas = data['page']['totalPages'] - 1;
        const paginaActual = data['page']['number'];

        basePaginacion.pagina.next( paginaActual );
        basePaginacion.totalItems.next(data['page']['totalElements']);
        basePaginacion.totalPaginas.next(totalPaginas);

        if ( (paginaActual + 1) <= totalPaginas) {
          basePaginacion.next.next((paginaActual + 1).toString());
        } else {
          basePaginacion.next.next('');
        }
        basePaginacion.last.next((totalPaginas).toString());
        basePaginacion.first.next('0');
        if ( (paginaActual - 1) >= 0) {
          basePaginacion.previous.next((paginaActual - 1).toString());
        } else {
          basePaginacion.previous.next('');
        }
        dataRetornar.next([basePaginacion, data['_embedded'][nombreKeyJson]]);
      }
    );
    return dataRetornar;
  }

}
