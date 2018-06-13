export class DocumentoReferencia {
    public idDocumentoDestino: string;
    public tipoDocumentoOrigen: string;
    public tipoDocumentoDestino: string;
    public serieDocumentoDestino: string;
    public fechaEmisionDestino: string;
    public fechaEmisionDocumentoDestino: number;
    public totalImporteDestino: string;
    public totalImporteAuxiliarDestino: string;
    public totalPorcentajeAuxiliarDestino: string;
    public tipoDocumentoOrigenDescripcion: string;
    public tipoDocumentoDestinoDescripcion: string;
    public monedaDestino: string;
    public totalMonedaDestino: string;
    public auxiliar1: string;
    public auxiliar2: string;
    public anticipo: string;
    
    public id: number;
    public idComprobante: string;
    public nombreTipoDocumento: string;
    public correlativoDocumentoDestino: string;
    public estadoTemporal: boolean;

    constructor() {
        this.estadoTemporal = false;
    }
}
