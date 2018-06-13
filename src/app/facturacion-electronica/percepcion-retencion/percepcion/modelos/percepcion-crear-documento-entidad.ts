export class PercepcionCrearDocumentoEntidad {
  idTipoEntidad: number;
  tipoDocumento: string;
  documento: string;
  denominacion: string;
  nombreComercial: string;
  direccionFiscal: string;
  ubigeo: string;
  correo: string;
  notifica: string;

  constructor() {
    this.idTipoEntidad = 0;
    this.tipoDocumento = '';
    this.documento = '';
    this.denominacion = '';
    this.nombreComercial = '';
    this.direccionFiscal = '';
    this.ubigeo = '';
    this.correo = '';
    this.notifica = 'S';
  }
}
