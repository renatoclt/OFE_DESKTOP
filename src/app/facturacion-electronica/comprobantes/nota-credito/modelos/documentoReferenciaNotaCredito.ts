import {DocumentoReferenciaGeneral} from '../../../general/models/comprobantes/documentoReferenciaGeneral';

export class DocumentoReferenciaNotaCredito extends DocumentoReferenciaGeneral {
  idDocumentoDestino: string;
  tipoDocumentoOrigen: string;
  tipoDocumentoDestino: string;
  serieDocumentoDestino: string;
  correlativoDocumentoDestino: string;
  fechaEmisionDestino: number;
  totalImporteDestino: string;
  totalImporteAuxiliarDestino: string;
  totalPorcentajeAuxiliarDestino: string;
  tipoDocumentoOrigenDescripcion: string;
  tipoDocumentoDestinoDescripcion: string;
  monedaDestino: string;
  totalMonedaDestino: string;
  auxiliar1: string;
  auxiliar2: string;

  constructor() {
    super();
    this.idDocumentoDestino = '';
    this.tipoDocumentoOrigen = '';
    this.tipoDocumentoDestino = '';
    this.serieDocumentoDestino = '';
    this.correlativoDocumentoDestino = '';
    this.fechaEmisionDestino = 0;
    this.totalImporteDestino = '0.00';
    this.totalImporteAuxiliarDestino = '0.00';
    this.totalPorcentajeAuxiliarDestino = '0.00';
    this.tipoDocumentoOrigenDescripcion = '';
    this.tipoDocumentoDestinoDescripcion = '';
    this.monedaDestino = '';
    this.totalMonedaDestino = '0.00';
    this.auxiliar1 = '';
    this.auxiliar2 = '';
  }
}
