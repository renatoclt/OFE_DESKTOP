import {PercepcionCrearDocumentoEntidad} from './percepcion-crear-documento-entidad';
import {PercepcionCrearDocumentoParametro} from './percepcion-crear-documento-parametro';
import {PercepcionCrearDocumentoReferencia} from './percepcion-crear-documento-referencia';

export class PercepcionCrear {
  numeroComprobante: string;
  rucProveedor: string;
  rucComprador: string;
  idTipoComprobante: string;
  tipoComprobante: string;
  razonSocialProveedor: string;
  razonSocialComprador: string;
  moneda: string;
  fechaEmision: number;
  observacionComprobante: string;
  montoPagado: string;
  monedaDescuento: string;
  montoDescuento: string;
  descuento: string;
  totalComprobante: string;
  tipoItem: string;
  porcentajeImpuesto: string;
  idSerie: string;
  documentoEntidad: PercepcionCrearDocumentoEntidad[];
  documentoParametro: PercepcionCrearDocumentoParametro[];
  documentoReferencia: PercepcionCrearDocumentoReferencia[];

  constructor() {
    this.numeroComprobante = '';
    this.rucProveedor = '';
    this.rucComprador = '';
    this.idTipoComprobante = '';
    this.tipoComprobante = '';
    this.razonSocialProveedor = '';
    this.razonSocialComprador = '';
    this.moneda = '';
    this.fechaEmision = null;
    this.observacionComprobante = '';
    this.montoPagado = '0.00';
    this.monedaDescuento = '';
    this.montoDescuento = '0.00';
    this.descuento = '0.00';
    this.totalComprobante = '0.00';
    this.tipoItem = '';
    this.porcentajeImpuesto = '0.00';
    this.idSerie = '';
    this.documentoEntidad = [];
    this.documentoParametro = [];
    this.documentoReferencia = [];
  }
}
