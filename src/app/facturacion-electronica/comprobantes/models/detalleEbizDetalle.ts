export class DetalleEbizDetalle {
    public idTipoIgv: string;
    public codigoTipoIgv: string;
    public descripcionTipoIgv: string;
    public idTipoIsc: string;
    public codigoTipoIsc: string;
    public descripcionTipoIsc: string;
    public idTipoPrecio: string;
    public codigoTipoPrecio: string;
    public descripcionTipoPrecio: string;
    public idProducto: string;
    public numeroItem: string;
    public precioUnitarioVenta: string;
    public unidadMedida: string;
    public subtotalVenta: string;
    public subtotalIgv: string;
    public subtotalIsc: string;

    public pesoBruto: string;
    public pesoNeto: string;
    public pesoTotal: string;
    public descuento: string;

    constructor() {
        this.idTipoIgv = '';
        this.codigoTipoIgv = '';
        this.descripcionTipoIgv = '';
        this.idTipoIsc = '';
        this.codigoTipoIsc = '';
        this.descripcionTipoIsc = '';
        this.idTipoPrecio = '';
        this.codigoTipoPrecio = '';
        this.descripcionTipoPrecio = '';
        this.idProducto = '';
        this.numeroItem = '';
        this.unidadMedida = '';
        this.subtotalVenta = '';
        this.subtotalIgv = '';
        this.subtotalIsc = '';
        // this.pesoBruto = '';
        // this.pesoNeto = '';
        // this.pesoTotal = '';
        // this.descuento = '';
    }
}
