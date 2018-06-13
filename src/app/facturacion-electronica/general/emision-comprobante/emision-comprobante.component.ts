import {Component, OnDestroy, OnInit} from '@angular/core';
import {CorreoService} from '../services/correo/correo.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ArchivoService} from '../services/archivos/archivo.service';
import {TipoArchivo, TIPOS_ARCHIVOS} from '../models/archivos/tipoArchivo';
import {TranslateService} from '@ngx-translate/core';
import {ComprobantesService} from '../services/comprobantes/comprobantes.service';
import {Subscription} from 'rxjs/Subscription';
import {PadreComprobanteService} from '../../comprobantes/services/padre-comprobante.service';

declare var $, swal: any;
@Component({
  selector: 'app-emision-comprobante',
  templateUrl: './emision-comprobante.component.html',
  styleUrls: ['./emision-comprobante.component.css']
})
export class EmisionComprobanteComponent implements OnInit, OnDestroy {
  pdfSrc: BehaviorSubject<{}>;
  tiposArchivos: TipoArchivo[];
  tituloComprobante: string;
  pdf: any;
  public idComprobante: string;
  public comprobante: any;
  private comprobanteSubscription: Subscription;
  public data: string;
  deshabilitar: BehaviorSubject<boolean>;
  deshabilitarSubscription: Subscription;
  archivoServicioSubscription: Subscription;
  archivoBaseSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private _correoService: CorreoService,
              private _archivoServicio: ArchivoService,
              private _translateService: TranslateService,
              private _comprobanteService: ComprobantesService,
              private _padreComprobanteService: PadreComprobanteService) {
    this._padreComprobanteService.actualizarComprobante(this.route.snapshot.data['codigo'], this.route.snapshot.data['mostrarCombo']);
    this.pdfSrc = new BehaviorSubject({data: []});
    this.tiposArchivos = TIPOS_ARCHIVOS;
    this.deshabilitar = new BehaviorSubject(true);
    this.comprobanteSubscription = new Subscription();
    this.deshabilitarSubscription = new Subscription();
    this.archivoServicioSubscription = new Subscription();
  }

  ngOnInit() {
    this.getDataComprobante();
    this.leerParametrosUrl();
  }

  ngOnDestroy() {
    this.deshabilitarSubscription.unsubscribe();
    this.archivoBaseSubscription.unsubscribe();
    this.archivoServicioSubscription.unsubscribe();
    this.comprobanteSubscription.unsubscribe();
  }

  public getDataComprobante() {
    this.route.params.subscribe(
      (params: Params) => {
        this.idComprobante = params['id'];
        this.obtenerArchivoParaMostrar();
      }
    );
  }

  leerParametrosUrl() {
    this.tituloComprobante = this.route.snapshot.data['titulo'];
  }

  imprimir() {
    this.archivoServicioSubscription = this._archivoServicio.retornarArchivoRetencionPercepcionbase(this.idComprobante)
      .subscribe(
        data => {
          if (data) {
            const winparams = 'dependent = yes, locationbar = no, menubar = yes, resizable, screenX = 50,' +
              ' screenY = 50, width = 800, height = 800';
            const htmlPop = '<embed width=100% height=100% type="application/pdf" src="data:application/pdf;base64,' + data + '"> </embed>';
            const printWindow = window.open('', 'PDF', winparams);
            printWindow.document.write(htmlPop);
          }
        }
      );
  }

  enviarCorreo() {
    const that = this;
    let agregarCorreosElectronicos = '';
    this._translateService.get('agregarCorreosElectronicos').take(1).subscribe(data => agregarCorreosElectronicos = data);
    let correosElectronicos = '';
    this._translateService.get('correosElectronicos').take(1).subscribe(data => correosElectronicos = data);
    let mensajeRestriccionCorreosElectronicos = '';
    this._translateService.get('mensajeRestriccionCorreosElectronicos').take(1).subscribe(
      data => mensajeRestriccionCorreosElectronicos = data
    );
    let si = '';
    this._translateService.get('si').take(1).subscribe(data => si = data);
    let no = '';
    this._translateService.get('no').take(1).subscribe(data => no = data);
    swal({
      title: agregarCorreosElectronicos,
      html: '<div class="form-group label-floating" xmlns="http://www.w3.org/1999/html">' +
      '<label class="control-label">' + correosElectronicos + '<span class="star">*</span> </label>' +
      '<textarea id="correos" type="text" class="form-control"/></textarea> ' +
      '<label>' + mensajeRestriccionCorreosElectronicos + '</label>' +
      '</div>',
      allowOutsideClick: false,
      preConfirm: () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            let bandera = true;
            const regExp =
              /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            let correos = $('#correos').val();
            correos = correos.split(',');
            const correosInvalidos = correos.filter(function(correo){
              if (!regExp.test(correo)) {
                bandera = false;
                return true;
              } else {
                return false;
              }
            });

            if (!bandera) {
              swal.showValidationError();
                reject(new Error(correosInvalidos));
            }else {
              resolve(correos);
            }
          }, 500);
        });
      },
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: si,
      cancelButtonText: no,
      buttonsStyling: false
    }).then(function(correos) {
      that.deshabilitarSubscription = that.deshabilitar.subscribe(
        dataDeshabilitar => {
          console.log('desahbilitar ', dataDeshabilitar);
          if (!dataDeshabilitar) {
            console.log('comprobante ', that.comprobante);
            if (that.comprobante !== undefined) {
              const serie = that.comprobante.vcSerie;
              const correlativo = that.comprobante.vcCorrelativo;
              const tipoComprobante = that.comprobante.vcTipocomprobante;
              // const fechaEmision = new Date(that.comprobante.tsFechaemision).toISOString();
              const fechaEmision = that.comprobante.tsFechacreacion;
              const ubicacion = that.comprobante.inIdcomprobantepago + '-1.pdf';
              const ubicacionXml = that.comprobante.inIdcomprobantepago + '-2.xml';
              that._correoService.enviarNotificacion(correos, tipoComprobante, serie, correlativo, fechaEmision, ubicacion, ubicacionXml);
            }
          }
        }
      );
    });
  }

  obtenerArchivoParaMostrar() {
    let mensajeComprobanteEnProcesoEmitido: string;
    let labelRespuestaSecundaria: string;
    this._translateService.get('comprobanteEnProcesoEmitido').take(1).subscribe(data => mensajeComprobanteEnProcesoEmitido = data);
    this._translateService.get('verificarEstadoConsultaComprobanteEmitido').take(1).subscribe(data => labelRespuestaSecundaria = data);
    const that = this;
    this._archivoServicio.retornarArchivoRetencionPercepcion(this.idComprobante);
    this.archivoBaseSubscription = this._archivoServicio.base.subscribe(
      (data) => {
        this.pdfSrc.next(data);
          setTimeout(
            () => {
              that.comprobanteSubscription = that._comprobanteService.buscarPorUuid(that.idComprobante).subscribe(
                dataComprobante => {
                  if (dataComprobante  !== null) {
                    that.comprobante = dataComprobante;
                    this.deshabilitar.next(false);
                  }
                },
                error2 => {
                  this.deshabilitar.next(true);
                }
              );
            }, 2000
          );
      },
      error2 => {
        swal({
          html:
            '<div class="text-center">' + mensajeComprobanteEnProcesoEmitido + '</div>',
          padding: '20',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'VOLVER A CARGAR',
          cancelButtonText: 'CONSULTAR',
          confirmButtonClass: 'btn btn-success',
          cancelButtonClass: 'btn btn-danger',
          buttonsStyling: false
        }).then(
          (result) => {
            window.location.reload();
          }, (dismiss) => {
            // this.router.navigate(['./comprobantes']);
            that.router.navigate(['../comprobantes/consultar']);
          });
        this.deshabilitar.next(true);
      }
    );
  }

  guardarArchivo(archivo: TipoArchivo) {
    this._archivoServicio.descargararchivotipo(this.idComprobante, archivo.idArchivo);
  }
}
