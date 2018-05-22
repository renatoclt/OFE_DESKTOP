export class DocumentoParametro {
    public idParametro: string;
    public descripcionParametro: string;
    public json: string;
    public jsonn: JsonDocumentoParametro;
    constructor() {
        this.jsonn = new JsonDocumentoParametro();
    }
}
export class JsonDocumentoParametro {
    public tipo: number;
    public valor: string;
    public auxiliarEntero: number;
    public auxiliarCaracter: string;
    public auxiliarFecha: string;
    public auxiliarImporte: number;
}
