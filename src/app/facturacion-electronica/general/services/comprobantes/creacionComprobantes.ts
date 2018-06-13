import {Injectable} from '@angular/core';
import {Servidores} from '../servidores';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { ComprobanteEmitido } from 'app/facturacion-electronica/general/models/comprobantes/comprobanteEmitido';
import { SpinnerService } from 'app/service/spinner.service';
import {NotaCredito} from '../../../comprobantes/nota-credito/modelos/notaCredito';
import {NotaDebito} from '../../../comprobantes/nota-debito/modelos/notaDebito';
import {TranslateService} from '@ngx-translate/core';
import {DetalleNotaCredito} from '../../../comprobantes/nota-credito/modelos/detalleNotaCredito';
import {PercepcionCrear} from '../../../percepcion-retencion/percepcion/modelos/percepcion-crear';

declare var swal: any;
@Injectable()
export class CreacionComprobantes {
  private urlNotaCredito: string;
  private urlFactura: string;
  private urlBoleta: string;
  private pathNotaCredito: string;
  private urlNotaDebito: string;
  private pathNotaDebito: string;
  private pathFactura: string;
  private pathBoleta: string;
  private pathPercepcion: string;
  private urlPercepcion: string;
  private labelContinuar: string;
  private labelRespuesta: string;
  private labelRespuestaSecundaria: string;
  private labelBotonRespuesta: string;

  constructor(private _servidores: Servidores,
              private httpClient:  HttpClient,
              private _spinnerService: SpinnerService,
              private _translate: TranslateService) {
    this.pathNotaCredito = '/notaDeCredito';
    this.pathNotaDebito = '/notaDeDebito';
    this.pathFactura = '/factura';
    this.pathBoleta = '/boleta';
    this.pathPercepcion = '/percepcion';

    this.urlNotaCredito = this._servidores.DOCUCMD + this.pathNotaCredito;
    this.urlNotaDebito = this._servidores.DOCUCMD + this.pathNotaDebito;
    this.urlFactura = this._servidores.DOCUCMD + this.pathFactura;
    this.urlBoleta = this._servidores.DOCUCMD + this.pathBoleta;
    this.urlPercepcion = this._servidores.DOCUCMD + this.pathPercepcion;
    this._translate.get('continuar').subscribe(data => this.labelContinuar = data);
    this._translate.get('comprobanteGuardadoPendienteEnvio').subscribe(data => this.labelRespuesta = data);
  }

  crearNotaCredito(notaCredito: NotaCredito): BehaviorSubject<NotaCredito> {
    const that = this;
    const respuesta = new BehaviorSubject<NotaCredito>(null);
    this._translate.get('comprobanteGuardadoPendienteEnvio').subscribe(dataTranslate => that.labelRespuesta = dataTranslate);
    this._translate.get('verificarEstadoConsultaComprobante').subscribe(dataTranslate => that.labelRespuestaSecundaria = dataTranslate);
    this._spinnerService.set(true);
    notaCredito.detalleEbiz.map(
      item => {
        const cantidad = item.cantidad === '-' ? '0' : item.cantidad;
        const posicion = item.posicion === '-' ? '0' : item.posicion;
        item.codigoItem = item.codigoItem === '-' ? '' : item.codigoItem;
        item.detalle.unidadMedida = item.detalle.unidadMedida === '-' ? '' : item.detalle.unidadMedida;
        const numeroItem = item.detalle.numeroItem === '-' ? '0' : item.detalle.numeroItem;
        item.cantidad = Number(cantidad).toString();
        item.posicion = Number(posicion).toString();
        item.detalle.numeroItem = Number(numeroItem).toString();
      }
    );
    this.httpClient.post<NotaCredito>(this.urlNotaCredito, JSON.stringify(notaCredito)).subscribe(
      data => {
        this._spinnerService.set(false);
        swal({
          type: 'success',
          title: 'Acción Exitosa',
          html:
            '<div class="text-center">' + that.labelRespuesta + '</div>' +
            '<br>' +
            '<div class="text-center">' + that.labelRespuestaSecundaria + '</div>',
          confirmButtonClass: 'btn btn-success',
          confirmButtonText: 'VER NOTA DE CRÉDITO',
          buttonsStyling: false
        }).then(
          (result) => {
            respuesta.next(data);
          }, (dismiss) => {
            respuesta.next(data);
          });
      },
      error => {
        this._spinnerService.set(false);
        swal({
          type: 'error',
          title: 'No se pudo emitir el comprobante. Inténtalo nuevamente.',
          confirmButtonClass: 'btn btn-danger',
          confirmButtonText: that.labelContinuar,
          buttonsStyling: false
        });
        respuesta.error(error);
      }
    );
    return respuesta;
  }

