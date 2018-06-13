import {TablaMaestra} from '../../../general/models/documento/tablaMaestra';
import {Parametros} from '../../../general/models/parametros/parametros';
import {Comprobante} from '../../../general/models/comprobantes/comprobante';

export class PercepcionCrearDetalle {
  id: string;
  comprobante: Comprobante;
  tipoComprobante: TablaMaestra;
  idComprobante: string;
  serieComprobante: string;
  correlativoComprobante: string;
  numeroComprobante: string;

  fechaEmisionComprobante: string;
  monedaComprobante: TablaMaestra;
  importeTotalComprobante: string;
  tipoCambioComprobante: string;
  importeSolesComprobante: string;

  tipoPorcentajePercepcion: Parametros;
  porcentajePercepcion: number;
  montoPercepcion: string;

  constructor() {
    this.id = '';
    this.comprobante = null;
    this.tipoComprobante = null;
    this.idComprobante = '';
    this.serieComprobante = '';
    this.correlativoComprobante = '';
    this.numeroComprobante = '';
    this.fechaEmisionComprobante = '-';
    this.monedaComprobante = null;
    this.importeTotalComprobante = '0.00';
    this.tipoCambioComprobante = '1.00';
    this.importeSolesComprobante = '0.00';
    this.tipoPorcentajePercepcion = null;
    this.porcentajePercepcion = 0;
    this.montoPercepcion = '0.00';
  }
}
