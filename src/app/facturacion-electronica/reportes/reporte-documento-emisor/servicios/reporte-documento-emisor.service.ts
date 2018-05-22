import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {PersistenciaService} from '../../../comprobantes/services/persistencia.service';
import {ReporteDocumentoEmisorConsulta} from '../../../general/models/reportes/reporteDocumentoEmisorConsulta';

@Injectable()
export class ReporteDocumentoEmisorService {
  reporteGeneral: BehaviorSubject<ReporteDocumentoEmisorConsulta>;
  fechaInicio: BehaviorSubject<string>;
  fechaFinal: BehaviorSubject<string>;
  tipoDocumento: BehaviorSubject<string>;
  estados: BehaviorSubject<string>;

  constructor(private _persistenciaService: PersistenciaService) {
    this.reporteGeneral = new BehaviorSubject(null);
    this.fechaInicio = new BehaviorSubject('');
    this.fechaFinal = new BehaviorSubject('');
    this.tipoDocumento = new BehaviorSubject('');
    this.estados = new BehaviorSubject('');
  }

}