  crearNotaDebito(notaDebito: NotaDebito): BehaviorSubject<NotaDebito> {
    const that = this;
    this._translate.get('comprobanteGuardadoPendienteEnvio').subscribe(dataTranslate => that.labelRespuesta = dataTranslate);
    this._translate.get('verificarEstadoConsultaComprobante').subscribe(dataTranslate => that.labelRespuestaSecundaria = dataTranslate);
    const respuesta = new BehaviorSubject<NotaCredito>(null);
    this._spinnerService.set(true);
    notaDebito.detalleEbiz.map(
      item => {
        const cantidad = item.cantidad === '-' ? '0' : item.cantidad;
        const posicion = item.posicion === '-' ? '0' : item.posicion;
        item.codigoItem = item.codigoItem === '-' ? '' : item.codigoItem;
        item.detalle.unidadMedida = item.detalle.unidadMedida === '-' ? '' : item.detalle.unidadMedida;
        const numeroItem = item.detalle.numeroItem === '-' ? '0' : item.detalle.numeroItem;
        item.cantidad = Number(cantidad).toString();
        item.posicion = Number(posicion).toString();
        item.detalle.numeroItem = Number(numeroItem).toString();
      }
    );
    this.httpClient.post<NotaCredito>(this.urlNotaDebito, JSON.stringify(notaDebito)).subscribe(
      data => {
        this._spinnerService.set(false);
        swal({
          type: 'success',
          title: 'Acción Exitosa',
          html:
            '<div class="text-center">' + that.labelRespuesta + '</div>' +
            '<br>' +
            '<div class="text-center">' + that.labelRespuestaSecundaria + '</div>',
          confirmButtonClass: 'btn btn-success',
          confirmButtonText: 'VER NOTA DE DÉBITO',
          buttonsStyling: false
        }).then(
          (result) => {
            respuesta.next(data);
          }, (dismiss) => {
            respuesta.next(data);
          });
      },
      error => {
        this._spinnerService.set(false);
        swal({
          type: 'error',
          title: 'No se pudo emitir el comprobante. Inténtalo nuevamente.',
          confirmButtonClass: 'btn btn-danger',
          confirmButtonText: that.labelContinuar,
          buttonsStyling: false
        });
        respuesta.error(error);
      }
    );
    return respuesta;
  }

  crearPercepcion(percepcion: PercepcionCrear): BehaviorSubject<PercepcionCrear> {
    const that = this;
    const respuesta = new BehaviorSubject<PercepcionCrear>(null);
    this._spinnerService.set(true);
    this.httpClient.post<PercepcionCrear>(this.urlPercepcion, JSON.stringify(percepcion)).subscribe(
      data => {
        this._translate.get('comprobanteGuardadoPendienteEnvio').subscribe(dataTranslate => that.labelRespuesta = dataTranslate);
        this._translate.get('verificarEstadoConsultaComprobante').subscribe(dataTranslate => that.labelRespuestaSecundaria = dataTranslate);
        this._translate.get('verPercepcion').subscribe(dataTranslate => that.labelBotonRespuesta = dataTranslate);
        this._spinnerService.set(false);
        swal({
          type: 'success',
          title: 'Acción Exitosa',
          html:
            '<div class="text-center">' + that.labelRespuesta + '</div>' +
            '<br>' +
            '<div class="text-center">' + that.labelRespuestaSecundaria + '</div>',
          confirmButtonClass: 'btn btn-success',
          confirmButtonText: that.labelBotonRespuesta,
          buttonsStyling: false
        }).then(
          (result) => {
            respuesta.next(data);
          }, (dismiss) => {
            respuesta.next(null);
          });
      },
      error => {
        this._spinnerService.set(false);
        swal({
          type: 'error',
          title: 'No se pudo emitir el comprobante. Inténtalo nuevamente.',
          confirmButtonClass: 'btn btn-danger',
          confirmButtonText: that.labelContinuar,
          buttonsStyling: false
        });
        respuesta.error(error);
      }
    );
    return respuesta;
  }

