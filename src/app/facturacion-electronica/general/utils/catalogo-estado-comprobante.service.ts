import { Injectable } from '@angular/core';

@Injectable()
export class CatalogoEstadoComprobanteService {
    public ESTADO_PENDIENTE_ENVIO: 1;
    public ESTADO_PENDIENTE_ENVIO_NOMBRE: 'Pendiente de Envio';
    public ESTADO_PROCESAMIENTO_SUNAT: 2;
    public ESTADO_PROCESAMIENTO_SUNAT_NOMBRE: 'En Procesamiento';
    public ESTADO_AUTORIZADO: 3;
    public ESTADO_AUTORIZADO_NOMBRE: 'Autorizado';
    public ESTADO_RECHAZADO: 4;
    public ESTADO_RECHAZADO_NOMBRE: 'Rechazado';
    public ESTADO_AUTORIZADO_OBSERVADO: 5;
    public ESTADO_AUTORIZADO_OBSERVADO_NOMBRE: 'Autorizado con Observaciones';
    public ESTADO_ANULADO: 6;
    public ESTADO_ANULADO_NOMBRE: 'Anulado';
}
