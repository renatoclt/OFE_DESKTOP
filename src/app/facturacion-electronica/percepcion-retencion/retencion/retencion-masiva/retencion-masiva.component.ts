import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Accion, Icono} from '../../../general/data-table/utils/accion';
import {TipoAccion} from '../../../general/data-table/utils/tipo-accion';
import {DataTableComponent} from '../../../general/data-table/data-table.component';
import {Retencionebiz} from '../../models/retencionebiz';
import {ModoVistaAccion} from '../../../general/data-table/utils/modo-vista-accion';
import {PersistenciaServiceRetencion} from '../../services/persistencia.service';
import {Retencionmasivaebiz} from '../../models/retencionmasivaebiz';
import {RetencionCabecera} from '../../models/retencion-cabecera';
import {RetencionpersiscabeceraService} from '../../services/retencionpersiscabecera.service';
import {PrincipalRetencion} from '../../models/principal-retencion';
import {EstadoArchivoService} from '../../../general/utils/estadoArchivo.service';
import {EntidadService} from '../../../general/services/organizacion/entidad.service';
import {Entidad} from '../../../general/models/organizacion/entidad';
import {ArchivoMasivaService} from '../../services/archivoMasiva.service';
import {ArchivoMasiva, ArchivoMasivaEntrada} from '../../models/archivoMasiva';
import {HttpClient, HttpParams} from '@angular/common/http';
import {PersistenciaEntidadService} from '../../services/persistencia.entidad.service';
import {Serie} from '../../../general/models/configuracionDocumento/serie';
import {SeriesService} from '../../../general/services/configuracionDocumento/series.service';
import {ArchivoService} from '../../../general/services/archivos/archivo.service';
import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {TablaMaestra} from '../../../general/models/documento/tablaMaestra';
import {TablaMaestraService} from '../../../general/services/documento/tablaMaestra.service';
import {TiposService} from '../../../general/utils/tipos.service';
import {TIPO_ARCHIVO_CSV} from '../../../general/models/archivos/tipoArchivo';
import {PadreRetencionPercepcionService} from '../../services/padre-retencion-percepcion.service';
import {ColumnaDataTable} from '../../../general/data-table/utils/columna-data-table';
import {TipoArchivoRestriccion} from '../../../general/directivas/archivo.directive';
declare var $, swal: any;

@Component({
  selector: 'app-retencion-masiva',
  templateUrl: './retencion-masiva.component.html',
  styleUrls: ['./retencion-masiva.component.css']
})
export class RetencionMasivaComponent implements OnInit {
  titulo = 'Retención';
  public archivo: File | FileList | undefined;
  // public titulo: string;
  public productFormGroup: FormGroup;
  public series: Serie[] = [];
  public retencioncab: RetencionCabecera;
  public retencioncabedit: RetencionCabecera;
  public listaitems: Retencionebiz[];
  public listaitemsmasiva: Retencionmasivaebiz[];
  public entidad: Entidad[] = [];
  public entidad_uno: Entidad = new Entidad();
  public tipoComprobanteRP: string;
  public total_retencion: number;
  public total_importe: number;
  public retencion_principal: PrincipalRetencion;
  public mostrarretencion = false;
  public tiposComprobantes: BehaviorSubject<TablaMaestra[]> = new BehaviorSubject<TablaMaestra[]>([]);
  private todosTiposComprobantes: BehaviorSubject<TablaMaestra[]> = new BehaviorSubject<TablaMaestra[]>([]);
  public columnasTabla: ColumnaDataTable[];
  public tipomasiva: any = ModoVistaAccion.ICONOS;
  public AccionesMasiva: Accion[] = [
    new Accion('visualizar', new Icono('visibility', 'btn-info'), TipoAccion.VISUALIZAR),
    new Accion('descargar', new Icono('file_download', 'btn-info'), TipoAccion.DESCARGAR)
  ];
  @ViewChild('tablamasiva') tablamasiva: DataTableComponent<ArchivoMasiva>;

  @ViewChild('inputArchivo') inputArchivo: ElementRef;

  archivoFormGroup: FormGroup;

