import { DetalleEbiz } from './detalleEbiz';
import { DocumentoConcepto } from './documentoConcepto';
import { DocumentoParametro } from './documentoParametro';
import { DocumentoReferencia } from './documentoReferencia';
import { DocumentoEntidad } from 'app/facturacion-electronica/comprobantes/models/documentoEntidad';

export class FacturaEbiz {
    public numeroComprobante: string;
    public rucProveedor: string;
    public rucComprador: string;
    public idTablaTipoComprobante: string;
    public idRegistroTipoComprobante: string;
    public idTipoComprobante: string;
    public razonSocialProveedor: string;
    public razonSocialComprador: string;
    public moneda: string;
    public fechaEmision: number;
    public observacionComprobante: string;
    public tipoComprobante: string;
    public montoPagado: string;
    public igv: string;
    public isc: string;
    public otrosTributos: string;
    public descuento: string;
    public importeReferencial: string;
    public subtotalComprobante: string;
    public totalComprobante: string;
    public tipoItem: string;
    public idTablaMoneda: string;
    public idRegistroMoneda: string;
    public usuarioCreacion: string;
    public usuarioModificacion: string;
    public idSerie: string;


    public rucProveedorBase: string;
    public rucCompradorBase: string;
    public pagoBanco: string;
    public numeroCheque: string;
    public montoIgv: number;
    public direccionComprador: string;
    public direccionProveedor: string;
    public idProveedor: string;
    public idOrganizacionCompradora: string;
    public idGuia: string;
    public nombreMoneda: string;
    public fechaCreacion: string;
    public fechaVencimiento: number;
    public impuestoGvr: string;
    public numeroGuia: string;
    public montoComprobante: string;
    public tipoDocumentoDescuento: string;
    public numeroDocumentoDescuento: string;
    public monedaDescuento: string;
    public montoDescuento: string;
    public tipoFactura: string;
    public idIndicadorImpuesto: string;
    public descripcionIndicadorImpuesto: string;
    public fechaDocumentoRetencion: string;
    public tipoEmision: string;
    public porcentajeImpuesto: string;
    public porcentajeDetracction: string;
    public idTablaEstado: string;
    public idRegistroEstadoProveedor: string;
    public idRegistroEstadoComprador: string;

    //  Atributos creados para almacenar y calcular localmente Sumatorias de datos finales de Factura
    public montoGravadas: number;
    public montoInafectas: number;
    public montoExoaneradas: number;
    public totalDescuentos: number;
    public sumaOtrosTributos: number;
    public sumaOtrosCargos: number;
    public totalAnticipos: number;
    public sumaAnticipos: number;
    public sumaIsc: number;
    public sumaIgv: number;
    public subTotal: number;
    public importeTotal: number;
    public detraccion: number;
    public serieNombre: string;
    public subTotalComprobanteConcepto: any;
    public detalleEbiz: DetalleEbiz[];
    public documentoEntidad: DocumentoEntidad[];
    public documentoConcepto: DocumentoConcepto[];
    public documentoParametro: DocumentoParametro[];
    public documentoReferencia: DocumentoReferencia[];
    constructor() {
        this.importeReferencial = '0.00';
        this.montoIgv = 0.00;
        this.montoGravadas = 0.00;
        this.montoInafectas = 0.00;
        this.montoExoaneradas = 0.00;
        this.totalDescuentos = 0.00;
        this.sumaOtrosTributos = 0.00;
        this.sumaOtrosCargos = 0.00;
        this.totalAnticipos = 0.00;
        this.sumaAnticipos = 0.00;
        this.sumaIsc = 0.00;
        this.sumaIgv = 0.00;
        this.subTotal = 0.00;
        this.importeTotal = 0.00;
        this.documentoEntidad = [
            new DocumentoEntidad(),
            new DocumentoEntidad()
        ];
        this.documentoConcepto = [];
        this.documentoParametro = [];
        this.documentoReferencia = [];
    }
}