  crearFactura<FacturaEbiz>(comprobante: FacturaEbiz): BehaviorSubject<ComprobanteEmitido> {
    this._translate.get('continuar').subscribe(data => this.labelContinuar = data);
    const that  = this;
    const base =  new ComprobanteEmitido();
    const respuesta = new BehaviorSubject<ComprobanteEmitido>(null);
    this._spinnerService.set(true);
    console.log(JSON.stringify(comprobante));
    this.httpClient.post<ComprobanteEmitido>(this.urlFactura, JSON.stringify(comprobante)).subscribe(
      data => {
        this._translate.get('comprobanteGuardadoPendienteEnvio').subscribe(dataTranslate => that.labelRespuesta = dataTranslate);
        this._translate.get('verificarEstadoConsultaComprobante').subscribe(dataTranslate => that.labelRespuestaSecundaria = dataTranslate);
        this._translate.get('verFactura').subscribe(dataTranslate => that.labelBotonRespuesta = dataTranslate);
        this._spinnerService.set(false);
        swal({
          type: 'success',
          title: 'Acción Exitosa',
          html:
            '<div class="text-center">' + that.labelRespuesta + '</div>' +
            '<br>' +
            '<div class="text-center">' + that.labelRespuestaSecundaria + '</div>',
          confirmButtonClass: 'btn btn-success',
          confirmButtonText: that.labelBotonRespuesta,
          buttonsStyling: false
        }).then(
          (result) => {
            respuesta.next(data);
          }, (dismiss) => {
            respuesta.next(null);
          });
      },
      error => {
        this._spinnerService.set(false);
        swal({
          type: 'error',
          title: 'No se pudo emitir el comprobante. Inténtalo nuevamente.',
          confirmButtonClass: 'btn btn-danger',
          confirmButtonText: that.labelContinuar,
          buttonsStyling: false
        });
      }
    );
    return respuesta;
  }
  crearBoleta<FacturaEbiz>(comprobante: FacturaEbiz): BehaviorSubject<ComprobanteEmitido> {
    this._translate.get('continuar').subscribe(data => this.labelContinuar = data);
    const that  = this;
    const base =  new ComprobanteEmitido();
    const respuesta = new BehaviorSubject<ComprobanteEmitido>(null);
    this._spinnerService.set(true);
    console.log(JSON.stringify(comprobante));
    this.httpClient.post<ComprobanteEmitido>(this.urlBoleta, JSON.stringify(comprobante)).subscribe(
      data => {
        this._translate.get('comprobanteGuardadoPendienteEnvio').subscribe(dataTranslate => that.labelRespuesta = dataTranslate);
        this._translate.get('verificarEstadoConsultaComprobante').subscribe(dataTranslate => that.labelRespuestaSecundaria = dataTranslate);
        this._translate.get('verBoleta').subscribe(dataTranslate => that.labelBotonRespuesta = dataTranslate);
        this._spinnerService.set(false);
        swal({
          type: 'success',
          title: 'Acción Exitosa',
          html:
            '<div class="text-center">' + that.labelRespuesta + '</div>' +
            '<br>' +
            '<div class="text-center">' + that.labelRespuestaSecundaria + '</div>',
          confirmButtonClass: 'btn btn-success',
          confirmButtonText: that.labelBotonRespuesta,
          buttonsStyling: false
        }).then(
          (result) => {
            respuesta.next(data);
          }, (dismiss) => {
            respuesta.next(null);
          });
      },
      error => {
        this._spinnerService.set(false);
        swal({
          type: 'error',
          title: 'No se pudo emitir el comprobante. Inténtalo nuevamente.',
          confirmButtonClass: 'btn btn-danger',
          confirmButtonText: that.labelContinuar,
          buttonsStyling: false
        });
      }
    );
    return respuesta;
  }
}
