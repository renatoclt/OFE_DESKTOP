import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Accion, Icono} from '../../general/data-table/utils/accion';
import {TipoAccion} from '../../general/data-table/utils/tipo-accion';
import {DataTableComponent} from '../../general/data-table/data-table.component';
import {Retencionebiz} from '../models/retencionebiz';
import {ModoVistaAccion} from '../../general/data-table/utils/modo-vista-accion';
import {PersistenciaServiceRetencion} from '../services/persistencia.service';
import {Retencionmasivaebiz} from '../models/retencionmasivaebiz';
import {RetencionCabecera} from '../models/retencion-cabecera';
import {RetencionpersiscabeceraService} from '../services/retencionpersiscabecera.service';
import {PrincipalRetencion} from '../models/principal-retencion';
import {EstadoArchivoService} from '../../general/utils/estadoArchivo.service';
import {EntidadService} from '../../general/services/organizacion/entidad.service';
import {Entidad} from '../../general/models/organizacion/entidad';
import {ArchivoMasivaService} from '../services/archivoMasiva.service';
import {ArchivoMasiva, ArchivoMasivaEntrada} from '../models/archivoMasiva';
import {HttpClient, HttpParams} from '@angular/common/http';
import {PersistenciaEntidadService} from '../services/persistencia.entidad.service';
import {Serie} from '../../general/models/configuracionDocumento/serie';
import {SeriesService} from '../../general/services/configuracionDocumento/series.service';
import {ArchivoService} from '../../general/services/archivos/archivo.service';
import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {TABLA_MAESTRA_TIPO_COMPROBANTE, TablaMaestra} from '../../general/models/documento/tablaMaestra';
import {TablaMaestraService} from '../../general/services/documento/tablaMaestra.service';
import {TiposService} from '../../general/utils/tipos.service';
import set = Reflect.set;
import {SpinnerService} from '../../../service/spinner.service';
import {CompleterData, CompleterService} from 'ng2-completer';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {TIPO_ARCHIVO_CSV} from '../../general/models/archivos/tipoArchivo';
import {Observable} from 'rxjs/Observable';

declare var $, swal: any;

@Component({
  selector: 'app-percepcion-retencion-crear',
  templateUrl: './percepcion-retencion-crear.component.html',
  styleUrls: ['./percepcion-retencion-crear.css'],
  providers: [SeriesService]
})
export class PercepcionRetencionCrearComponent implements OnInit {
  public archivo: File | FileList | undefined;
  public desahibilitarEliminarArchivo = false;
  public desahibilitarEliminarArchivoAux = true;
  public titulo: string;
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

  // Data Table Retencion Unitaria y MASIVA //
  public cabecera: string[] = [];
  public atributos: string[] = [];
  public tipo: any = ModoVistaAccion.ICONOS;
  public AccionesPrueba: Accion[] = [
    new Accion('editar', new Icono('visibility', 'btn-info'), TipoAccion.EDITAR),
  ];
  @ViewChild('tablaNormal') tabla: DataTableComponent<Retencionebiz>;
  public cabeceramasiva: string[] = [];
  public atributosmasiva: string[] = [];
  public ordenarPorElCampoMasiva: string;
  public tipomasiva: any = ModoVistaAccion.ICONOS;
  public AccionesMasiva: Accion[] = [
    new Accion('visualizar', new Icono('visibility', 'btn-info'), TipoAccion.VISUALIZAR),
    new Accion('descargar', new Icono('file_download', 'btn-info'), TipoAccion.DESCARGAR)
  ];
  @ViewChild('tablamasiva') tablamasiva: DataTableComponent<ArchivoMasiva>;
  // Fin Data Table SuperSayayin Retencion Unitaria Y Masiva//
  @ViewChild('inputArchivo') inputArchivo: ElementRef;
  @ViewChild('formArchivo') formArchivo: ElementRef;

  parametrosMasiva: HttpParams;
  tipoMetodoMasiva: string;
  urlArchivoMasivaService: string;
  pathFormatoArchivoMasivo: string;
  public activarRetencionSimple = true;

