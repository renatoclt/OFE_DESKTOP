export class JsonDocumentoParametroNotaCredito {
  tipo: number;
  valor: string;
  auxiliarEntero: number;
  auxiliarCaracter: string;
  auxiliarFecha: string;
  auxiliarImporte: number;

  constructor() {
    this.tipo = 0;
    this.valor = '';
    this.auxiliarEntero = 0;
    this.auxiliarCaracter = '';
    this.auxiliarFecha = null;
    this.auxiliarImporte = 0;
  }
}
