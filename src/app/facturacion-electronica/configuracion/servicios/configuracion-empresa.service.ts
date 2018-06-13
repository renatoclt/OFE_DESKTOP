import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {SeriesQuery} from '../models/series-query';

@Injectable()
export class ConfiguracionEmpresaService {
  serieEditar: BehaviorSubject<SeriesQuery>;
  tipoSerie: BehaviorSubject<string>;

  constructor() {
    this.inicializarVariables();
  }

  inicializarVariables() {
    this.serieEditar = new BehaviorSubject(null);
    this.tipoSerie = new BehaviorSubject('');
  }
}
