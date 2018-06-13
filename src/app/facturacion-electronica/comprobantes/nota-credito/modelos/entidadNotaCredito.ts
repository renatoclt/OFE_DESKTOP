import {EntidadGeneral} from '../../../general/models/organizacion/entidadGeneral';

export class EntidadNotaCredito extends EntidadGeneral {
  idTipoEntidad: string;
  descripcionTipoEntidad: string;
  idEntidad: string;
  tipoDocumento: string;
  documento: string;
  denominacion: string;
  nombreComercial: string;
  direccionFiscal: string;
  ubigeo: string;
  correo: string;
  notifica: string;

  constructor() {
    super();
    this.idTipoEntidad = '';
    this.descripcionTipoEntidad = '';
    this.idEntidad = '';
    this.tipoDocumento = '';
    this.documento = '';
    this.denominacion = '';
    this.nombreComercial = '';
    this.direccionFiscal = '';
    this.ubigeo = '';
    this.correo = '';
    this.notifica = '';
  }
}
