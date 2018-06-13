import {DocumentoConceptoGeneral} from '../../../general/models/comprobantes/documentoConceptoGeneral';

export class DocumentoConceptoNotaCredito extends DocumentoConceptoGeneral {
  idConcepto: string;
  codigoConcepto: string;
  descripcionConcepto: string;
  importe: string;

  constructor() {
    super();
    this.idConcepto = '';
    this.codigoConcepto = '';
    this.descripcionConcepto = '';
    this.importe = '0.00';
  }
}
