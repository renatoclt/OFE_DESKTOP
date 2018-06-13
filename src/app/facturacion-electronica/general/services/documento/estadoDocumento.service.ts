import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Servidores} from '../servidores';
import {EstadoDocumento} from '../../models/documento/estadoDocumento';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class EstadoDocumentoService {
  private url: string = '/estadoscomprobante';
  private estadosDocumento: BehaviorSubject<EstadoDocumento[]>;

  constructor( private httpClient: HttpClient,
               private servidores: Servidores) {
    this.url = this.servidores.AFEDOCUQRY + this.url;
    this.estadosDocumento = new BehaviorSubject<EstadoDocumento[]>([]);
    this.obtenerTodosEstadosComprobantes();
  }

  private obtenerTodosEstadosComprobantes() {
    this.httpClient.get<EstadoDocumento[]>(this.url).take(1).subscribe(
      data => {
        this.estadosDocumento.next(data['_embedded']['estadosComprobanteRedises']);
      }
    );
  }

  obtenerPorIdEstadoComprobante(listaIdEstados: number[]): BehaviorSubject<EstadoDocumento[]> {
    const nuevaListaDeEstados = new BehaviorSubject<EstadoDocumento[]>([]);
    this.estadosDocumento.map(
      items => items.filter(item => listaIdEstados.includes(item.idEstadoComprobante))
    ).subscribe(
      data => nuevaListaDeEstados.next(data)
    );
    return nuevaListaDeEstados;
  }

  obtenerEstadosComprobantes(): BehaviorSubject<EstadoDocumento[]> {
    return this.estadosDocumento;
  }
}
