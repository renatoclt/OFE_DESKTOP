import {Serie} from '../../../general/models/configuracionDocumento/serie';
import {Parametros} from '../../../general/models/parametros/parametros';

export class PercepcionCabecera {
  serie: Serie;
  fechaPago: string;
  tipoMoneda: string;
  observacion: string;
  totalComprobante: string;
  tipoPorcentajePercepcion: Parametros;
  porcentajePercepcion: number;

  constructor() {
    this.serie = null;
    this.fechaPago = '';
    this.tipoMoneda = '';
    this.observacion = '';
    this.totalComprobante = '0.00';
    this.tipoPorcentajePercepcion = null;
    this.porcentajePercepcion = 0;
  }
}
