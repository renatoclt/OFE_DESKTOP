export class PercepcionCrearDocumentoReferencia {
  tipoDocumentoOrigen: string;
  tipoDocumentoOrigenDescripcion: string;

  idDocumentoDestino: string;
  tipoDocumentoDestino: string;
  tipoDocumentoDestinoDescripcion: string;
  serieDocumentoDestino: string;
  correlativoDocumentoDestino: string;
  fechaEmisionDestino: number;
  totalImporteDestino: string;
  totalImporteAuxiliarDestino: string;
  totalPorcentajeAuxiliarDestino: string;
  monedaDestino: string;
  totalMonedaDestino: string;

  auxiliar1: string;
  auxiliar2: string;

  constructor() {
    this.tipoDocumentoOrigen = '';
    this.tipoDocumentoDestinoDescripcion = '';

    this.idDocumentoDestino = '';
    this.tipoDocumentoDestino = '';
    this.tipoDocumentoDestinoDescripcion = '';
    this.serieDocumentoDestino = '';
    this.correlativoDocumentoDestino = '';
    this.fechaEmisionDestino = null;
    this.totalImporteDestino = '0.00';
    this.totalImporteAuxiliarDestino = '0.00';
    this.totalPorcentajeAuxiliarDestino = '0.00';
    this.monedaDestino = '';
    this.totalMonedaDestino = '';

    this.auxiliar1 = '0.00';
    this.auxiliar2 = '0.00';
  }
}
