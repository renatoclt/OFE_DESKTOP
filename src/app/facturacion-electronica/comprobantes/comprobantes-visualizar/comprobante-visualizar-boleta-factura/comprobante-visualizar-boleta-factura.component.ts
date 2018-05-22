import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as WrittenNumber from 'written-number';
import { HttpClient } from '@angular/common/http';
import { TipoArchivo, TIPOS_ARCHIVOS } from 'app/facturacion-electronica/general/models/archivos/tipoArchivo';
import { Servidores } from 'app/facturacion-electronica/general/services/servidores';
import { CorreoService } from 'app/facturacion-electronica/general/services/correo/correo.service';
import { HttpParams } from '@angular/common/http';
import { ConsultaDocumentoQuery } from 'app/facturacion-electronica/general/models/consultaDocumentoQuery';
import { PercepcionRetencionReferenciasService } from 'app/facturacion-electronica/percepcion-retencion/services/percepcion-retencion-referencias.service';
import { DataTableComponent } from 'app/facturacion-electronica/general/data-table/data-table.component';
import { ArchivoService } from 'app/facturacion-electronica/general/services/archivos/archivo.service';
import { PersistenciaService } from 'app/facturacion-electronica/comprobantes/services/persistencia.service';
import { DocumentoQueryService } from 'app/facturacion-electronica/general/services/comprobantes/documentoQuery.service';
import { DocumentoQuery } from 'app/facturacion-electronica/general/models/comprobantes';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { RutasService } from 'app/facturacion-electronica/general/utils/rutas.service';
import { ColumnaDataTable } from '../../../general/data-table/utils/columna-data-table';
import { TiposService } from '../../../general/utils/tipos.service';
import { CatalogoDocumentoIdentidadService } from '../../../general/utils/catalogo-documento-identidad.service';

declare var $, swal: any;

@Component({
    selector: 'app-comprobante-visualizar-boleta-factura',
    templateUrl: './comprobante-visualizar-boleta-factura.html',
    styleUrls: ['comprobante-visualizar-boleta-factura.component.css']
})
export class BoletaFacturanVisualizarComponent implements OnInit {
  public uuid: string;
  public nombreTipoDocumeto: string;
  public documentoService: BehaviorSubject<DocumentoQuery> = new BehaviorSubject<DocumentoQuery>(null);
  public documento: DocumentoQuery = new DocumentoQuery();
  public totalPagoPalabras: string;
  public tiposArchivos: TipoArchivo[] = TIPOS_ARCHIVOS;
  public parametrosVisualizar: HttpParams;
  public tipoConsultaVisualizarRetencion: string;
  public urlVisualizarRetencion: string;
  public urlLogo: string;
  public detalle: DetalleFactura[] = [];
  public columnasTabla: ColumnaDataTable[];
  @ViewChild('tablaNormal') tabla: DataTableComponent<any>;
  constructor(
              private route: ActivatedRoute,
              private router: Router,
              private httpClient: HttpClient,
              private _servidores: Servidores,
              private correoService: CorreoService,
              private archivoServicio: ArchivoService,
              private _persistenciaService: PersistenciaService,
              private _documentoQuery: DocumentoQueryService,
              private _percepcionRetencionReferenciasService: PercepcionRetencionReferenciasService,
              private _tipos: TiposService,
              private _rutas: RutasService,
              private _catalogoDocumentosIdentidad: CatalogoDocumentoIdentidadService
              ) {
                this.urlLogo = '';
                this.totalPagoPalabras = '';
                this.columnasTabla = [
                  new ColumnaDataTable('codigo', 'vcCodigoProducto'),
                  new ColumnaDataTable('descripcion', 'vcDescripcionitem', {'text-align': 'left'}),
                  new ColumnaDataTable('cantidad', 'deCantidaddespachada', {'text-align': 'right'}),
                  new ColumnaDataTable('Unidad de Medida', 'vcUnidadmedida'),
                  new ColumnaDataTable('valorUnitario', 'dePreciounitarioitem', {'text-align': 'right'}),
                  new ColumnaDataTable('igv', 'deMontoimpuesto', {'text-align': 'right'}),
                  new ColumnaDataTable('isc', 'nuSubtotalIsc', {'text-align': 'right'}),
                  new ColumnaDataTable('descuento', 'nuDescuento', {'text-align': 'right'}),
                  new ColumnaDataTable('valorVenta', 'dePreciototalitem', {'text-align': 'right'})
                ];
              }

