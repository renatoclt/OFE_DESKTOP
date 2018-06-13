export class LeyendaComprobante {
  importeReferencial: string;
  subTotal: string;
  total: string;
  montoPagado: string;
  descuentos: string;
  isc: string;
  igv: string;
  otrosTributos: string;
  constructor() {
    this.importeReferencial = '0.00';
    this.montoPagado = '0.00';
    this.descuentos = '0.00';
    this.subTotal = '0.00';
    this.igv = '0.00';
    this.isc = '0.00';
    this.total = '0.00';
    this.otrosTributos = '0.00';
  }
}