  parametrosMasiva: HttpParams;
  tipoMetodoMasiva: string;
  urlArchivoMasivaService: string;
  pathFormatoArchivoMasivo: string;
  public activarRetencionSimple = true;
  public ordenarPorElCampoMasiva: string;

  archivoSeleccionado: BehaviorSubject<FileList>;
  tiposArchivosPermitidos: TipoArchivoRestriccion;


  constructor(private httpClient: HttpClient,
              private httpClient1: HttpClient,
              private route: ActivatedRoute,
              private router: Router,
              private persistenciaService: PersistenciaServiceRetencion,
              private RetencionCabecerapersistenciaService: RetencionpersiscabeceraService,
              private _estadoArchivo: EstadoArchivoService,
              private _entidadServices: EntidadService,
              private _entidadPersistenciaService: PersistenciaEntidadService,
              private serieService: SeriesService,
              public _archivoMasivaService: ArchivoMasivaService,
              public _archivoService: ArchivoService,
              public _translateService: TranslateService,
              private _tipos: TiposService,
              private _tablaMaestraService: TablaMaestraService,
              private _padreRetencionPerpcionService: PadreRetencionPercepcionService) {
    this._padreRetencionPerpcionService.actualizarComprobante(this.route.snapshot.data['codigo'],
      this.route.snapshot.data['mostrarCombo'], false);
    this.listaitemsmasiva = [];
    this.ordenarPorElCampoMasiva = 'fecha';
    this.columnasTabla = [
      new ColumnaDataTable('usuario', 'usuario'),
      new ColumnaDataTable('fecha', 'fecha'),
      new ColumnaDataTable('nombreArchivo', 'nombreArchivo'),
      new ColumnaDataTable('tamañoArchivo', 'tamanhoArchivo'),
      new ColumnaDataTable('ticket', 'ticket'),
      new ColumnaDataTable('estado', 'estado')
    ];
    this.tipoMetodoMasiva = this._archivoMasivaService.TIPO_ATRIBUTO_DOCUMENTO_MASIVO;
    this.parametrosMasiva = new HttpParams().set('id_entidad', localStorage.getItem('id_entidad')).set('tipo_doc', this._tipos.TIPO_RETENCION_MASIVA_CODIGO);
    this.urlArchivoMasivaService = this._archivoMasivaService.urlQry;
    this.pathFormatoArchivoMasivo = this._archivoService.pathFormatoArchivoMasivo;
    this.archivoSeleccionado = new BehaviorSubject<FileList>(null);
    this.tiposArchivosPermitidos = ['application/vnd.ms-excel', 'text/csv', '.csv', 'text/comma-separated-values'];
  }

  ngOnInit() {
    this.archivoFormGroup = new FormGroup({
      archivo: new FormControl('', Validators.required)
    });
  }

  cambioArchivo(event) {
    console.log(this.archivoFormGroup);
    this.inputArchivo.nativeElement.cancelable = true;
    if (event.target.files.length === 0) {
      if (this.archivoSeleccionado.value !== null) {
        this.inputArchivo.nativeElement.files = event.target.files[0];
      }
    }
    this.archivoSeleccionado.next(event.target.files);
  }

  clickEliminarArchivo() {
    this.archivoFormGroup.reset();
    this.archivoSeleccionado.next(null);
  }

  iniciarDataMasiva() {
  }

  public cargarmasiva() {
    const that = this;
    let deseaCargarArchivo = '';
    that._translateService.get('deseaCargarArchivo').take(1).subscribe(data => deseaCargarArchivo = data);
    let deseaCargarArchivos = '';
    that._translateService.get('deseaCargarArchivos').take(1).subscribe(data => deseaCargarArchivos = data);
    let siText = '';
    that._translateService.get('si').take(1).subscribe(data => siText = data);
    let noText = '';
    that._translateService.get('no').take(1).subscribe(data => noText = data);
    let accionCancelada = '';
    that._translateService.get('accionCancelada').take(1).subscribe(data => accionCancelada = data);
    let archivoNoSubido = '';
    that._translateService.get('archivoNoSubido').take(1).subscribe(data => archivoNoSubido = data);
    swal({
      title: deseaCargarArchivo,
      padding: '20',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: siText,
      cancelButtonText: noText,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false
    }).then(
      (result) => {
        this.cargarMasivaArchivo();
      }, (dismiss) => {
        swal(
          accionCancelada,
          '',
          'error'
        );
      });
  }

