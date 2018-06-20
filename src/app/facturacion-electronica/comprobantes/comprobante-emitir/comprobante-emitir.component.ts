import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { CorreoService } from '../../general/services/correo/correo.service';
import { ArchivoService } from '../../general/services/archivos/archivo.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {TIPO_ARCHIVO_PDF, TipoArchivo, TIPOS_ARCHIVOS,TIPOS_ARCHIVOS_OFFLINE} from '../../general/models/archivos/tipoArchivo';
import { Servidores } from 'app/facturacion-electronica/general/services/servidores';
import {escape} from 'querystring';
import {SpinnerService} from '../../../service/spinner.service';
import { ComprobanteEmitido } from 'app/facturacion-electronica/general/models/comprobantes/comprobanteEmitido';
import { PersistenciaService } from 'app/facturacion-electronica/comprobantes/services/persistencia.service';
import {PadreComprobanteService} from '../services/padre-comprobante.service';
import {TiposService} from '../../general/utils/tipos.service';
import { DocumentoQuery } from 'app/facturacion-electronica/general/models/comprobantes';
import { DocumentoQueryService } from 'app/facturacion-electronica/general/services/comprobantes/documentoQuery.service';
import { HttpClient } from '@angular/common/http';
declare var $, swal: any;
@Component({
  selector: 'app-item-comprobante-emitir.component',
  templateUrl: './comprobante-emitir.component.html',
  styleUrls: ['./comprobante-emitir.css']
})
export class ComprobanteEmitirComponent implements OnInit {

  pdfSrc: BehaviorSubject<{}>= new BehaviorSubject<{}>({data: []});
  public comprobante: DocumentoQuery = new DocumentoQuery();

  // tiposArchivos: TipoArchivo[] = TIPOS_ARCHIVOS;
  tiposArchivos: TipoArchivo[] = TIPOS_ARCHIVOS_OFFLINE;
  pdf: any;
  public idComprobante: string;
  public comprobanteEmitidoPersistencia = new ComprobanteEmitido();
  public data: string;
  public titulo: string;

  constructor(private route: ActivatedRoute, private router: Router, private correoService: CorreoService,
              private archivoServicio: ArchivoService,
              private _persistenciaServicio: PersistenciaService,
              private _servidores: Servidores,
              private _spinner: SpinnerService,
              private _tiposService: TiposService,
              private _documentoQuery: DocumentoQueryService,
              private httpClient: HttpClient,
              private _tipos: TiposService,
              private _padreComprobanteService: PadreComprobanteService) {
    this._padreComprobanteService.actualizarComprobante(this.route.snapshot.data['codigo'], this.route.snapshot.data['mostrarCombo']);
  }

  ngOnInit() {
    this.getDataComprobante();
    this.comprobanteEmitidoPersistencia = this._persistenciaServicio.getPersistenciaSimple<ComprobanteEmitido>('comprobanteEmitido');
    switch(this.idComprobante) {
      case this._tipos.TIPO_DOCUMENTO_FACTURA:
        this.titulo = 'Factura Emitida';
        break;
      case this._tipos.TIPO_DOCUMENTO_BOLETA:
        this.titulo = 'Boleta Emitida';
        break;
    }
  }
  public getDocumento() {
    const urlDefecto = this._servidores.DOCUQRY + '/documento?id=' + this.idComprobante;
    this.httpClient.get(urlDefecto, {
      responseType: 'text'
      // params: parametros
    })
    .subscribe(
      (data) => {
        this.comprobante = JSON.parse(data);
      },
      error => {
        console.log(error);
      }
    );
  }
  public getDataComprobante() {
    this.route.params.subscribe(
      (params: Params) => {
        this.idComprobante = params['id'];
        this.obtenerArchivoParaMostrar(params['id']);
      }
    );
  }
  imprimir() {
    this.archivoServicio.retornarArchivoRetencionPercepcionbase(this.idComprobante)
      .subscribe(
        data => {
          if (data) {
            const winparams = 'dependent = yes, locationbar = no, menubar = yes, resizable, screenX = 50,' +
              ' screenY = 50, width = 800, height = 800';
            const htmlPop = '<embed width=100% height=100% type="application/pdf" src="data:application/pdf;base64,' + data + '"> </embed>';
            const printWindow = window.open('', 'PDF', winparams);
            printWindow.document.close();
            printWindow.document.write(htmlPop);
          }
        }
      );
  }

  enviarCorreo() {
    const that = this;
    swal({
      title: 'Agregar Correos Electrónicos',
      html: '<div class="form-group label-floating" xmlns="http://www.w3.org/1999/html">' +
                 '<label class="control-label">Correos Electrónicos<span class="star">*</span> </label>' +
                 '<textarea id="correos" type="text" class="form-control"/></textarea> ' +
                 '<label>Para separar correos se deberan separar por comas(,).</label>' +
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
              swal.showValidationError(),
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
      confirmButtonText: 'SÍ',
      cancelButtonText: 'NO',
      buttonsStyling: false
    }).then(function(correos) {
      const serie = that.comprobante.vcSerie;
      const correlativo = that.comprobante.vcCorrelativo;
      // const tipoComprobante = that.comprobante.chIdtipocomprobante;
      const tipoComprobante = that.comprobante.vcTipocomprobante;
      // const fechaEmision = new Date(that.comprobante.tsFechaemision).toISOString();
      const fechaEmision = that.comprobante.tsFechacreacion;
      const ubicacion = that.idComprobante + '-1.pdf';
      const ubicacionXml = that.idComprobante + '-2.xml';
      that.correoService.enviarNotificacion(correos, tipoComprobante, serie, correlativo, fechaEmision, ubicacion, ubicacionXml);
    });
  }

  obtenerArchivoParaMostrar(idcomprobante: string) {
    const that = this;
    this.archivoServicio.retornarArchivoRetencionPercepcion(idcomprobante);
    this.archivoServicio.base.subscribe(
      (data) => {
        that.pdfSrc.next(data);
        that.getDocumento();
      }
    );
  }

  guardarArchivo(archivo: TipoArchivo, event: Event) {
    if (event.target['parentElement'].className !== 'disabled') {
      this.archivoServicio.descargararchivotipo(this.comprobante.value.inIdcomprobantepago, archivo.idArchivo);
    }
  }

  habilitarTipoArchivo(archivo: TipoArchivo) {
    if (
      this.comprobante &&
      Number(this.comprobante.chEstadocomprobantepago) === this._tiposService.TIPO_ESTADO_PENDIENTE_DE_ENVIO &&
      archivo.idArchivo !== TIPO_ARCHIVO_PDF.idArchivo
    ) {
      return false;
    }
    return true;
  }
}
