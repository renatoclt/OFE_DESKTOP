import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Servidores } from 'app/facturacion-electronica/general/services/servidores';
import {escape} from 'querystring';
import { ComprobanteEmitido } from 'app/facturacion-electronica/general/models/comprobantes/comprobanteEmitido';
import { PersistenciaService } from 'app/facturacion-electronica/comprobantes/services/persistencia.service';
import { TipoArchivo, TIPOS_ARCHIVOS } from 'app/facturacion-electronica/general/models/archivos/tipoArchivo';
import { ArchivoService } from 'app/facturacion-electronica/general/services/archivos/archivo.service';
import { CorreoService } from 'app/facturacion-electronica/general/services/correo/correo.service';
import { SpinnerService } from 'app/service/spinner.service';
import { ComprobanteCorreoModel } from 'app/cliente/models/comprobante-correo.model';
declare var $, swal: any;
@Component({
  selector: 'app-visualizar-comprobante-cliente.component',
  templateUrl: './visualizar-comprobante-cliente.html',
  styleUrls: ['./visualizar-comprobante-cliente.css']
})
export class VisualizarComprobanteClienteComponent implements OnInit {

  pdfSrc: BehaviorSubject<{}>= new BehaviorSubject<{}>({data: []});

  tiposArchivos: TipoArchivo[] = TIPOS_ARCHIVOS;
  pdf: any;
  public idComprobante: string;
  public comprobanteEmitidoPersistencia = new ComprobanteEmitido();
  public comprobanteVisualizar: ComprobanteCorreoModel;
  public data: string;

  constructor(private route: ActivatedRoute, private router: Router, private correoService: CorreoService,
    private archivoServicio: ArchivoService,
    private _persistenciaServicio: PersistenciaService,
    private _servidores: Servidores,
    private _spinner: SpinnerService
  ) { 
    this.comprobanteVisualizar = new ComprobanteCorreoModel();
   }

  ngOnInit() {
    this.checkFullPageBackgroundImage();
    this.comprobanteVisualizar = this._persistenciaServicio.getPersistenciaSimple('ConsultaClienteComprobante');
    if (this.comprobanteVisualizar === null || this.comprobanteVisualizar === undefined) {
      this.router.navigateByUrl('consultacliente');
    } else {
      this.idComprobante = this.comprobanteVisualizar.uuid;
      this.obtenerArchivoParaMostrar( this.idComprobante);
    }
  }
  public checkFullPageBackgroundImage() {
      var $page = $('.full-page');
      var image_src = $page.data('image');

      if (image_src !== undefined) {
          var image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>'
          $page.append(image_container);
      }
  }

  imprimir() {
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
      const numeroComprobante: string = that.comprobanteEmitidoPersistencia.numeroComprobante;
      let serie = '';
      let correlativo = '';
      // const arregloNumeroComprobante: string[] = numeroComprobante.split('-');
      // if (arregloNumeroComprobante[0]) {
      //   serie = arregloNumeroComprobante[0];
      // }
      // if (arregloNumeroComprobante[1]) {
      //   correlativo = arregloNumeroComprobante[1];
      // }
      serie = that.comprobanteVisualizar.serie;
      correlativo = that.comprobanteVisualizar.correlativo;
      const tipoComprobante = that.comprobanteVisualizar.tipoComprobante;
      // const fechaEmision = new Date(that.comprobanteVisualizar.fechaEmision).toISOString();
      const fechaEmision = that.comprobanteVisualizar.fechaCreacion;
      const ubicacion = that.comprobanteVisualizar.uuid + '-1.pdf';
      const ubicacionXml = that.comprobanteVisualizar.uuid + '-2.xml';
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
  public regresar() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }
}
