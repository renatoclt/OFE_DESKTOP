import { Injectable } from '@angular/core';

@Injectable()
export class ConstantesService {
    public TIPO_COMPROBANTE_CONSULTA_FACTURA = 1;
    public ITEM_SERVICIO_CREAR = 1;
    public ITEM_SERVICIO_EDITAR = 2;
    public ITEM_BIEN_CREAR = 3;
    public ITEM_BIEN_EDITAR = 4;
    public ITEM_SERVICIO_CREAR_TITULO = 'ingresarServicio';
    public ITEM_SERVICIO_EDITAR_TITULO = 'editarServicio';
    public ITEM_BIEN_CREAR_TITULO = 'ingresarBien';
    public ITEM_BIEN_EDITAR_TITULO = 'editarBien';
}
