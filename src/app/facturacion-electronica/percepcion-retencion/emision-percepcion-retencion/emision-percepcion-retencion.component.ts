import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { CorreoService } from '../../general/services/correo/correo.service';
import { ArchivoService } from '../../general/services/archivos/archivo.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TipoArchivo, TIPOS_ARCHIVOS } from '../../general/models/archivos/tipoArchivo';
import { PersistenciaPost } from '../services/persistencia-post';
import { Post_retencion } from '../models/post_retencion';
import { Servidores } from 'app/facturacion-electronica/general/services/servidores';
import {SpinnerService} from '../../../service/spinner.service';
import {PadreRetencionPercepcionService} from '../services/padre-retencion-percepcion.service';

declare var $, swal: any;
@Component({
  selector: 'app-item-crear-editar',
  templateUrl: './emision-percepcion-retencion.component.html',
  styleUrls: ['./emision-percepcion-retencion.css']
})
export class EmisionPercepcionRetencionComponent implements OnInit {

  pdfSrc: BehaviorSubject<{}>= new BehaviorSubject<{}>({data: []});

  tiposArchivos: TipoArchivo[] = TIPOS_ARCHIVOS;
  pdf: any;
  public idComprobante: string;
  public retencionPersistencia = new Post_retencion();
  public data: string;

  constructor(private route: ActivatedRoute, private router: Router, private correoService: CorreoService,
    private archivoServicio: ArchivoService,
    private _postPersistenciaService: PersistenciaPost,
    private _servidores: Servidores,
    private _spinner: SpinnerService,
    private _padreRetencionPerpcionService: PadreRetencionPercepcionService) {
    this._padreRetencionPerpcionService.actualizarComprobante(this.route.snapshot.data['codigo'],
      this.route.snapshot.data['mostrarCombo'], true);
  }

  ngOnInit() {
    this.getDataComprobante();
    this.retencionPersistencia = this._postPersistenciaService.getPostNormal();
    console.log(this.retencionPersistencia);
  }

  public getDataComprobante() {
    this.route.params.subscribe(
      (params: Params) => {
        params['id'];
        this.obtenerArchivoParaMostrar( params['id']);
        this.idComprobante =  params['id'];
      }
    );
  }
  emitir() {
    this.archivoServicio.retornarArchivoRetencionPercepcionbase(this.idComprobante)
      .subscribe(
        data => {
          console.log(data);
          if (data) {
            const winparams = 'dependent = yes, locationbar = no, menubar = yes, resizable, screenX = 50,' +
              ' screenY = 50, width = 800, height = 800';
            const htmlPop = '<embed width=100% height=100% type="application/pdf" src="data:application/pdf;base64,' + data + '"> </embed>';
            const printWindow = window.open('', 'PDF', winparams);
            printWindow.document.write(htmlPop);
          }
          // console.log(this.data);
        }
      );
    console.log(this.data);
  }

  showSwal() {
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
            const regExp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            let correos = $('#correos').val();
            correos = correos.split(',');
            const correosInvalidos = correos.filter(function(correo){
              if (!regExp.test(correo)) {
                bandera = false;
                return true;
              }
              else {
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
      const numeroComprobante: string = that.retencionPersistencia.numeroComprobante;
      let serie = '';
      let correlativo = '';
      const arregloNumeroComprobante: string[] = numeroComprobante.split('-');
      if (arregloNumeroComprobante[0]) {
        serie = arregloNumeroComprobante[0];
      }
      if (arregloNumeroComprobante[1]) {
        correlativo = arregloNumeroComprobante[1];
      }
      const tipoComprobante = that.retencionPersistencia.tipoComprobante;
      // const fechaEmision = new Date(that.retencionPersistencia.fechaEmision).toISOString();
      const fechaEmision = that.retencionPersistencia.fechaEmision;
      const ubicacion = that.retencionPersistencia.id + '-1.pdf';
      const ubicacionXml = that.retencionPersistencia.id + '-2.xml';
      that.correoService.enviarNotificacion(correos, tipoComprobante, serie, correlativo, fechaEmision, ubicacion, ubicacionXml);
    });
  }

  obtenerArchivoParaMostrar(idcomprobante: string) {
    const that = this;
    this.archivoServicio.retornarArchivoRetencionPercepcion(idcomprobante);
    this.archivoServicio.base.subscribe(
      (data) => {
        that.pdfSrc.next(data);
        console.log('PDF');
        console.log(this.pdfSrc.value);
      }
    );
  }

  guardarArchivo(archivo: TipoArchivo) {
    console.log('DESCARGA DE ARCHIVOS TIPOS');
    console.log( archivo.idArchivo);
    console.log(this.idComprobante);
    this.archivoServicio.descargararchivotipo(this.idComprobante, archivo.idArchivo);
  }



}
