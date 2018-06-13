import {Retencionebiz} from './retencionebiz';


export class RetencionCabecera {
  serie: string;
  idserie: string;
  rucProveedor: number;
  rucComprador: number;
  direccioncomprador: string;
  direccionproveedor: string;
  estadoComprobante: string;
  idUsuarioCreacion: string;
  idUsuarioModificacion: string;
  razonSocialProveedor: string;
  razonSocialComprador: string;
  email: string;
  moneda: string;
  fecPago: Date;
  observacionComprobante: string;
  total: number;
  direccion: string;
  totalimporte: number;
  tipocomprobanteproveedor: string;
  idtipocomprobanteproveedor: string;
  idTablaTipoComprobante: string;
  idTipoComprobante: string;
  porcentajeImpuesto: string;
  constructor() {
    this.serie = '';
    this.idserie = '';
    this.rucProveedor = 0;
    this.rucComprador = 0;
    this.estadoComprobante = 'PENDIENTE';
    this.idUsuarioCreacion = 'GMENDEZ';
    this.idUsuarioModificacion = 'GMENDEZ';
    this.razonSocialProveedor = '';
    this.direccion = '';
    this.razonSocialComprador = '';
    this.moneda = '';
    this.observacionComprobante = '';
    this.total = 0;
    this.totalimporte = 0;
    this.tipocomprobanteproveedor = '';
    this.idtipocomprobanteproveedor = '';
    this.idTablaTipoComprobante = '';
    this.idTipoComprobante = '';
    this.email = '';
  }
}
