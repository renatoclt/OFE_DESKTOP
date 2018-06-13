import {TranslateService} from '@ngx-translate/core';
import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';

declare var $, swal;

class TipoMensaje {
  id: number;
  nombre: string;

  constructor(id: number, nombre: string) {
    this.id = id;
    this.nombre = nombre;
  }
}


@Injectable()
export class ManejoMensajes {
  labelContinuar: string;
  mensajeExitoso: TipoMensaje;
  mensajeAdvertencia: TipoMensaje;
  mensajeError: TipoMensaje;

  constructor(private _translateService: TranslateService) {
    this.iniciarVariables();
  }

  iniciarVariables() {
    this._translateService.get('continuar').take(1).subscribe(traducir => this.labelContinuar = traducir);
    this.iniciarTiposMensajes();

  }

  iniciarTiposMensajes() {
    this.mensajeExitoso = new TipoMensaje(1, 'success');
    this.mensajeAdvertencia = new TipoMensaje(2, 'warning');
    this.mensajeError = new TipoMensaje(3, 'error');
  }

  mostrarMensajeError(error: HttpErrorResponse = null, titulo: string = 'error', mensaje: string = '') {
    let mensajeError = mensaje;
    if (!mensajeError && error !== null) {
      mensajeError = this.obtenerMensajePorTipoError(error);
    }
    this.swalPersonalizado(this.mensajeError, titulo, mensajeError);
  }

  obtenerMensajePorTipoError(error: HttpErrorResponse) {
    let mensajeError = '';
    switch (error.status) {
      case 401:
        mensajeError = 'error401';
        break;
      case 500:
        mensajeError = 'error500';
        break;


    }
    return mensajeError;
  }

  mostrarMensajeAdvertencia(titulo: string = '', mensaje: string = '') {
    this._translateService.get(titulo).take(1).subscribe(traducir => titulo = traducir);
    this._translateService.get(mensaje).take(1).subscribe(traducir => mensaje = traducir);
    this.swalPersonalizado(this.mensajeAdvertencia, titulo, mensaje);
  }

  mostrarMensajeExitoso(titulo: string = 'accionExitosa', mensaje: string = '') {
    this._translateService.get(titulo).take(1).subscribe(traducir => titulo = traducir);
    this._translateService.get(mensaje).take(1).subscribe(traducir => mensaje = traducir);
    this.swalPersonalizado(this.mensajeExitoso, titulo, mensaje);
  }

  swalPersonalizado(tipoMensaje: TipoMensaje, titulo: string, mensaje: string) {
    const that = this;
    swal({
      type: tipoMensaje.nombre,
      title: titulo,
      text: mensaje,
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: that.labelContinuar,
      buttonsStyling: false
    });
  }


}
