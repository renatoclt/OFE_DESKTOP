import { Injectable } from '@angular/core';

@Injectable()
export class EstadoArchivoService {
    TIPO_ESTADO_ARCHIVO_CON_ERROR = 1;
    TIPO_ESTADO_ARCHIVO_CON_ERROR_NOMBRE = 'Con Error';
    TIPO_ESTADO_ARCHIVO_EN_PROCESO = 2;
    TIPO_ESTADO_ARCHIVO_EN_PROCESO_NOMBRE = 'En Proceso';
    TIPO_ESTADO_ARCHIVO_PROCESADO = 3;
    TIPO_ESTADO_ARCHIVO_PROCESADO_NOMBRE = 'Procesado';
}
