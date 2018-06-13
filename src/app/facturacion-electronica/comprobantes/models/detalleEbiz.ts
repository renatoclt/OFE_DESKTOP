import { DetalleEbizDetalle } from './detalleEbizDetalle';

// dto producto de comprobante
export class DetalleEbiz {

    public descripcionItem: string;
    public idRegistroUnidad: string;
    public idTablaUnidad: string;
    public codigoUnidadMedida: string;
    public posicion: string;
    public codigoItem: string;
    public precioUnitario: string;
    public precioTotal: string;
    public cantidad: string;
    public montoImpuesto: string;
    public detalle: DetalleEbizDetalle;
    // id se usa como identificador para las tablas
    public id: number;
    public tipoProducto: number;
    public tipoComprobante: string;
    public productoBase: string;
    public igv: number;
    public montoIgv: string;
    public numeroSeguimiento: string;
    public numeroGuia: string;
    public nombreunidadMedida: string;
    public tipoGuia: string;
    public tipoSpot: string;
    public porcentajeImpuesto: string;
    public descuento: string;
    public idTipoItemFactura: number;

    constructor() {
        this.idTipoItemFactura = 0;
        //  this.numeroSeguimiento = '';
        //  this.numeroGuia = '';
        this.descripcionItem = '';
        this.codigoUnidadMedida = '';
        //  this.nombreunidadMedida = '';
        this.posicion = '';
        this.codigoItem = '';
        this.precioUnitario = '';
        this.precioTotal = '';
        this.cantidad = '';
        //  this.tipoGuia = '';
        //  this.tipoSpot = '';
        //  this.porcentajeImpuesto = '';
        this.montoImpuesto = '';
        this.detalle = new DetalleEbizDetalle();
    }
}
