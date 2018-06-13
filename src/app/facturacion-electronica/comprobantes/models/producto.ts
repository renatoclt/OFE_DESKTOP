export class Producto {
    public tipoProducto: number;
    public txtCantidad: string;
    public txtCodigo: string;
    public txtDescripcion: string;
    public cmbUnidadMedida: number;
    public cmbTipoPrecioVenta: number;
    public txtValorUnitario: string;
    public txtDescuento: string;
    public cmbCalculoIsc: number; // Calculo Isc
    public txtIsc: string;
    public cmbIgv: number;
    public cmbDescripcionIgv: number;
    public txtValorVenta: string;

    constructor() {
        this.tipoProducto = null;
        this.txtCantidad = null;
        this.txtCodigo = null;
        this.txtDescripcion = null;
        this.cmbUnidadMedida = null;
        this.cmbTipoPrecioVenta = null;
        this.txtValorUnitario = null;
        this.txtDescuento = null;
        this.cmbCalculoIsc = null;
        this.txtIsc = null;
        this.cmbIgv = null;
        this.cmbDescripcionIgv = null;
        this.txtValorVenta = null;
    }
}
