import {Injectable} from '@angular/core';

@Injectable()
export class EstilosServices {
  constructor() {

  }

  public eliminarEstiloInputAutocomplete(idHtml: string, estilo: string) {
    setTimeout(function () {
      $('#' + idHtml).parent().parent().removeClass(estilo);
    }, 200);
  }

  public agregarEstiloInputAutocomplete(idHtml: string, estilo: string) {
    setTimeout(function () {
      $('#' + idHtml).parent().parent().addClass(estilo);
    }, 200);
  }

  public eliminarEstiloInput(idHtml: string, estilo: string) {
    setTimeout(function () {
      $('#' + idHtml).parent().removeClass(estilo);
    }, 200);
  }

  public eliminarEstilosTodosTag(estilo: string, tag: string) {
    setTimeout(function () {
      $(tag).parent().removeClass(estilo);
    }, 200);
  }


  public agregarEstiloInput(idHtml: string, estilo: string) {
    setTimeout(function () {
      $('#' + idHtml).parent().addClass(estilo);
    }, 200);
  }
}
