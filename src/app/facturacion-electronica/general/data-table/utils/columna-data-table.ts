export class ColumnaDataTable {
  cabecera: string;
  cabeceraEstilo: {};

  atributo: any;
  atributoTipo: string;
  atributoEstilo: {};

  estiloDefecto: {};

  constructor(cabecera: string, atributo: any, atributoEstilo?: {}, atribtutoTipo ?: string) {
    this.estiloDefecto = {'text-align': 'center'};

    this.cabecera = cabecera;
    this.cabeceraEstilo = this.estiloDefecto;

    this.atributo = atributo;
    this.atributoEstilo = atributoEstilo ? atributoEstilo : this.estiloDefecto;
    this.atributoTipo = atribtutoTipo;
  }
}
