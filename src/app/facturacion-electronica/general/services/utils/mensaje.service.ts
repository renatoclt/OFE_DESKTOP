import { Injectable } from '@angular/core';

declare var swal;
@Injectable()
export class MensajeService{
    /**
     * 
     * @param {string} titulo
     * @param {string} mensaje
     * @param {string} tipoAlerta
     * @param {string} botonLabel => label boton cierre
     */
    public modalMensajeSimple(titulo: string, mensaje: string, tipoAlerta: string, botonLabel = 'Sí') {
        swal({
            title: titulo,
            html:
                '<div class="text-center"> ' + mensaje + '</div>',
            type: tipoAlerta,
            confirmButtonText: botonLabel,
            confirmButtonClass: 'btn btn-warning',
        });
    }
    public notificacionErrorServidor() {
        swal({
            title: 'Alerta',
            html:
                '<div class="text-center"> ' +
                'El sistema no se encuentra disponible en estos momentos, intentelo mas tarde.' +
                '</div>',
            type: 'warning',
            confirmButtonText: 'Sí',
            confirmButtonClass: 'btn btn-warning'
        });
    }
}
