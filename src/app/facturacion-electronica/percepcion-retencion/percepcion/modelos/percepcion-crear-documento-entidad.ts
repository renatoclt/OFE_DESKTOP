export class PercepcionCrearDocumentoEntidad {
  idTipoEntidad: number;
  tipoDocumento: string;
  documento: string;
  direccionFiscal: string;
  denominacion: string;

  correoElectronico: string;
  constructor() {
    this.idTipoEntidad = 0;
    this.tipoDocumento = '';
    this.documento = '';
    this.direccionFiscal = '';
    this.denominacion = '';
    this.correoElectronico = '';
  }
}
