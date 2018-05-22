import {AfterViewChecked, AfterViewInit, Component, OnChanges, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as WrittenNumber from 'written-number';
import {HttpClient} from '@angular/common/http';
import { DataTableComponent } from '../../general/data-table/data-table.component';
import { Retencionebiz } from '../models/retencionebiz';
import { RetencionCabecera } from '../models/retencion-cabecera';
import { Entidad } from '../../general/models/organizacion/entidad';
import { Rdetalle } from '../models/rdetalle';
import { PrincipalRetencion } from '../models/principal-retencion';
import { PersistenciaServiceRetencion } from '../services/persistencia.service';
import { PersistenciaEntidadService } from '../services/persistencia.entidad.service';
import { RetencionpersiscabeceraService } from '../services/retencionpersiscabecera.service';
import { NuevoDocumentoService } from '../../general/services/documento/nuevoDocumento';
import { PersistenciaPost } from '../services/persistencia-post';
import { Post_retencion } from '../models/post_retencion';
import { ComprobantesService } from '../../general/services/comprobantes/comprobantes.service';
import { ComprobantesQuery } from '../../resumen-bajas/models/comprobantes-query';
import { error } from 'util';
import { TipoArchivo, TIPOS_ARCHIVOS } from 'app/facturacion-electronica/general/models/archivos/tipoArchivo';
import { Servidores } from 'app/facturacion-electronica/general/services/servidores';
import { CorreoService } from 'app/facturacion-electronica/general/services/correo/correo.service';
import { Console } from '@angular/core/src/console';
import {ArchivoService} from '../../general/services/archivos/archivo.service';
import {saveAs} from 'file-saver';
import { RetencionService } from 'app/facturacion-electronica/general/services/comprobantes/retencion.service';
import { HttpParams } from '@angular/common/http';
import { ConsultaDocumentoQuery } from 'app/facturacion-electronica/general/models/consultaDocumentoQuery';
import { PercepcionRetencionReferenciasService } from 'app/facturacion-electronica/percepcion-retencion/services/percepcion-retencion-referencias.service';
import { SpinnerService } from 'app/service/spinner.service';
import {Comprobante} from '../models/comprobante';
import {Detalletabla} from '../services/detalletabla';
import {ColumnaDataTable} from '../../general/data-table/utils/columna-data-table';
  declare var $, swal: any;


@Component({
    selector: 'visualizar-retencion',
    templateUrl: './percepcion-retencion-visualizar.component.html',
    styleUrls: ['./percepcion-retencion-visualizar.component.css']
})
export class PercepcionRetencionVisualizarComponent implements OnInit {
  public parametrosVisualizar: HttpParams;
  public urlVisualizarRetencion: string;
  public tipoConsultaVisualizarRetencion: string;
  public uuid: string;
  public comprobantes_query: ComprobantesQuery[] = [];
  public documentos_query: any;
  public tiposArchivos: TipoArchivo[] = TIPOS_ARCHIVOS;

  public listaitems: Retencionebiz[];
  public retencioncab: RetencionCabecera;
  public entidadlogueo: Entidad;
  public entidadreceptora: Entidad;
  public documentoreferenciaunit: Rdetalle = new Rdetalle();
  public columnasTabla: ColumnaDataTable[];
  @ViewChild('tablaNormal') tabla: DataTableComponent<Retencionebiz>;
  public rucreceptor: number;              // COMPRADORA
  public razonsocialreceptor: string;      // COMPRADORA
  public domiciliofiscalreceptor: string;  // COMPRADORA
  public domiciliofiscalremisor: string;   // PROVEEDORA
  public rucemisor: number;                // PROVEEDORA
  public razonsocialemisor: string;        // PROVEEDORA
  public fechaemisiones: Date;
  public totalRetencion: string;
  public totalespalabaras: String;
  public tipoComprobante: string;
  public tipocambio: string;
  public banco: string;
  public domiciliofiscalemisor: string;
  public series: string;
  public correlativo: string;
  public tipo_moneda: string;
  public monedacabe: string;
  public comprobante: string;
  public totalImporte: number;
  public retencion_principal: PrincipalRetencion;
  public uuid_pdf: any;

  constructor(
              private route: ActivatedRoute,
              private router: Router,
              private persistenciaService: PersistenciaServiceRetencion,
              private RetencionCabecerapersistenciaService: RetencionpersiscabeceraService,
              private _nuevodocumento: NuevoDocumentoService,
              private _entidadPersistenciaService: PersistenciaEntidadService,
              private httpClient: HttpClient,
              private _postpersisservice: PersistenciaPost,
              private _retencionService: RetencionService,
              private _comprobantesService: ComprobantesService,
              private _servidores: Servidores,
              private correoService: CorreoService,
              public _percepcionRetencionReferenciasService: PercepcionRetencionReferenciasService,
              public _detalletabla: Detalletabla,
              private archivoServicio: ArchivoService
              ) {
                  this.retencion_principal = new PrincipalRetencion();
                  this.entidadlogueo = new Entidad;
                  this.entidadreceptora = new Entidad;
                  this.listaitems = [];
                  this.columnasTabla = [
                    new ColumnaDataTable('tipo', 'vcTdocDesDesc'),
                    new ColumnaDataTable('serie', 'chSerieDest'),
                    new ColumnaDataTable('numeroCorrelativo', 'chCorrDest'),
                    new ColumnaDataTable('fechaEmision', 'daFecEmiDest'),
                    new ColumnaDataTable('Moneda Origen', 'vcMonedaDestino'),
                    new ColumnaDataTable('importeTotal', 'deTotMoneDes', {'text-align': 'right'}),
                    new ColumnaDataTable('importeTotalsoles', 'nuTotImpDest', {'text-align': 'right'}),
                    new ColumnaDataTable('importeRetencionsoles', 'nuTotImpAux', {'text-align': 'right'}),
                    new ColumnaDataTable('Nro Doc ERP', 'vcPolizaFactura')
                  ];
                 }

  ngOnInit() {
    // this.spineractivar();
    // ********** VISTA DE DATOS EN HTML ********* //
    let documentos_query: any;
    this.uuid = this.persistenciaService.getUUIDConsultaRetenecion();
    console.log('UUID');
    console.log(this.uuid);
    documentos_query = this._retencionService.buscarPorUuid(this.uuid);
    const urlDefecto = this._servidores.HOSTLOCAL + '/documento?id=' + this.uuid;
    this._comprobantesService.visualizar(this.uuid).subscribe (
      data => {
        if (data) {
          console.log(data);
          this.cargarData(data);
        }
        // this.docmentos_query = JSON.parse(data);
      }
    );
    const that = this;
    // this.documentos_query = JSON.parse(data);
    // this.cargarData(data);
  }


  public cargarData(data: any) {
      this.comprobante = data.vcTipocomprobante;
      this.razonsocialemisor = data.entidadproveedora.vcNomComercia;
      this.rucemisor = data.entidadproveedora.vcDocumento;
      this.domiciliofiscalemisor = data.entidadproveedora.vcDirFiscal;
      this.series = data.vcSerie;
      this.correlativo = data.vcCorrelativo;
      this.razonsocialreceptor = data.entidadcompradora.vcNomComercia;
      this.rucreceptor = data.entidadcompradora.vcDocumento;
      this.banco = data.vcPagobanco;
      this.monedacabe = data.chMonedacomprobantepago;
      this.domiciliofiscalreceptor = data.entidadcompradora.vcDirFiscal;
      this.uuid_pdf = data.inIdcomprobantepago;
      this.fechaemisiones = data.tsFechacreacion;
      this.tipoComprobante = data.vcTipocomprobante;
      this.tipocambio = '';
      this.totalImporte = data.deTotalcomprobantepago;
      this.totalRetencion = data.deDctomonto.toFixed(2);
      this.tipocambio = this.formatearNumeroFormatoMoneda(Number(this.tipocambio));
      // this.tabla.insertarData(this.listaitems);
      this.calcularTotales();
  }
  public cargarDataTabla() {
    const dtoConsulta: ConsultaDocumentoQuery = new ConsultaDocumentoQuery();

    this.parametrosVisualizar = new HttpParams()
    .set('comprobanteID', this.uuid);
    this.urlVisualizarRetencion = this._percepcionRetencionReferenciasService.urlQry;
    this.tabla.setParametros(this.parametrosVisualizar);
    console.log('LA SUPER CONSULTA');
    this.tipoConsultaVisualizarRetencion = this._detalletabla.TIPO_ATRIBUTO_REFERENCIAS;
  

    //documentos_query = this._comprobantes.filtroDefecto(consultaRetencion);
    this.tipoConsultaVisualizarRetencion = this._percepcionRetencionReferenciasService.TIPO_ATRIBUTO_REFERENCIAS;
    //this.tabla.cargarData();

  }
  public formatearNumeroFormatoMoneda ( numero: number): string {
    return numero.toFixed(2);
  }

  public calcularTotales() {
    this.totalespalabaras = this.formatearNumeroFormatoMoneda(Number(this.totalRetencion));
    const arr = this.totalespalabaras.split('.');
    const entero = arr[0];
    const decimal = arr[1];
    this.totalespalabaras =  (WrittenNumber(Number(entero), { lang: 'es' }) + ' '
    + ' CON ' + decimal + '/100 SOLES.');
  }

  guardarArchivo(archivo: TipoArchivo) {
    console.log('DESCARGA DE ARCHIVOS TIPOS');
    console.log( archivo.idArchivo);
    console.log(this.uuid);
    this.archivoServicio.descargararchivotipo(this.uuid, archivo.idArchivo);
  }

  regresar() {
    this.router.navigateByUrl('percepcion-retencion/consultar');
  }


  emitir() {
    window.open(this._servidores.FILEQRY + '/archivos/download?nombre='
      + this.uuid_pdf + '-1.pdf', '_blank');
  }

  imprimir() {
    this.archivoServicio.retornarArchivoRetencionPercepcionbase(this.uuid)
      .subscribe(
        data => {
          if (data) {
            const winparams = 'dependent = yes, locationbar = no, menubar = yes, resizable, screenX = 50, screenY = 50, width = 800, height = 800';
            const htmlPop = '<embed width=100% height=100% type="application/pdf" src="data:application/pdf;base64,' + data + '"> </embed>';
            const printWindow = window.open('', 'PDF', winparams);
            printWindow.document.write(htmlPop);
          }
          // console.log(this.data);
        }
      );
  }

  iniciarData(event) {
    this.cargarDataTabla();
    this.calcularTotales();
  }
  showSwal() {
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
      const serie = that.series;
      const correlativo = that.correlativo;
      const tipoComprobante = that.tipoComprobante;
      // const fechaEmision = new Date(that.fechaemisiones).toISOString();
      const fechaEmision = that.fechaemisiones;
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
}
