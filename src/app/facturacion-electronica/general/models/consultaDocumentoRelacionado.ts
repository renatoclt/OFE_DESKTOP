export class ConsultaDocumentoRelacionado {

    public id: number;
    public idComprobante: string;
    public tipoComprobante: string;
    public nombreComprobante: string;
    public numeroComprobante: string;
    public serie: string;
    public correlativo: string;
    public fechaEnvio: string;
    public nombreEstado: string;
    public codigoEstado: number;
    public importeTotal: string;
    public importeAUsar: string;

    constructor() {
        this.id = -1;
        this.idComprobante = "";
        this.tipoComprobante = '';
        this.nombreComprobante = '';
        this.numeroComprobante = '';
        this.serie = '';
        this.correlativo = '';
        this.fechaEnvio = '';
        this.nombreEstado = '';
        this.codigoEstado = -1;
        this.importeTotal = '';
        this.importeAUsar = '';
    }
}
