import {HttpClient} from '@angular/common/http';
import {Servidores} from '../servidores';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {TipoAfectacionIgv} from '../../models/configuracionDocumento/tipoAfectacionIgv';
import {Injectable} from '@angular/core';
import { error } from 'selenium-webdriver';
import { SpinnerService } from 'app/service/spinner.service';
import { MensajeService } from 'app/facturacion-electronica/general/services/utils/mensaje.service';

@Injectable()
export class TipoAfectacionIgvService {
  url: string = '/tipoafectacionigv';

  constructor(  private httpClient: HttpClient,
                private servidores: Servidores,
                private _spinner: SpinnerService,
                private _mensaje: MensajeService
              ) {
    this.url = this.servidores.HOSTLOCAL + this.url;
  }

  obtenerTodosTiposAfectacionIgv(): BehaviorSubject<TipoAfectacionIgv[]> {
    let tiposAfectacionIgv: BehaviorSubject<TipoAfectacionIgv[]> = new BehaviorSubject<TipoAfectacionIgv[]>([]);
    this._spinner.set(true);
    this.httpClient.get<TipoAfectacionIgv[]>(this.url).subscribe(
      data => {
        this._spinner.set(false);
        console.log(data);
        tiposAfectacionIgv.next(data['_embedded']['tipoAfectacionIgvRedises']);
      },
      error => {
        this._spinner.set(false);
        this._mensaje.notificacionErrorServidor();
      }
    );
    console.log(tiposAfectacionIgv);
    return tiposAfectacionIgv;
  }
}