  public cargarMasivaArchivo() {
    this.listaitemsmasiva = [
      new Retencionmasivaebiz()
    ];
    const archivoReader = new FileReader();
    const archivo = this.inputArchivo.nativeElement.files[0];
    archivoReader.readAsDataURL(archivo);
    let archivoBase64 = '';
    const that = this;
    archivoReader.onload = function (event) {
      archivoBase64 = archivoReader.result.split(',')[1];
      const nombreArchivo: string = archivo.name;
      const tamanhoArchivo: string = ((archivo.size / 1024).toFixed(2)).toString() + 'KB';
      const data: string = archivoBase64;
      const archivoMasivaEntrada: ArchivoMasivaEntrada = new ArchivoMasivaEntrada();
      archivoMasivaEntrada.crearArchivoMasivaEntrada(
        nombreArchivo,
        tamanhoArchivo,
        data
      );


      that._archivoMasivaService.crearArchivoMasiva(archivoMasivaEntrada).subscribe(
        data => {
          /*let accionExitosa = '';
          that._translateService.get('accionExitosa').take(1).subscribe(data => accionExitosa = data);
          let mensajeCorrectoArchivosMasivos = '';
          that._translateService.get('mensajeCorrectoArchivosMasivos').take(1).subscribe(data => mensajeCorrectoArchivosMasivos = data);*/
          if (data) {
            /*swal({
              title: accionExitosa,
              type: 'success',
              confirmButtonClass: 'btn btn-success',
              buttonsStyling: false,
            });*/
            setTimeout(
              () => {
                that.archivoFormGroup.reset();
                that.archivoSeleccionado.next(null);
                that.tablamasiva.cargarData();
              }
              , 1000);
          }
        }
      );

    };
  }

  public setEstadoTicketRetencionMasiva(posicion: number) {
    switch (this.listaitemsmasiva[posicion].estadoId) {
      case this._estadoArchivo.TIPO_ESTADO_ARCHIVO_PROCESADO:
        return this._estadoArchivo.TIPO_ESTADO_ARCHIVO_PROCESADO_NOMBRE;
      case this._estadoArchivo.TIPO_ESTADO_ARCHIVO_CON_ERROR:
        this.listaitemsmasiva[posicion].ticket = '-';
        return this._estadoArchivo.TIPO_ESTADO_ARCHIVO_CON_ERROR_NOMBRE;
      case this._estadoArchivo.TIPO_ESTADO_ARCHIVO_EN_PROCESO:
        return this._estadoArchivo.TIPO_ESTADO_ARCHIVO_EN_PROCESO_NOMBRE;
    }
  }

  public ejecutarAccionMasiva(evento: [TipoAccion, ArchivoMasiva]) {
    const tipoAccion = evento[0];
    let archivoMasiva: ArchivoMasiva = new ArchivoMasiva();
    archivoMasiva = evento[1];
    switch (tipoAccion) {
      case TipoAccion.VISUALIZAR:
        this.router.navigate(['percepcion-retencion/retencion/masiva/detalle/', archivoMasiva.idDocumentoMasivo], {
          queryParams: {
            idDocumentoMasivo: archivoMasiva.idDocumentoMasivo,
            totalRegistros: archivoMasiva.totalRegistros,
            nombreArchivo: archivoMasiva.nombreArchivo,
            totalErrores: archivoMasiva.totalRegistrosErroneos,
          }, skipLocationChange: true
        });
        break;
      case TipoAccion.DESCARGAR:
        this._archivoService.descargararchivotipo(archivoMasiva.nombreArchivo, TIPO_ARCHIVO_CSV.idArchivo);
        break;
    }
  }

  descargarFormatoMasiva() {
    this._archivoService.descargarFormatoArchivoMasiva();
  }


}
