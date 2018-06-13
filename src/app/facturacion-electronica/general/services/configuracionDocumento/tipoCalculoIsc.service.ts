import {HttpClient} from '@angular/common/http';
import {Servidores} from '../servidores';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {TipoCalculoIsc} from '../../models/configuracionDocumento/tipoCalculoIsc';
import {Injectable} from '@angular/core';
import { SpinnerService } from 'app/service/spinner.service';
import { error } from 'selenium-webdriver';

@Injectable()
export class TipoCalculoIscService {
  url: string = '/tipocalculoisc';

  constructor( private httpClient: HttpClient,
               private servidores: Servidores,
               private _spinner: SpinnerService) {
    this.url = this.servidores.AFEDOCUQRY + this.url;
  }

  obtenerTodosTiposCalculoIsc(): BehaviorSubject<TipoCalculoIsc[]> {
    let tiposCalculoIsc: BehaviorSubject<TipoCalculoIsc[]> = new BehaviorSubject<TipoCalculoIsc[]>([]);
    //this._spinner.set(true);
    this.httpClient.get<TipoCalculoIsc[]>(this.url).subscribe(
      data => {
        tiposCalculoIsc.next(data['_embedded']['tipoCalculoIscRedises']);
        this._spinner.set(false);
      },
      error => {
        this._spinner.set(false);
      }
    );

    return tiposCalculoIsc;
  }
}
