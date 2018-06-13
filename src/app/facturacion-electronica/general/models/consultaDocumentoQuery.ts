export class ConsultaDocumentoQuery {
    public idEntidadEmisora: string;
    public tipoComprobanteTabla: string;
    public tipoComprobanteRegistro: string;
    public fechaDel: string;
    public fechaAl: string;
    public tipoDocumento: string;
    public numeroDocumento: string;
    public ticket: string;
    public estado: string;
    public serie: string;
    public correlativoInicial: string;
    public correlativoFinal: string;
    public numeroPagina: string;
    public registroPorPagina: string;
    public ordenar: string;
    public fechaBajaDel: string;
    public fechaBajaAl: string;
    public ticketBaja: string;
    public seriecorrelativo: string;
    public ticketResumen: string;
    public anticipo: string;
    public importeTotal: string;
    public serieCorrelativo: string;
    constructor() {
        this.tipoComprobanteTabla = '';
        this.tipoComprobanteRegistro = '';
        this.fechaAl = '';
        this.fechaDel = '';
        this.tipoDocumento = '';
        this.numeroDocumento = '';
        this.ticket = '';
        this.estado = '';
        this.serie = '';
        this.correlativoInicial = '';
        this.correlativoFinal = '';
        this.numeroPagina = '';
        this.registroPorPagina = '';
        this.ordenar = '';
        this.fechaBajaDel = '';
        this.fechaBajaAl = '';
        this.ticketBaja = '';
        this.importeTotal = '';
        this.ticketResumen = '';
        this.anticipo = 'N';
        this.serieCorrelativo = '';
    }
}
