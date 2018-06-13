import { Evento } from "../../resumen-bajas/models/comprobantes-query";

export class ConsultaPercepcionRetencion {
    public id: number;
    public inIdcomprobantepago: string;
    public uuid: string;
    public tipoComprobante: string;
    public nombreComprobante: string;
    public tipoDocumento: string;
    public numeroDocumento: string;
    public ticket: string;
    public serie: string;
    public correlativo: string;
    public fechaEmision: string;
    public fechaEnvio: string;
    public nombreEstado: string;
    public codigoEstado: number;
    public importeTotal: string;
    public importeAUsar: string;
    public numeroComprobante: string;
    public dePagomontopagado: string;
    public eventos: Evento[] = [];
    public vcSerie: string;
    public vcCorrelativo: string;
    public tsFechaemision: string;
    public chIdtipocomprobante: string;
    public chEstadocomprobantepago: string;
    public chEstadocomprobantepagocomp: string;
    public chMonedacomprobantepago: string;
    
    constructor() {}
}
