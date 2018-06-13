import {HttpClient} from '@angular/common/http';
import {Servidores} from '../servidores';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {TipoPrecioVenta} from '../../models/configuracionDocumento/tipoPrecioVenta';
import {Injectable} from '@angular/core';
import { SpinnerService } from 'app/service/spinner.service';
import { error } from 'util';

@Injectable()
export class TipoPrecioVentaService {
  url: string = '/tipoprecioventa';

  constructor( private httpClient: HttpClient,
               private servidores: Servidores,
               private _spinner: SpinnerService) {
    this.url = this.servidores.AFEDOCUQRY + this.url;
  }

  obtenerTodosTiposPrecioVenta(): BehaviorSubject<TipoPrecioVenta[]> {
    let tiposPrecioVenta: BehaviorSubject<TipoPrecioVenta[]> = new BehaviorSubject<TipoPrecioVenta[]>([]);
    //this._spinner.set(true);
    this.httpClient.get<TipoPrecioVenta[]>(this.url).subscribe(
      data => {
        tiposPrecioVenta.next(data['_embedded']['tipoPrecioVentaRedises']);
        this._spinner.set(false);
      },
      error => {
        this._spinner.set(false);
      }
    );

    return tiposPrecioVenta;
  }
}
