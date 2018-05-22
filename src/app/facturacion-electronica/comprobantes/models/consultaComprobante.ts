import { Evento } from "app/facturacion-electronica/resumen-bajas/models/comprobantes-query";

export class ConsultaComprobante {
    public id: number;
    public inIdcomprobantepago: string;
    public uuid: string;
    public tipoComprobante: string;
    public nombreComprobante: string;
    public tipoDocumento: string;
    public numerDocumento: string;
    public ticket: string;
    public serie: string;
    public correlativo: string;
    public fechaEmision: string;
    public fechaEnvio: string;
    public tsFechacreacion: number;
    public nombreEstado: string;
    public codigoEstado: number;
    public importeTotal: string;
    public importeAUsar: string;
    public numeroComprobante: string;
    public dePagomontopagado: string;
    public vcSerie: string;
    public vcCorrelativo: string;
    public tsFechaemision: string;
    public chIdtipocomprobante: string;
    public eventos: Evento[] = [];
    constructor() {}
}
