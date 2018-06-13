import {Entidad} from '../../general/models/organizacion/entidad';
import {Rdetalle} from './rdetalle';

export class PrincipalRetencion {
  id: string;
  numeroComprobante: string;
  idProveedor: string;
  idOrganizacionCompradora: string;
  rucProveedor: string;
  rucComprador: string;
  estadoComprobante: string;
   flagPlazoPago:  string;
   flagRegistroEliminado: string;
  flagOrigenComprobante: string;
  flagOrigenCreacion: number;
  idTablaTipoComprobante: string;
  idRegistroTipoComprobante: string;
  idTipoComprobante: string;
  idGuia: number;
  usuarioCreacion: string;
  usuarioModificacion: string;
  razonSocialProveedor: string;
  razonSocialComprador: string;
  moneda: string;
  fechaRegistro: string;
  fechaEmision: number;
  fechaCreacion: string;
  fechaVencimiento: string;
  fechaEnvio: Date;
  fechaCambioEstado: Date;
  observacionComprobante: string;
  impuestoGvr: number;
  tipoComprobante: string;
  estado: string;
  version: string;
  numeroGuia: number;
  montoComprobante: number;
  logo: string;
  firma: string;
  montoPagado: number;
  pagoBanco: string;
  tipoDocumentoDescuento: string;
  numeroDocumentoDescuento: string;
  monedaDescuento: string;
  montoDescuento: number;
  numeroCheque: string;
  tipoFactura: string;
  igv: number;
  isc: number;
  otrosTributos: number;
  descuento: number;
  importeReferencial: number;
  subtotalComprobante: number;
  totalComprobante: number;
  idIndicadorImpuesto: number;
  descripcionIndicadorImpuesto: string;
  tipoItem: number;
  fechaDocumentoRetencion: string;
  tipoEmision: string;
  porcentajeDetracction: string;
  porcentajeImpuesto: string;
  idTablaEstado: number;
  idRegistroEstadoProveedor: number;
  idRegistroEstadoComprador: number;
  idTablaMoneda: string;
  idRegistroMoneda: string;
  idSerie: string;
  detalleEbiz: any;
  documentoParametro: any;
  documentoConcepto: any;
  documentoReferencia: Rdetalle[]= [];
  documentoEntidad: Entidad[]= []
  constructor() {

  }
}
