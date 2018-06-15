import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Accion, Icono} from '../../../general/data-table/utils/accion';
import {TipoAccion} from '../../../general/data-table/utils/tipo-accion';
import {DataTableComponent} from '../../../general/data-table/data-table.component';
import {Retencionebiz} from '../../models/retencionebiz';
import {ModoVistaAccion} from '../../../general/data-table/utils/modo-vista-accion';
import {PersistenciaServiceRetencion} from '../../services/persistencia.service';
import {RetencionCabecera} from '../../models/retencion-cabecera';
import {RetencionpersiscabeceraService} from '../../services/retencionpersiscabecera.service';
import {PrincipalRetencion} from '../../models/principal-retencion';
import {EstadoArchivoService} from '../../../general/utils/estadoArchivo.service';
import {EntidadService} from '../../../general/services/organizacion/entidad.service';
import {Entidad, OrganizacionDTO} from '../../../general/models/organizacion/entidad';
import {HttpClient} from '@angular/common/http';
import {PersistenciaEntidadService} from '../../services/persistencia.entidad.service';
import {Serie} from '../../../general/models/configuracionDocumento/serie';
import {SeriesService} from '../../../general/services/configuracionDocumento/series.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {TABLA_MAESTRA_TIPO_COMPROBANTE, TablaMaestra} from '../../../general/models/documento/tablaMaestra';
import {TablaMaestraService} from '../../../general/services/documento/tablaMaestra.service';
import {TiposService} from '../../../general/utils/tipos.service';
import {Observable} from 'rxjs/Observable';
import {ArchivoMasivaService} from '../../services/archivoMasiva.service';
import {Validadortabla} from '../../services/validadortabla';
import {ValidadorPersonalizado} from '../../../general/services/utils/validadorPersonalizado';
import {RefreshService} from '../../../general/services/refresh.service';
import {PadreRetencionPercepcionService} from '../../services/padre-retencion-percepcion.service';
import {ColumnaDataTable} from '../../../general/data-table/utils/columna-data-table';
import { RetencionService } from '../../../general/services/comprobantes/retencion.service';
import { retencionesService } from '../../../../service/retencionesservice';
declare var swal: any;

@Component({
  selector: 'app-retencion-unitaria',
  templateUrl: './retencion-unitaria.component.html',
  styleUrls: ['./retencion-unitaria.component.css']
})