  ngOnInit() {
    this.getRUCOrganizacion();
    // ********** VISTA DE DATOS EN HTML ********* //
    //  let documentos_query: any;
    this.route.params.subscribe(
      data => {
        this.uuid = data['id'];
      }
    );
    console.log('UUID');
    console.log(this.uuid);
    if ( this.uuid === null ) {
      this.regresar();
    }
    this.documentoService = this._documentoQuery.buscarDocumenentoPorId(this.uuid);
    this.getDocumento();
  }
  public setNombreTipoDocumento() {
    switch (this.documento.entidadproveedora.inTipoDocumento) {
      case Number(this._catalogoDocumentosIdentidad.TIPO_DOCUMENTO_IDENTIDAD_RUC):
        this.nombreTipoDocumeto = 'RUC';
        break;
      case Number(this._catalogoDocumentosIdentidad.TIPO_DOCUMENTO_IDENTIDAD_DNI):
        this.nombreTipoDocumeto = this.documento.entidadproveedora[0].vcTipoDocumento;
        break;
      case Number(this._catalogoDocumentosIdentidad.TIPO_DOCUMENTO_IDENTIDAD_PASAPORTE):
        this.nombreTipoDocumeto = this.documento.entidadproveedora[0].vcTipoDocumento;
        break;
      case this._catalogoDocumentosIdentidad.TIPO_DOCUMENTO_IDENTIDAD_CEDULA_DIPLOMATICA_IDENTIDAD:
        this.nombreTipoDocumeto = this.documento.entidadproveedora[0].vcTipoDocumento;
        break;
      case Number(this._catalogoDocumentosIdentidad.TIPO_DOCUMENTO_IDENTIDAD_CARNET_EXTRANJERIA):
        this.nombreTipoDocumeto = this.documento.entidadproveedora[0].vcTipoDocumento;
        break;
      default:
        this.nombreTipoDocumeto = 'NÚMERO DE DOCUMENTO';
        break;
    }
  }
  public getRUCOrganizacion() {
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    this.urlLogo = usuarioActual.org_url_image != null ? usuarioActual.org_url_image : '';
  }
  public getDocumento() {
    const urlDefecto = this._servidores.HOSTLOCAL + '/documento?id=' + this.uuid;
    this.httpClient.get(urlDefecto, {
      responseType: 'text'
      // params: parametros
    })
    .subscribe(
      (data) => {
        console.log(data);
        this.documento = JSON.parse(data);
        console.log(this.documento);
        this.documento.deTotalcomprobantepago = this.formatearNumeroFormatoMoneda(Number(this.documento.deTotalcomprobantepago));
        this.documento.dePagomontopagado = this.formatearNumeroFormatoMoneda(Number(this.documento.dePagomontopagado));
        this.calcularTotales();
        this.getDetalleComprobante();
        this.setNombreTipoDocumento();
      },
      error => {
        console.log(error);
      }
    );
  }
  public getDetalleComprobante() {
    this.detalle = this.documento.detalle;
    for (let a = 0 ; a < this.detalle.length ; a++) {
      // this.detalle[a].vcCodigoProducto = this.formatearNumeroFormatoMoneda(this.detalle[a].vcCodigoProducto);
      // this.detalle[a].vcDescripcionitem = this.formatearNumeroFormatoMoneda(this.detalle[a].vcDescripcionitem);
      this.detalle[a].deCantidaddespachada = this.formatearNumeroFormatoMoneda(Number(this.detalle[a].deCantidaddespachada));
      // this.detalle[a].vcUnidadmedida = this.formatearNumeroFormatoMoneda(this.detalle[a].vcUnidadmedida);
      this.detalle[a].dePreciounitarioitem = this.formatearNumeroFormatoMoneda(Number(this.detalle[a].dePreciounitarioitem));
      this.detalle[a].deMontoimpuesto = this.formatearNumeroFormatoMoneda(Number(this.detalle[a].deMontoimpuesto));
      this.detalle[a].nuSubtotalIsc = this.formatearNumeroFormatoMoneda(Number(this.detalle[a].nuSubtotalIsc));
      this.detalle[a].nuDescuento = this.formatearNumeroFormatoMoneda(Number(this.detalle[a].nuDescuento));
      this.detalle[a].dePreciototalitem = this.formatearNumeroFormatoMoneda(Number(this.detalle[a].dePreciototalitem));
    }
    this.tabla.insertarData(this.detalle);
  }
  public calcularTotales() {
    this.totalPagoPalabras = this.formatearNumeroFormatoMoneda(Number(this.documento.deTotalcomprobantepago));
    const arr = this.totalPagoPalabras.split('.');
    const entero = arr[0];
    const decimal = arr[1];
    this.totalPagoPalabras =  (WrittenNumber(Number(entero), { lang: 'es' }) + ' '
    + ' CON ' + decimal + '/100 SOLES.');
  }
  public cargarData() {
    this.totalPagoPalabras = this.formatearNumeroFormatoMoneda(Number(this.documento));
    this.calcularTotales();
  }
  public formatearNumeroFormatoMoneda ( numero: number): string {
    return numero.toFixed(2);
  }
  public regresar() {
    this.router.navigateByUrl(this._rutas.URL_CONSULTAR_COMPROBANTE);
    this._persistenciaService.removePersistenciaSimple('UUIDConsultaComprobante');
  }
  public imprimir() {
    this.archivoServicio.retornarArchivoRetencionPercepcionbase(this.uuid)
      .subscribe(
        data => {
          console.log(data);
          if (data) {
            const winparams = 'dependent = yes, locationbar = no, menubar = yes, resizable, screenX = 50, screenY = 50, width = 800, height = 800';
            const htmlPop = '<embed width=100% height=100% type="application/pdf" src="data:application/pdf;base64,' + data + '"> </embed>';
            const printWindow = window.open('', 'PDF', winparams);
            printWindow.document.write(htmlPop);
          }
          // console.log(this.data);
        }
      );
    console.log(this.uuid);
  }

