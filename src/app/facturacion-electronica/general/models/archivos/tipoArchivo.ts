export class TipoArchivo {
  idArchivo: number;
  descripcion: string;
  tipoContenido: string;

  constructor(idArchivo: number,
              descripcion: string,
              tipoContenido: string) {
    this.idArchivo = idArchivo;
    this.descripcion = descripcion;
    this.tipoContenido = tipoContenido;
  }
}

export const TIPO_ARCHIVO_PDF = new TipoArchivo(1,'PDF','application/pdf');
export const TIPO_ARCHIVO_XML = new TipoArchivo(2,'XML','application/xml');
export const TIPO_ARCHIVO_CSV = new TipoArchivo(4,'CSV','application/vnd.ms-excel');
export const TIPO_ARCHIVO_CDR = new TipoArchivo(3,'CDR','application/zip');


export const TIPOS_ARCHIVOS: TipoArchivo[] = [
  TIPO_ARCHIVO_PDF,
  TIPO_ARCHIVO_CDR,
  TIPO_ARCHIVO_XML
];