export class RetencionUnitariaComponent implements OnInit, OnDestroy {
  titulo = 'Retención';
  public rucquery: string;
  public validarporcentajes: boolean;
  public archivo: File | FileList | undefined;
  public productFormGroup: FormGroup;
  public series: Serie[] = [];
  public retencioncab: RetencionCabecera;
  public retencioncabedit: RetencionCabecera;
  public listaitems: Retencionebiz[];
  public estadoautocomplete: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public entidad: Entidad[] = [];
  public entidad_uno: Entidad = new Entidad();
  public total_retencion: number;
  public total_importe: number;
  public retencion_principal: PrincipalRetencion;
  public tiposComprobantes: BehaviorSubject<TablaMaestra[]> = new BehaviorSubject<TablaMaestra[]>([]);
  private todosTiposComprobantes: BehaviorSubject<TablaMaestra[]> = new BehaviorSubject<TablaMaestra[]>([]);
  public columnasTabla: ColumnaDataTable[];
  public tipo: any = ModoVistaAccion.ICONOS;
  public ordenarPorElCampo: string;
  public AccionesPrueba: Accion[] = [ new Accion('editar', new Icono('visibility', 'btn-info'), TipoAccion.EDITAR)];
  @ViewChild('tablaNormal') tabla: DataTableComponent<Retencionebiz>;
  @ViewChild('inputrazonsocial') razonautocomplete: ElementRef;

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
              private _tipos: TiposService,
              private _tablaMaestraService: TablaMaestraService,
              private Refresh: RefreshService,
              private _padreRetencionPerpcionService: PadreRetencionPercepcionService ,
              private _servicioRetencion: RetencionService ) {
              this._padreRetencionPerpcionService.actualizarComprobante(this.route.snapshot.data['codigo'],
                this.route.snapshot.data['mostrarCombo'], true);
                this.retencioncab = new RetencionCabecera();
                this.retencion_principal = new PrincipalRetencion();
                this.total_retencion = 0;
                // RETENCION UNITARIA
                this.listaitems = [];
                this.columnasTabla = [
                  new ColumnaDataTable('tipo', 'tipoDocumentoDestinoDescripcion'),
                  new ColumnaDataTable('serie', 'serieDocumentoDestino'),
                  new ColumnaDataTable('numeroCorrelativo', 'correlativoDocumentoDestino'),
                  new ColumnaDataTable('fechaEmision', 'fechaEmisionDestino'),
                  new ColumnaDataTable('Moneda Origen', 'monedaDestino'),
                  new ColumnaDataTable('importeTotal', 'totalMonedaDestino', {'text-align': 'right'}),
                  new ColumnaDataTable('importeTotalsoles', 'totalImporteDestino', {'text-align': 'right'}),
                  new ColumnaDataTable('importeRetencionsoles', 'totalImporteAuxiliarDestino', {'text-align': 'right'})
                ];
                this.ordenarPorElCampo = 'fechaEmisionDestino';
              }

  ngOnInit() {
    this.initForm();
    console.log('this.Refresh.CargarPersistencia - ONINIT');
    console.log(this.Refresh.CargarPersistencia);
    if (!this.Refresh.CargarPersistencia) {
        this.RetencionCabecerapersistenciaService.vaciar_data();
        this.persistenciaService.vaciar_data();
    }
    this.cargarProductoEditarLleno();
    this.cargarServiciosArranque();
    this.setTipoComprobante();
    
    this.serieService.filtroSeries(localStorage.getItem('id_entidad'), this._tipos.TIPO_DOCUMENTO_RETENCION, this._tipos.TIPO_SERIE_OFFLINE.toString())
      .subscribe(
        valor => {
          this.series = valor;
        });
  }

  ngOnDestroy () {
    this.Refresh.CargarPersistencia =  false;
    console.log('this.Refresh.CargarPersistencia - ONDESTROY');
    console.log(this.Refresh.CargarPersistencia);
  }

  public vistaprevia() {
    this.guardarOrganizacion();
    this.fillProducto();
    this.RetencionCabecerapersistenciaService.setCabeceraRetencion(this.retencioncab);
    this.router.navigateByUrl('percepcion-retencion/retencion/crear/individual/vista-previa');
  }

  private initForm() {
    const fecha = new Date();
    const fecha_actual = fecha.getDate().toString() + '/' + (fecha.getMonth() + 1).toString() + '/' + fecha.getFullYear().toString();
    this.productFormGroup = new FormGroup({
      'cmbserie': new FormControl('', [Validators.required]),
      'txtruc': new FormControl('', [Validators.required]),
      'razonsocial': new FormControl('', [Validators.required]),
      'txtdireccionfiscal': new FormControl({value: '', disabled: true}, [Validators.required]),
      'txtcorreo': new FormControl({value: '', disabled: true}, [Validators.required]),
      'txttipomoneda': new FormControl({value: 'PEN', disabled: true}),
      'txtobservacion': new FormControl('', [Validators.maxLength(500)]),
      'datefechapago': new FormControl(fecha_actual, [Validators.required,  ValidadorPersonalizado.fechaDeberiaSerMenorAHoy('errorFecha')]),
      'txttotal': new FormControl( this.total_retencion, [
        Validators.required, Validadortabla.HayValoresenlaTabla()
      ])
    });
  }

  autocompleListFormatter(data: any): string {
    return data['denominacion'];
  }

  public cargarProductoEditarLleno() {
    let cabecera: RetencionCabecera = new RetencionCabecera();
    cabecera = this.RetencionCabecerapersistenciaService.getCabeceraRetencion();
    if (cabecera) {
      this.retencioncabedit = this.RetencionCabecerapersistenciaService.getCabeceraRetencion();
      const opccion1 = this.retencioncabedit.rucComprador == undefined;
      const opccion2 = this.retencioncabedit.rucComprador.toString() == '';
      const opccion3 =  !(opccion1 || opccion2);
      if (opccion3) {
        this.estadoautocomplete.next(true);
        this.busqueda();
      } else {
        this.productFormGroup.controls['txtruc'].setValue(this.retencioncabedit.rucComprador);
        this.productFormGroup.controls['razonsocial'].setValue(this.retencioncabedit.razonSocialComprador);
        this.productFormGroup.controls['txtdireccionfiscal'].setValue(this.retencioncabedit.direccioncomprador);
      }
      this.productFormGroup.controls['cmbserie'].setValue(this.retencioncabedit.idserie);
      this.productFormGroup.controls['txtobservacion'].setValue(this.retencioncabedit.observacionComprobante);
      this.productFormGroup.controls['datefechapago'].setValue(this.retencioncabedit.fecPago);

      setTimeout(function () {
        $('select').each(function () {
          $(this.parentElement).removeClass('is-empty');
        });
      }, 200);
    }
  }

  private cargarServiciosArranque() {
    this.todosTiposComprobantes = this._tablaMaestraService.obtenerPorIdTabla(TABLA_MAESTRA_TIPO_COMPROBANTE);
  }

  private setTipoComprobante() {
    let codigosComprobantes: string[] = [];
    codigosComprobantes = [this._tipos.TIPO_DOCUMENTO_RETENCION];
    this.tiposComprobantes = this._tablaMaestraService.obtenerPorCodigosDeTablaMaestra(this.todosTiposComprobantes, codigosComprobantes);
  }

  listarOrganizacionesDeAutcompletado(keyword: any) {
    if (keyword) {
      if (this.entidad_uno && this.entidad_uno.denominacion !== keyword) {
        this.productFormGroup.get('txtruc').reset();
        this.productFormGroup.get('txtdireccionfiscal').reset();
        this.productFormGroup.get('txtcorreo').reset();
      }
      return this._entidadServices.buscarPorRazonSocial(keyword, '6');
    } else {
      return Observable.of([]);
    }
  }

  iniciarData(event) {
    this.listaitems = this.persistenciaService.getListaProductos();
    this.tabla.insertarData(this.listaitems);
    this.calcularMontoTotal();
  }

  public calcularMontoTotal() {
    this.total_retencion = 0;
    this.total_importe = 0;
    this.listaitems = this.persistenciaService.getListaProductos();
      for (let i = 0; i < this.listaitems.length; i++) {
        this.total_retencion += Number(this.listaitems[i].totalImporteAuxiliarDestino);
        this.total_importe += Number(this.listaitems[i].totalImporteDestino);
      }
      if (this.total_retencion != 0) {
        this.productFormGroup.get('txttotal').setValue(parseFloat(this.total_retencion.toString()).toFixed(2));
        this.retencioncab.totalimporte = Number(parseFloat(this.total_importe.toString()).toFixed(2));
        this.eliminarEstiloInputNormal('txttotal', 'is-empty');
      }
      if (this.listaitems.length === 0) {
        this.retencioncab.totalimporte = Number(parseFloat(this.total_importe.toString()).toFixed(2));
        this.productFormGroup.get('txttotal').reset();
      }
    this.productFormGroup.get('txttotal').setValue(parseFloat(this.total_retencion.toString()).toFixed(2));
    this.retencioncab.totalimporte = Number(parseFloat(this.total_importe.toString()).toFixed(2));
  }


  limpiar($event) {
    this.productFormGroup.reset();
  }

  filtro($event) {
    this.fillProducto();
  }

  busquedaruc(event) {
      if (this.productFormGroup.controls['txtruc'].value.length == 11) {
        const listaEntidades = this._entidadServices.buscarPorRuc(this.productFormGroup.get('txtruc').value);
        if (listaEntidades != null) {
          listaEntidades.subscribe(
            data => {
              if(data){
                this.entidad_uno = data ? data : new Entidad();
                this.productFormGroup.controls['razonsocial'].setValue( this.entidad_uno.denominacion);
                this.productFormGroup.controls['txtdireccionfiscal'].setValue(this.entidad_uno.direccionFiscal);
                this.productFormGroup.controls['txtcorreo'].setValue(this.entidad_uno.correoElectronico);
                const condicion1 = this.entidad_uno.correoElectronico === '';
                const condicion2 = this.entidad_uno.correoElectronico === '-';
                const condicion3 = this.entidad_uno.correoElectronico === null;
                const condicion4 = condicion1 || condicion2 || condicion3;
                if ( condicion4 ) {
                  this.productFormGroup.controls['txtcorreo'].enable();
                  this.productFormGroup.controls['txtdireccionfiscal'].enable();
                } else {
                  this.productFormGroup.controls['txtcorreo'].disable();
                }
                this._entidadPersistenciaService.setEntidad(this.entidad_uno);
                setTimeout(function () {
                  $('input').each(function () {
                    $(this.parentElement).removeClass('is-empty');
                  });
                }, 200);
                this.eliminarEstiloInput('razonsocial', 'is-empty');
              }else{
                this.productFormGroup.controls['txtcorreo'].enable();
                this.productFormGroup.controls['txtdireccionfiscal'].enable();
              }
            }
          );
        }
      } else {
        if( !this.productFormGroup.controls['txtcorreo'].enabled && this.productFormGroup.controls['razonsocial'].value.toString().length < 1){
          this.productFormGroup.controls['razonsocial'].reset();
          this.productFormGroup.controls['txtcorreo'].reset();
          this.productFormGroup.controls['txtdireccionfiscal'].reset();
        }
      }

  }

  cambioAutocomplete () {
    if ( typeof this.productFormGroup.get('razonsocial').value === 'object') {
      this.estadoautocomplete.next(true);
    }
    // else {
    //   this.productFormGroup.get('txtruc').reset();
    //   this.productFormGroup.get('txtdireccionfiscal').reset();
    //   this.productFormGroup.get('razonsocial').reset();
    //   this.estadoautocomplete.next(false);
    // }
  }

  public eliminarEstiloInput(idHtml: string, estilo: string) {
    setTimeout(function () {
      $('#' + idHtml).parent().parent().removeClass(estilo);
    }, 200);
  }
  public eliminarEstiloInputNormal(idHtml: string, estilo: string) {
    setTimeout(function () {
      $('#' + idHtml).parent().removeClass(estilo);
    }, 200);
  }

  busqueda() {
    let cabecera: RetencionCabecera = new RetencionCabecera();
    cabecera = this.RetencionCabecerapersistenciaService.getCabeceraRetencion();
      if (this.estadoautocomplete.value == true) {
        this.rucquery = cabecera.rucComprador.toString();
      } else {
        this.rucquery = this.productFormGroup.get('razonsocial').value.documento;
      }
      this.estadoautocomplete.next(false);
      if (this.productFormGroup.get('razonsocial').value != undefined) {
        this._entidadServices.buscarPorRuc(this.rucquery)
          .subscribe(
            data => {
              this.entidad_uno = data ? data : new Entidad();
              this.productFormGroup.controls['txtruc'].setValue(this.entidad_uno.documento);
              this.productFormGroup.controls['txtdireccionfiscal'].setValue(this.entidad_uno.direccionFiscal);
              this.productFormGroup.controls['razonsocial'].setValue(this.entidad_uno.denominacion);
              this.productFormGroup.controls['txtcorreo'].setValue(this.entidad_uno.correoElectronico);
              const condicion1 = this.entidad_uno.correoElectronico === '';
              const condicion2 = this.entidad_uno.correoElectronico === '-';
              const condicion3 = this.entidad_uno.correoElectronico === null;
              const condicion4 = condicion1 || condicion2 || condicion3;
              if ( condicion4 ) {
                this.productFormGroup.controls['txtcorreo'].enable();
              } else {
                this.productFormGroup.controls['txtcorreo'].disable();
                if (this.retencioncabedit) {
                  this.productFormGroup.controls['txtcorreo'].setValue(this.retencioncabedit.email);
                }
              }
              if (cabecera) {
                this.productFormGroup.controls['txtcorreo'].setValue(cabecera.email);
              } else {
                console.log(this.entidad_uno);
                this.productFormGroup.controls['txtcorreo'].setValue(this.entidad_uno.correoElectronico);
              }
              this._entidadPersistenciaService.setEntidad(this.entidad_uno);
              $('input').each(function () {
                $(this.parentElement).removeClass('is-empty');
              });
              this.eliminarEstiloInput('razonsocial', 'is-empty');
            }
          ),
          error => {
            console.log('error ');
            if (error.status == 500) {
              swal({
                type: 'error',
                title: 'No se encontró la organización u ocurrió un problema en el servidor.',
                confirmButtonClass: 'btn btn-danger',
                buttonsStyling: false,
                confirmButtonText: 'CONTINUAR',
              });
            }
          };
      }
  }

  fillProducto() {
    this.retencioncab.idserie = this.productFormGroup.get('cmbserie').value;
    const indexSerie = this.series.findIndex(element => element.idSerie == this.productFormGroup.get('cmbserie').value);
    this.retencioncab.serie = indexSerie == -1 ? '' : this.series[indexSerie].serie;
    this.retencioncab.rucComprador = this.productFormGroup.get('txtruc').value;
    this.retencioncab.razonSocialComprador = this.productFormGroup.get('razonsocial').value;
    this.retencioncab.razonSocialProveedor = localStorage.getItem('org_nombre');
    this.retencioncab.rucProveedor = Number(localStorage.getItem('org_ruc'));
    this.retencioncab.direccioncomprador = this.productFormGroup.get('txtdireccionfiscal').value;
    this.retencioncab.email = this.productFormGroup.get('txtcorreo').value;
    this.retencioncab.direccionproveedor = localStorage.getItem('org_direccion');
    this.retencioncab.fecPago = this.productFormGroup.get('datefechapago').value;
    this.retencioncab.moneda = this.productFormGroup.get('txttipomoneda').value;
    this.retencioncab.observacionComprobante = this.productFormGroup.get('txtobservacion').value;
    this.retencioncab.total = this.productFormGroup.get('txttotal').value;
    this.retencioncab.porcentajeImpuesto = '';
    if (this.tiposComprobantes.getValue().length > 0) {
      this.retencioncab.idtipocomprobanteproveedor = this.tiposComprobantes.getValue()[0].codigo;
      this.retencioncab.tipocomprobanteproveedor = this.tiposComprobantes.getValue()[0].descripcionCorta;
      this.retencioncab.idTablaTipoComprobante = this.tiposComprobantes.getValue()[0].tabla.toString();
    } else {
      this.retencioncab.idtipocomprobanteproveedor = '20';
      this.retencioncab.tipocomprobanteproveedor = 'Retencion';
      this.retencioncab.tipocomprobanteproveedor = '20';
    }

    this.retencioncab.idTipoComprobante = '20';
  }

  eliminar(elementos: Retencionebiz[]) {
    this.persistenciaService.setListaProductos(elementos);
    this.calcularMontoTotal();
  }

  agregarItem(agrego: boolean) {
    this.guardarOrganizacion();
    this.fillProducto();
    this.RetencionCabecerapersistenciaService.setCabeceraRetencion(this.retencioncab);
    this.router.navigateByUrl('percepcion-retencion/retencion/crear/individual/agregar-item');
  }

  guardarOrganizacion(){
    let organizacion:  OrganizacionDTO = new OrganizacionDTO;
    organizacion.correo = this.productFormGroup.controls['txtcorreo'].value;
    organizacion.direccion = this.productFormGroup.controls['txtdireccionfiscal'].value;
    organizacion.nombreComercial = this.productFormGroup.controls['razonsocial'].value;
    organizacion.ruc = this.productFormGroup.controls['txtruc'].value;
    if(organizacion.ruc.toString().length > 10)
      this._servicioRetencion.guardarOrganizacion(organizacion);
  }
  ejecutarAccion(evento: [TipoAccion, Retencionebiz]) {
    const tipoAccion = evento[0];
    let producto: Retencionebiz = new Retencionebiz();
    producto = evento[1];
    switch (tipoAccion) {
      case TipoAccion.ELIMINAR:
        break;
      case TipoAccion.EDITAR:
        this.router.navigate(['percepcion-retencion/retencion/crear/individual/editar-item', producto.id]);
        this.fillProducto();
        this.RetencionCabecerapersistenciaService.setCabeceraRetencion(this.retencioncab);
        break;
    }
  }
  actualizarCorreo(evento){
    this.retencioncab.email = this.productFormGroup.controls['txtcorreo'].value;
  }

}