  public searchData = [];

// -----*----- //

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
              private _spinner: SpinnerService,
              private completerService: CompleterService, 
            ) {
    this.retencioncab = new RetencionCabecera();
    this.retencion_principal = new PrincipalRetencion();
    this.total_retencion = 0;
    // RETENCION UNITARIA
    this.listaitems = [];
    this.cabecera = [
      'tipo', 'serie', 'numeroCorrelativo', 'fechaEmision', 'Moneda Origen',
      'importeTotal', 'importeTotalsoles', 'importeRetencionsoles'
    ];
    this.atributos = [
      'tipoDocumentoDestinoDescripcion', 'serieDocumentoDestino', 'correlativoDocumentoDestino',
      'fechaEmisionDestino', 'monedaDestino', 'totalImporteDestino', 'totalMonedaDestino', 'totalImporteAuxiliarDestino'
    ];
    // RETENCION MASIVA
    this.listaitemsmasiva = [];
    this.cabeceramasiva = [
      'usuario', 'fecha', 'nombreArchivo',
      'tamañoArchivo', 'ticket', 'estado'
    ];
    this.atributosmasiva = [
      'usuario', 'fecha', 'nombreArchivo',
      'tamanhoArchivo', 'ticket', 'estado'
    ];
    this.ordenarPorElCampoMasiva = 'fecha';
    this.tipoMetodoMasiva = this._archivoMasivaService.TIPO_ATRIBUTO_DOCUMENTO_MASIVO;
    this.parametrosMasiva = new HttpParams().set('id_entidad', localStorage.getItem('id_entidad'));

    this.urlArchivoMasivaService = this._archivoMasivaService.urlQry;
    this.pathFormatoArchivoMasivo = this._archivoService.pathFormatoArchivoMasivo;
  }

  // Ciclo de Vida Angular //
  ngOnInit() {
    this.initForm();
    this.cargarProductoEditarLleno();
    this.cargarServiciosArranque();
    this.setTipoComprobante();
    this.obtener();
    this.serieService.filtroSeries(localStorage.getItem('id_entidad'), this._tipos.TIPO_DOCUMENTO_RETENCION, this._tipos.TIPO_SERIE_OFFLINE.toString())
      .subscribe(
        valor => {
          this.series = valor;
        });
  }

  autocompleListFormatter(data: any): string {
    return data['organizacion']['denominacion'];
  }

  obtener() {
    this.tipoComprobanteRP = this.route.snapshot.data['codigo'];
    console.log(this.tipoComprobanteRP);
    if (this.tipoComprobanteRP == '01') {
       this.titulo = 'retencioncrear';
       this.activarRetencionSimple = true;
      this.mostrarretencion = true;
    } else {
      this.titulo = 'percepcioncrear';
      this.mostrarretencion = false;
      this.activarRetencionSimple = false;
    }
  }

  busqueda(event) {
    const ruc = this.productFormGroup.get('razonsocial').value.organizacion.documento;
    if (this.productFormGroup.get('razonsocial').value != undefined) {
      this._entidadServices.buscarPorRuc(ruc)
        .subscribe(
          data => {
            this.entidad_uno = data ? data : new Entidad();
            this.productFormGroup.controls['txtruc'].setValue(this.entidad_uno.documento);
            this.productFormGroup.controls['txtdireccionfiscal'].setValue(this.entidad_uno.direccionFiscal);
            this._entidadPersistenciaService.setEntidad(this.entidad_uno);
            setTimeout(function () {
              $('input').each(function () {
                $(this.parentElement).removeClass('is-empty');
              });
            }, 200);
          }
        ),
        error => {
          console.log('ERROR');
          console.log(error);
          console.log(error.status);
          if (error.status == 500) {
            swal({
              type: 'error',
              title: 'No se encontró la organizacion u ocurrio un problema en el servidor.',
              confirmButtonClass: 'btn btn-danger',
              buttonsStyling: false
            });
          }
        };
    } else {
      console.log('ESTA EN BLANCO');
    }
  }

  private cargarServiciosArranque() {
    this.todosTiposComprobantes = this._tablaMaestraService.obtenerPorIdTabla(TABLA_MAESTRA_TIPO_COMPROBANTE);
    console.log(this.todosTiposComprobantes);
  }

  private setTipoComprobante() {
    let codigosComprobantes: string[] = [];
    codigosComprobantes = [this._tipos.TIPO_DOCUMENTO_RETENCION];
    this.tiposComprobantes = this._tablaMaestraService.obtenerPorCodigoDeTablaMaestra(this.todosTiposComprobantes, codigosComprobantes);
    console.log(this.tiposComprobantes);
    console.log(this.todosTiposComprobantes);
  }

  cambioArchivo(event) {
    this.desahibilitarEliminarArchivo = false;
    this.desahibilitarEliminarArchivoAux = false;

  }

  clickEliminarArchivo() {
    this.desahibilitarEliminarArchivo = true;
    this.desahibilitarEliminarArchivoAux = false;
  }


  listarOrganizacionesDeAutcompletado(keyword: any) {
    if (keyword) {
      return this._entidadServices.buscarPorRazonSocial(keyword);
    } else {
      return Observable.of([]);
    }
  }


  busquedaruc(event) {
    if (event.keyCode == 13) {
      if (this.productFormGroup.get('txtruc').value.length == 11) {
        const listaEntidades = this._entidadServices.buscarPorRuc(this.productFormGroup.get('txtruc').value);
        console.log(listaEntidades);
        if (listaEntidades != null) {
          listaEntidades.subscribe(
            data => {
              console.log('--data--');
              console.log(data);
              this.entidad_uno = data ? data : new Entidad();
              this.productFormGroup.controls['razonsocial'].setValue(this.entidad_uno.denominacion);
              this._entidadPersistenciaService.setEntidad(this.entidad_uno);
              setTimeout(function () {
                $('input').each(function () {
                  $(this.parentElement).removeClass('is-empty');
                });
              }, 200);
            }
          );
        } else{
          this.productFormGroup.controls['txtcorreo'].enable();
          this.productFormGroup.controls['txtdireccionfiscal'].enable();
        }
      }
    }
  }

  iniciarDataMasiva() {
  }

  // FUNCIONES //
  iniciarData(event) {
    this.total_retencion = 0;
    this.total_importe = 0;
    this.listaitems = this.persistenciaService.getListaProductos();
    this.tabla.insertarData(this.listaitems);
    for (let i = 0; i < this.listaitems.length; i++) {
      this.total_retencion += Number(this.listaitems[i].totalImporteAuxiliarDestino);
      this.total_importe += Number(this.listaitems[i].totalImporteDestino);

    }
    this.productFormGroup.get('txttotal').setValue(parseFloat(this.total_retencion.toString()).toFixed(2));
    this.retencioncab.totalimporte = Number(parseFloat(this.total_importe.toString()).toFixed(2));
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
    this._spinner.set(true);
    this.listaitemsmasiva = [
      new Retencionmasivaebiz()
    ];
    const blob = new Blob();
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
          let accionExitosa = '';
          that._translateService.get('accionExitosa').take(1).subscribe(data => accionExitosa = data);
          let mensajeCorrectoArchivosMasivos = '';
          that._translateService.get('mensajeCorrectoArchivosMasivos').take(1).subscribe( data => mensajeCorrectoArchivosMasivos = data);
            if (data) {
              // that.spinnerService.set(false).subscribe(data=>{ console.log(data);});
              setTimeout(
                () => {
                  swal({
                    title: accionExitosa ,
                    type: 'success',
                    confirmButtonClass: 'btn btn-success',
                    buttonsStyling: false,
                  });
                  that.formArchivo.nativeElement.reset();
                  that.tablamasiva.cargarData();
                }
              , 5000);
          } else {
            that._spinner.set(false);
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

  public vistaprevia() {
    this.fillProducto();
    this.RetencionCabecerapersistenciaService.setCabeceraRetencion(this.retencioncab);
    this.router.navigateByUrl('percepcion-retencion/crear/vista-previa');
  }

  private initForm() {
    const fecha = new Date();
    const fecha_actual = fecha.getDate().toString() + '/' + fecha.getMonth().toString() + '/' + fecha.getFullYear().toString();
    this.productFormGroup = new FormGroup({
      'cmbserie': new FormControl('', [Validators.required]),
      'txtruc': new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]{11}'),
        Validators.minLength(11),
        Validators.maxLength(11)
      ]),
      'txtrazonsocial': new FormControl('', [Validators.required]),
      'razonsocial': new FormControl(''),
      'txtdireccionfiscal': new FormControl('', [Validators.required]),
      'txttipomoneda': new FormControl({value: 'PEN', disabled: true}),
      'txtobservacion': new FormControl('', [Validators.maxLength(500)]),
      'datefechapago': new FormControl(fecha_actual, [Validators.required]),
      'txttotal': new FormControl({value: this.total_retencion, disabled: false}, [
        Validators.required, Validators.min(0.01), Validators.minLength(3)
      ])
    });
  }

  limpiar($event) {
    this.productFormGroup.reset();
  }

  filtro($event) {
    this.fillProducto();
  }

  public cargarProductoEditarLleno() {
    let cabecera: RetencionCabecera = new RetencionCabecera();
    cabecera = this.RetencionCabecerapersistenciaService.getCabeceraRetencion();
    if (cabecera) {
      this.retencioncabedit = this.RetencionCabecerapersistenciaService.getCabeceraRetencion();
      this.productFormGroup.controls['cmbserie'].setValue(this.retencioncabedit.idserie);
      this.productFormGroup.controls['txtruc'].setValue(this.retencioncabedit.rucComprador);
      this.productFormGroup.controls['txtrazonsocial'].setValue(this.retencioncabedit.razonSocialComprador);
      this.productFormGroup.controls['txtobservacion'].setValue(this.retencioncabedit.observacionComprobante);
      this.productFormGroup.controls['datefechapago'].setValue(this.retencioncabedit.fecPago);
      this.productFormGroup.controls['txtdireccionfiscal'].setValue(this.retencioncabedit.direccionproveedor);
      setTimeout(function () {
        $('select').each(function () {
          $(this.parentElement).removeClass('is-empty');
        });
      }, 200);
    }
  }

  fillProducto() {
    this.retencioncab.idserie = this.productFormGroup.get('cmbserie').value;
    const indexSerie = this.series.findIndex(element => element.idSerie == this.productFormGroup.get('cmbserie').value);
    this.retencioncab.serie = indexSerie == -1 ? '' : this.series[indexSerie].serie;
    this.retencioncab.rucComprador = this.productFormGroup.get('txtruc').value;
    this.retencioncab.razonSocialComprador = this.productFormGroup.get('txtrazonsocial').value;
    this.retencioncab.razonSocialProveedor = 'SMART REASONS SRL';
    this.retencioncab.rucProveedor = 20539622031;
    this.retencioncab.direccioncomprador = this.productFormGroup.get('txtdireccionfiscal').value;
    this.retencioncab.direccionproveedor = 'PJ. JORGE BASADRE NRO. 158 URB. POP LA UNIVERSAL 2DA ET. LIMA - LIMA - SANTA ANITA';
    this.retencioncab.fecPago = this.productFormGroup.get('datefechapago').value;
    this.retencioncab.moneda = this.productFormGroup.get('txttipomoneda').value;
    this.retencioncab.observacionComprobante = this.productFormGroup.get('txtobservacion').value;
    this.retencioncab.total = this.productFormGroup.get('txttotal').value;
    this.retencioncab.idtipocomprobanteproveedor = this.tiposComprobantes.getValue()[0].codigo;
    this.retencioncab.tipocomprobanteproveedor = this.tiposComprobantes.getValue()[0].descripcionCorta;
    this.retencioncab.idTablaTipoComprobante = this.tiposComprobantes.getValue()[0].tabla.toString();
    this.retencioncab.idTipoComprobante = '3';
    console.log(this.retencioncab);
  }

  eliminar(elementos: Retencionebiz[]) {

    swal({
      title: '¿Está Seguro?',
      html:
        '<div class="text-center"> Desea eliminar el/los item(s).  </div>',
      padding: '20',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'SÍ',
      cancelButtonText: 'NO',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false
    })
      .catch((result) => {
        }
      )
      .then(result => {
        if (result) {
          // Falta validar como mostrar los estados del archivo
          this.persistenciaService.setListaProductos(elementos);
          swal({
            title: 'Acción Exitosa',
            html:
              '<div class="text-center">Item(s) eliminado(s) correctamente.  </div>',
            type: 'success',
            confirmButtonClass: 'btn btn-success',
            buttonsStyling: false,
          });
        } else {
          console.log('CANCELADOP');
          swal({
            title: 'Cancelado',
            html:
              '<div class="text-center">Item(s) no fue eliminado(s) correctamente.  </div>',
            type: 'error',
            confirmButtonClass: 'btn btn-success',
            buttonsStyling: false,
          });
        }
      });
    this.total_retencion = 0;
    this.listaitems = this.persistenciaService.getListaProductos();
    for (let i = 0; i < this.listaitems.length; i++) {
      this.total_retencion += Number(this.listaitems[i].totalImporteAuxiliarDestino);
      this.total_importe += Number(this.listaitems[i].totalImporteDestino);
    }
    this.productFormGroup.get('txttotal').setValue(parseFloat(this.total_retencion.toString()).toFixed(2));
    this.retencioncab.totalimporte = Number(parseFloat(this.total_importe.toString()).toFixed(2));
  }

  agregarItem(agrego: boolean) {
    this.RetencionCabecerapersistenciaService.setCabeceraRetencion(this.retencioncab);
    this.router.navigateByUrl('percepcion-retencion/crear/agregar-item');
  }

  ejecutarAccion(evento: [TipoAccion, Retencionebiz]) {
    const tipoAccion = evento[0];
    let producto: Retencionebiz = new Retencionebiz();
    producto = evento[1];
    switch (tipoAccion) {
      case TipoAccion.ELIMINAR:
        break;
      case TipoAccion.EDITAR:
        this.router.navigate(['percepcion-retencion/crear/editar-item', producto.id]);
        this.fillProducto();
        this.RetencionCabecerapersistenciaService.setCabeceraRetencion(this.retencioncab);
        break;
    }
  }

  public ejecutarAccionMasiva(evento: [TipoAccion, ArchivoMasiva]) {
    const tipoAccion = evento[0];
    let archivoMasiva: ArchivoMasiva = new ArchivoMasiva();
    archivoMasiva = evento[1];
    switch (tipoAccion) {
      case TipoAccion.VISUALIZAR:
        this.router.navigate(['percepcion-retencion/bienes-servicios-masiva/detalle/', archivoMasiva.idDocumentoMasivo], {
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
