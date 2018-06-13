import {Component, OnInit, ViewChild} from '@angular/core';
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
import { ComprobantesService } from '../../general/services/comprobantes/comprobantes.service';
import { ComprobantesQuery } from '../../resumen-bajas/models/comprobantes-query';
import { TipoArchivo, TIPOS_ARCHIVOS } from 'app/facturacion-electronica/general/models/archivos/tipoArchivo';
import { Servidores } from 'app/facturacion-electronica/general/services/servidores';
import { CorreoService } from 'app/facturacion-electronica/general/services/correo/correo.service';
import {ArchivoService} from '../../general/services/archivos/archivo.service';
import { HttpParams } from '@angular/common/http';
import { ConsultaDocumentoQuery } from 'app/facturacion-electronica/general/models/consultaDocumentoQuery';
import { PercepcionRetencionReferenciasService } from 'app/facturacion-electronica/percepcion-retencion/services/percepcion-retencion-referencias.service';
import {Detalletabla} from '../services/detalletabla';
import {ColumnaDataTable} from '../../general/data-table/utils/columna-data-table';
import {TIPO_ARCHIVO_PDF} from '../../general/models/archivos/tipoArchivo';
import {DocumentoQuery} from '../../general/models/comprobantes';
import {TiposService} from '../../general/utils/tipos.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
  declare var $, swal: any;


@Component({
    selector: 'visualizar-retencion',
    templateUrl: './percepcion-retencion-visualizar.component.html',
    styleUrls: ['./percepcion-retencion-visualizar.component.css']
})
export class PercepcionRetencionVisualizarComponent implements OnInit {
  public documento: DocumentoQuery;

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
////////////////////////////////////////////////////

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
  public totalImporte: string;
  public retencion_principal: PrincipalRetencion;
  public uuid_pdf: any;
  esRetencion: BehaviorSubject<boolean>;

  constructor(
              private route: ActivatedRoute,
              private router: Router,
              private persistenciaService: PersistenciaServiceRetencion,
              private RetencionCabecerapersistenciaService: RetencionpersiscabeceraService,
              private _nuevodocumento: NuevoDocumentoService,
              private _entidadPersistenciaService: PersistenciaEntidadService,
              private httpClient: HttpClient,
              private _postpersisservice: PersistenciaPost,
              private _comprobantesService: ComprobantesService,
              private _servidores: Servidores,
              private correoService: CorreoService,
              public _percepcionRetencionReferenciasService: PercepcionRetencionReferenciasService,
              public _detalletabla: Detalletabla,
              private archivoServicio: ArchivoService,
              private _tiposService: TiposService
              ) {
                  this.retencion_principal = new PrincipalRetencion();
                  this.esRetencion = new BehaviorSubject(false);
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
                    new ColumnaDataTable('importeTotalsoles', 'nuTotImpDest', {'text-align': 'right'})
                  ];
              }

  ngOnInit() {
    // this.spineractivar();
    // ********** VISTA DE DATOS EN HTML ********* //
    let documentos_query: any;
    this.uuid = this.persistenciaService.getUUIDConsultaRetenecion();
    console.log('UUID');
    console.log(this.uuid);
    this._comprobantesService.visualizar(this.uuid).subscribe (
      data => {
        if (data) {
          console.log(data);
          if (data.vcIdregistrotipocomprobante === this._tiposService.TIPO_DOCUMENTO_RETENCION) {
            this.esRetencion.next(true);
            this.columnasTabla.push(
              new ColumnaDataTable('importeRetencionsoles', 'nuTotImpAux', {'text-align': 'right'}),
            );
          } else {
            this.esRetencion.next(false);
            this.columnasTabla.push(
              new ColumnaDataTable('importePercepcionSoles', 'nuTotImpAux', {'text-align': 'right'}),
            );
          }
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
      this.documento = data;
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
      this.totalImporte = Number(data.deTotalcomprobantepago).toFixed(2);
      this.totalRetencion = data.deDctomonto.toFixed(2);
      this.tipocambio = this.formatearNumeroFormatoMoneda(Number(this.tipocambio));
      // this.tabla.insertarData(this.listaitems);
      this.calcularTotales();
  }

  public cargarDataTabla() {
    const dtoConsulta: ConsultaDocumentoQuery = new ConsultaDocumentoQuery();

    this.parametrosVisualizar = new HttpParams()
    .set('comprobanteID', this.uuid);
    this.urlVisualizarRetencion = this._detalletabla.urlQry;
    this.tabla.setParametros(this.parametrosVisualizar);
    console.log('LA SUPER CONSULTA');
    this.tipoConsultaVisualizarRetencion = this._detalletabla.TIPO_ATRIBUTO_REFERENCIAS;
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

  guardarArchivo(archivo: TipoArchivo, event: Event) {
    if (event.target['parentElement'].className !== 'disabled') {
      this.archivoServicio.descargararchivotipo(this.uuid, archivo.idArchivo);
    }
  }

  habilitarTipoArchivo(archivo: TipoArchivo) {
    if (
      this.documento &&
      Number(this.documento.chEstadocomprobantepago) === this._tiposService.TIPO_ESTADO_PENDIENTE_DE_ENVIO &&
      archivo.idArchivo !== TIPO_ARCHIVO_PDF.idArchivo
    ) {
      return false;
    }
    return true;
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
          console.log(data);
          if (data) {
            const winparams = 'dependent = yes, locationbar = no, menubar = yes, resizable, screenX = 50, screenY = 50, width = 800, height = 800';
            const htmlPop = '<embed width=100% height=100% type="application/pdf" src="data:application/pdf;base64,' + data + '"> </embed>';
            const printWindow = window.open('', 'PDF', winparams);
            printWindow.document.close();
            printWindow.document.write(htmlPop);
          }
          // console.log(this.data);
        }
      );
    console.log(this.uuid);
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
      let tipoComprobante = that.tipoComprobante;
      if (!that.esRetencion.value) {
        tipoComprobante = 'Percepción';
      }
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
