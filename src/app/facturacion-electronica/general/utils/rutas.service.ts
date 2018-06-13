import { Injectable } from '@angular/core';

@Injectable()
export class RutasService {
    public URL_COMPROBANTE_BOLETA_CREAR = 'comprobantes/boleta/crear';
    public URL_COMPROBANTE_BOLETA_DOCUMENTO_RELACIONADO = 'comprobantes/boleta/crear/docRelacionado';
    public URL_COMPROBANTE_BOLETA_DOCUMENTO_RELACIONADO_BUSCAR = 'comprobantes/boleta/crear/docRelacionado/buscar';
    public URL_COMPROBANTE_BOLETA_SERVICIO_AGREGAR = 'comprobantes/boleta/crear/servicio/agregar';
    public URL_COMPROBANTE_BOLETA_SERVICIO_EDITAR = 'comprobantes/boleta/crear/servicio/editar';
    public URL_COMPROBANTE_BOLETA_BIEN_AGREGAR = 'comprobantes/boleta/crear/bien/agregar';
    public URL_COMPROBANTE_BOLETA_BIEN_EDITAR = 'comprobantes/boleta/crear/bien/editar';
    public URL_COMPROBANTE_BOLETA_VISTA_PREVIA = 'comprobantes/boleta/crear/vistaprevia';
    public URL_COMPROBANTE_BOLETA_EMITIR = 'comprobantes/boleta/emitir';


    public URL_COMPROBANTE_FACTURA_CREAR = 'comprobantes/factura/crear';
    public URL_COMPROBANTE_FACTURA_DOCUMENTO_RELACIONADO = 'comprobantes/factura/crear/docRelacionado';
    public URL_COMPROBANTE_FACTURA_DOCUMENTO_RELACIONADO_BUSCAR = 'comprobantes/factura/crear/docRelacionado/buscar';
    public URL_COMPROBANTE_FACTURA_SERVICIO_AGREGAR = 'comprobantes/factura/crear/servicio/agregar';
    public URL_COMPROBANTE_FACTURA_SERVICIO_EDITAR = 'comprobantes/factura/crear/servicio/editar';
    public URL_COMPROBANTE_FACTURA_BIEN_AGREGAR = 'comprobantes/factura/crear/bien/agregar';
    public URL_COMPROBANTE_FACTURA_BIEN_EDITAR = 'comprobantes/factura/crear/bien/editar';
    public URL_COMPROBANTE_FACTURA_VISTA_PREVIA = 'comprobantes/factura/crear/vistaprevia';
    public URL_COMPROBANTE_FACTURA_EMITIR = 'comprobantes/factura/emitir';
    public URL_COMPROBANTE_EDITAR_BASE= 'comprobantes/factura/editarProducto';
    public URL_RETENCION_CREAR = 'percepcion-retencion/retencion/crear';
    public URL_RETENCION_CREAR_MASIVA = 'percepcion-retencion/retencion/crear/masiva';

    public URL_CONSULTAR_COMPROBANTE = 'comprobantes/consultar';
    public URL_CONSULTAR_COMPROBANTE_FACTURA_VISUALIZAR = '/visualizar/factura';
    public URL_CONSULTAR_COMPROBANTE_BOLETA_VISUALIZAR = '/visualizar/boleta';
    public URL_CONSULTAR_COMPROBANTE_NOTA_CREDITO_VISUALIZAR = '/visualizar/notaCredito';
    public URL_CONSULTAR_COMPROBANTE_NOTA_DEBITO_VISUALIZAR = '/visualizar/notaDebito';

    public URL_RESUMEN_BAJAS = 'resumen-bajas/crear';
    public URL_NOTA_CREDITO_CREAR = 'comprobantes/notaCredito/crear';
    public URL_NOTA_DEBITO_CREAR = 'comprobantes/notaDebito/crear';
}
