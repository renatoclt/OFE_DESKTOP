export class CabeceraFactura {
    public serie: string;
    public ruc: string;
    public razonsSocial: string;
    public detraccion: string;
    public fechaEmision: string;
    public fechaVencimiento: string;
    public tipoMoneda: string;
    public sumaOtrosTributos: string;
    public sumaOtrosCargos: string;
    public observaciones: string;
    public direccionFiscal: string;
    public correo: string;
    public tipoDocumento: string;
    public numeroDocumento: string;
    public idEntidadCliente: string;
    public ubigeoCliente: string;
    constructor() {
        this.serie = '';
        this.ruc = '';
        this.razonsSocial = '';
        this.detraccion = '';
        this.fechaEmision = '';
        this.fechaVencimiento = '';
        this.tipoMoneda = '';
        this.sumaOtrosCargos = '';
        this.sumaOtrosTributos = '';
        this.observaciones = '';
        this.direccionFiscal = '';
        this.correo = '';
        this.tipoDocumento = '';
        this.numeroDocumento = '';
    }
}