  enviarCorreo() {
    const that = this;
    swal({
      title: 'Agregar Correos Electrónicos',
      html: '<div class="form-group label-floating" xmlns="http://www.w3.org/1999/html">' +
                 '<label class="control-label">Correos Electrónicos<span class="star">*</span> </label>' +
                 '<textarea id="correos" type="text" class="form-control"/></textarea> ' +
                 '<label>Para separar correos se deberán separar por comas(,).</label>' +
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
              if (!regExp.test(correo)){
                bandera = false;
                return true;
              }
              else{
                return false;
              }
            });

            if (!bandera){
              swal.showValidationError(),
              reject(new Error(correosInvalidos));
            }else{
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
      const numeroComprobante: string = that.uuid;
      const serie = that.documento.vcSerie;
      const correlativo = that.documento.vcCorrelativo;
      // const tipoComprobante = 'Retencion';
      const tipoComprobante = that.documento.vcTipocomprobante;
      // const fechaEmision = new Date(that.documento.tsFechaemision).toISOString();
      const fechaEmision = that.documento.tsFechacreacion;
      const ubicacion = that.uuid + '-1.pdf';
      const ubicacionXml = that.uuid + '-2.xml';
      console.log(
        correos,
        tipoComprobante,
        serie,
        correlativo,
        fechaEmision,
        ubicacion,
        ubicacionXml
      );
      let respuesta: Boolean;
      respuesta =
        (that.correoService.enviarNotificacion(correos, tipoComprobante, serie, correlativo, fechaEmision, ubicacion, ubicacionXml)).value;

    });
  }

  public cargarDataTabla() {
    let dtoConsulta: ConsultaDocumentoQuery = new ConsultaDocumentoQuery();

    this.parametrosVisualizar = new HttpParams()
    .set('comprobanteID', this.uuid);
    this.urlVisualizarRetencion = this._percepcionRetencionReferenciasService.urlQry;
    this.tabla.setParametros(this.parametrosVisualizar);
    console.log('LA SUPER CONSULTA');

    //documentos_query = this._comprobantes.filtroDefecto(consultaRetencion);
    this.tipoConsultaVisualizarRetencion = this._percepcionRetencionReferenciasService.TIPO_ATRIBUTO_REFERENCIAS;
    //this.tabla.cargarData();

  }
  // public formatearNumeroFormatoMoneda ( numero: number): string {
  //   return numero.toFixed(2);
  // }
  // public calcularTotales() {
  //   this.totalespalabaras = this.formatearNumeroFormatoMoneda(Number(this.totalRetencion));
  //   const arr = this.totalespalabaras.split('.');
  //   const entero = arr[0];
  //   const decimal = arr[1];
  //   this.totalespalabaras =  (WrittenNumber(Number(entero), { lang: 'es' }) + ' '
  //   + ' CON ' + decimal + '/100 SOLES.');
  // }s

  iniciarData(event) {
    // this.cargarDataTabla();
    this.calcularTotales();
  }

  guardarArchivo(archivo: TipoArchivo) {
    console.log('DESCARGA DE ARCHIVOS TIPOS');
    console.log( archivo.idArchivo);
    console.log(this.uuid);
    this.archivoServicio.descargararchivotipo(this.uuid, archivo.idArchivo);
  }
}

class Producto {
  public nuMontoIsc: string;
}
class DetalleFactura() {
  public deCantidaddespachada: string;
  public vcCodigoProducto: string;
  public vcDescripcionitem: string;
  public vcUnidadmedida: string;
  public dePreciounitarioitem: string;
  public deMontoimpuesto: string;
  public nuDescuento: string;
  public dePreciototalitem: string;
  public producto: Producto;
}
