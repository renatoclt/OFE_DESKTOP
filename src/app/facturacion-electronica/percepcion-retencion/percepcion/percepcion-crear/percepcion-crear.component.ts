import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Accion, Icono} from '../../../general/data-table/utils/accion';
import {TipoAccion} from '../../../general/data-table/utils/tipo-accion';
import {DataTableComponent} from '../../../general/data-table/data-table.component';
import {ModoVistaAccion} from '../../../general/data-table/utils/modo-vista-accion';
import {EntidadService} from '../../../general/services/organizacion/entidad.service';
import {Entidad} from '../../../general/models/organizacion/entidad';
import {HttpClient} from '@angular/common/http';
import {Serie} from '../../../general/models/configuracionDocumento/serie';
import {SeriesService} from '../../../general/services/configuracionDocumento/series.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {TABLA_MAESTRA_TIPO_COMPROBANTE, TablaMaestra} from '../../../general/models/documento/tablaMaestra';
import {TablaMaestraService} from '../../../general/services/documento/tablaMaestra.service';
import {TiposService} from '../../../general/utils/tipos.service';
import {Observable} from 'rxjs/Observable';
import {PadreRetencionPercepcionService} from '../../services/padre-retencion-percepcion.service';
import {PercepcionCrearDetalle} from '../modelos/percepcion-crear-detalle';
import {EstilosServices} from '../../../general/utils/estilos.services';
import {CatalogoDocumentoIdentidadService} from '../../../general/utils/catalogo-documento-identidad.service';
import {PercepcionComunService} from '../servicios/percepcion-comun.service';
import {PercepcionCabecera} from '../modelos/percepcion-cabecera';
import {PercepcionCrearAuxiliar} from '../modelos/percepcion-crear-auxiliar';
import {UtilsService} from '../../../general/utils/utils.service';
import {Parametros} from '../../../general/models/parametros/parametros';
import {ParametrosService} from '../../../general/services/configuracionDocumento/parametros.service';
import {ValidadorPersonalizado} from '../../../general/services/utils/validadorPersonalizado';
import {ColumnaDataTable} from '../../../general/data-table/utils/columna-data-table';

declare var $, swal: any;

@Component({
  selector: 'app-percepcion-crear',
  templateUrl: './percepcion-crear.component.html',
  styleUrls: ['./percepcion-crear.component.css']
})
export class PercepcionCrearComponent implements OnInit {

  public percepcionFormGroup: FormGroup;
  public series: BehaviorSubject<Serie[]>;

  public tiposPercepcion: BehaviorSubject<Parametros[]>;

  public tiposComprobantes: BehaviorSubject<TablaMaestra[]>;
  private todosTiposComprobantes: BehaviorSubject<TablaMaestra[]>;

  public columnasTabla: ColumnaDataTable[];
  public tipoAccion: any;
  public ordenarPorElCampo: string;
  public accionesTabla: Accion[];

  public entidadEmisor: Entidad;

  public titulo: string;

  @ViewChild('tablaNormal') tabla: DataTableComponent<PercepcionCrearDetalle>;

  constructor(private httpClient: HttpClient,
              private route: ActivatedRoute,
              private router: Router,
              private _entidadServices: EntidadService,
              private _serieService: SeriesService,
              private _tiposService: TiposService,
              private _tablaMaestraService: TablaMaestraService,
              private _estilosService: EstilosServices,
              private _utilsService: UtilsService,
              private _parametrosService: ParametrosService,
              private _percepcionComunService: PercepcionComunService,
              private _catalogoDocumentoEntidadService: CatalogoDocumentoIdentidadService,
              private _padreRetencionPerpcionService: PadreRetencionPercepcionService) {
    this._padreRetencionPerpcionService.actualizarComprobante(this.route.snapshot.data['codigo'],
      this.route.snapshot.data['mostrarCombo'], false);
  }

  inicializarVariables() {
    this.entidadEmisor = null;
    this.titulo = 'crearPercepcion';
    this.inicializarVariablesDataTable();
    this.filtrarComprobantes();
    this.filtrarSeries();
    this.obtenerTiposPercepcion();
  }

  obtenerTiposPercepcion() {
    this.tiposPercepcion = this._parametrosService.obtenerParametrosPorId(this._tiposService.PARAMETRO_REGIMENES_PERCEPCION);
  }

  filtrarComprobantes() {
    this.todosTiposComprobantes = this._tablaMaestraService.obtenerPorIdTabla(TABLA_MAESTRA_TIPO_COMPROBANTE);
    const codigosComprobantes = [
      this._tiposService.TIPO_DOCUMENTO_PERCEPCION
    ];
    this.tiposComprobantes = this._tablaMaestraService.obtenerPorCodigosDeTablaMaestra(
      this.todosTiposComprobantes,
      codigosComprobantes
    );
  }

  filtrarSeries() {
    this.series = this._serieService.filtroSeries(
      localStorage.getItem('id_entidad'),
      this._tiposService.TIPO_DOCUMENTO_PERCEPCION, this._tiposService.TIPO_SERIE_ONLINE.toString()
    );
  }

  inicializarVariablesDataTable() {
    this.tipoAccion = ModoVistaAccion.ICONOS;
    this.columnasTabla = [
      new ColumnaDataTable('tipoComprobante', 'tipoComprobante.descripcionLarga'),
      new ColumnaDataTable('serie', 'serieComprobante'),
      new ColumnaDataTable('numeroCorrelativo', 'correlativoComprobante'),
      new ColumnaDataTable('fechaEmision', 'fechaEmisionComprobante'),
      new ColumnaDataTable('monedaOrigen', 'monedaComprobante.descripcionCorta'),
      new ColumnaDataTable('importeTotal', 'importeTotalComprobante', {'text-align': 'right'}),
      new ColumnaDataTable('importeTotalsoles', 'importeSolesComprobante', {'text-align': 'right'}),
      new ColumnaDataTable('porcentajePercepcion', 'tipoPorcentajePercepcion.descripcion_dominio'),
      new ColumnaDataTable('importePercepcionSoles', 'montoPercepcion', {'text-align': 'right'})
    ];
    this.ordenarPorElCampo = 'serieComprobante';
    this.accionesTabla = [
      new Accion('editar', new Icono('visibility', 'btn-info'), TipoAccion.EDITAR),
    ];
  }

  compararParametros(opcion, seleccion) {
    if (seleccion) {
      if (opcion) {
        return opcion.id_dominio === seleccion.id_dominio;
      } else {
        return false;
      }
    }
    return true;
  }

  ngOnInit() {
    this.inicializarVariables();
    this.initForm();
  }

  cargarPersitencia() {
    if (this._percepcionComunService.hayPersistencia()) {
      this.cargarPersistenciaCabecera();
      this.cargarPersistenciaEntidad();
      this.cargarPersistenciaDetalle();
      this._percepcionComunService.eliminarPersistenciaPercepcionAuxiliar();
    }
  }

  cargarPersistenciaCabecera() {
    const cabecera = this._percepcionComunService.percepcionAuxiliar.value.cabecera;
    if (cabecera) {
      if (cabecera.serie) {
        this.percepcionFormGroup.controls['cmbserie'].setValue(cabecera.serie);
        this._estilosService.eliminarEstiloInput('cmbserie', 'is-empty');
      }
      this.percepcionFormGroup.controls['txtobservacion'].setValue(cabecera.observacion);
      this.percepcionFormGroup.controls['datefechapago'].setValue(cabecera.fechaPago);
      this.percepcionFormGroup.controls['cmbPorcentajePercepcion'].setValue(cabecera.tipoPorcentajePercepcion);

      this._estilosService.eliminarEstiloInput('txtobservacion', 'is-empty');
      this._estilosService.eliminarEstiloInput('datefechapago', 'is-empty');
      this._estilosService.eliminarEstiloInput('cmbPorcentajePercepcion', 'is-empty');
    }
  }

  cargarPersistenciaEntidad() {
    const entidadReceptora = this._percepcionComunService.percepcionAuxiliar.value.entidadReceptora;
    if (entidadReceptora) {
      this.entidadEmisor = entidadReceptora;
      this.percepcionFormGroup.controls['txtruc'].setValue(entidadReceptora.documento);
      this.percepcionFormGroup.controls['razonsocial'].setValue(entidadReceptora.denominacion);
      this.percepcionFormGroup.controls['txtcorreo'].setValue(entidadReceptora.correoElectronico);
      this.percepcionFormGroup.controls['txtcorreo'].enable(true);
      this.percepcionFormGroup.controls['txtdireccionfiscal'].setValue(entidadReceptora.direccionFiscal);

      this._estilosService.eliminarEstiloInput('txtruc', 'is-empty');
      this._estilosService.eliminarEstiloInputAutocomplete('razonsocial', 'is-empty');
      this._estilosService.eliminarEstiloInput('txtcorreo', 'is-empty');
      this._estilosService.eliminarEstiloInput('txtdireccionfiscal', 'is-empty');
    }
  }

  cargarPersistenciaDetalle() {
    const detalles = this._percepcionComunService.percepcionAuxiliar.value.detalle;
    const nuevoItem = this._percepcionComunService.itemDetalleEditar.value;
    const tamanioDetalle = detalles.length;
    if (nuevoItem) {
      const indexItem = detalles.findIndex(item => item.id === nuevoItem.id);
      if (indexItem === -1) {
        if (nuevoItem) {
          nuevoItem.id = tamanioDetalle.toString();
          detalles.push(nuevoItem);
        }
      } else {
        detalles[indexItem] = nuevoItem;
      }
    }
    if (detalles.length > 0) {
      let totalComprobante = 0;
      for (const detalle of detalles) {
        totalComprobante += Number(detalle.montoPercepcion);
      }
      this.percepcionFormGroup.controls['txttotal'].setValue(totalComprobante.toFixed(2));
      this.tabla.insertarData(detalles);
    }
  }

  public vistaprevia() {
    this.agregarPersistencia();
    this.router.navigate(['./vista-previa'], {relativeTo: this.route});
  }

  private initForm() {
    const fecha = new Date();
    const fecha_actual = fecha.getDate().toString() + '/' + (fecha.getMonth() + 1).toString() + '/' + fecha.getFullYear().toString();
    this.percepcionFormGroup = new FormGroup({
      'cmbserie': new FormControl('', [Validators.required]),
      'txtruc': new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]{11}'),
        Validators.minLength(11),
        Validators.maxLength(11)
      ]),
      'razonsocial': new FormControl(''),
      'txtcorreo': new FormControl({value: '', disabled: true}, [Validators.required]),
      'txtdireccionfiscal': new FormControl({value: '', disabled: true}, [Validators.required]),
      'cmbPorcentajePercepcion':  new FormControl('', [
        Validators.required,
        ValidadorPersonalizado.validarSelectForm('seleccioneUnTipoDePercepcion', null)
      ]),
      'txttipomoneda': new FormControl({value: 'PEN', disabled: true}),
      'txtobservacion': new FormControl('', [Validators.maxLength(500)]),
      'datefechapago': new FormControl(fecha_actual, [
        Validators.required,
        ValidadorPersonalizado.fechaDeberiaSerMenorAHoy('errorFecha')
      ]),
      'txttotal': new FormControl({value: '0.00', disabled: true}, [
        Validators.required, Validators.min(0.01), Validators.minLength(4)
      ])
    });
  }

  autocompleListFormatter(data: any): string {
    return data['denominacion'];
  }

  listarOrganizacionesDeAutcompletado(keyword: any) {
    if (keyword) {
      if (this.entidadEmisor && this.entidadEmisor.denominacion !== keyword) {
        this.percepcionFormGroup.get('txtruc').reset();
        this.percepcionFormGroup.get('txtdireccionfiscal').reset();
        this.percepcionFormGroup.get('txtcorreo').reset();
      }
      return this._entidadServices.buscarPorRazonSocialAutocomplete(
        keyword,
        this._catalogoDocumentoEntidadService.TIPO_DOCUMENTO_IDENTIDAD_RUC
      );
    } else {
      return Observable.of([]);
    }
  }

  iniciarData(event) {
    this.cargarPersitencia();
  }

  limpiar($event) {
    this.percepcionFormGroup.reset();
  }


  busquedaruc(event) {
    if (this.percepcionFormGroup.controls['txtruc'].value.length === 11) {
      const listaEntidades = this._entidadServices.buscarPorRuc(this.percepcionFormGroup.get('txtruc').value);
      if (listaEntidades != null) {
        listaEntidades.subscribe(
          data => {
            if (data) {
              this.entidadEmisor = data;
              this.llenarDatosEmisorEnFormulario(true);
            } else {
              this.limpiarBusquedaEntidadEmisora(true);
            }
          }
        );
      }
    } else {
      this.limpiarBusquedaEntidadEmisora(true);
    }
  }

  limpiarBusquedaEntidadEmisora(vieneDeRuc: boolean) {
    this.entidadEmisor = null;
    if (vieneDeRuc) {
      this.percepcionFormGroup.controls['razonsocial'].reset();
      this._estilosService.agregarEstiloInputAutocomplete('razonsocial', 'is-empty');
    } else {
      this.percepcionFormGroup.controls['txtruc'].reset();
      this._estilosService.agregarEstiloInput('txtruc', 'is-empty');
    }

    this.percepcionFormGroup.controls['txtcorreo'].reset();
    this._estilosService.agregarEstiloInput('txtcorreo', 'is-empty');
    this.percepcionFormGroup.controls['txtdireccionfiscal'].reset();
    this._estilosService.agregarEstiloInput('txtdireccionfiscal', 'is-empty');
  }

  llenarDatosEmisorEnFormulario(vieneDeRuc: boolean) {
    if (vieneDeRuc) {
      this.percepcionFormGroup.controls['razonsocial'].setValue(this.entidadEmisor.denominacion);
      this._estilosService.eliminarEstiloInputAutocomplete('razonsocial', 'is-empty');
    } else {
      this.percepcionFormGroup.controls['txtruc'].setValue(this.entidadEmisor.documento);
      this._estilosService.eliminarEstiloInput('txtruc', 'is-empty');
    }

    this.percepcionFormGroup.controls['txtcorreo'].setValue(this.entidadEmisor.correoElectronico);
    this._estilosService.eliminarEstiloInput('txtcorreo', 'is-empty');

    this.percepcionFormGroup.controls['txtdireccionfiscal'].setValue(this.entidadEmisor.direccionFiscal);
    this._estilosService.eliminarEstiloInput('txtdireccionfiscal', 'is-empty');

    const condicion1 = this.entidadEmisor.correoElectronico === '';
    const condicion2 = this.entidadEmisor.correoElectronico === '-';
    const condicion3 = condicion1 || condicion2;
    if ( condicion3 ) {
      this.percepcionFormGroup.controls['txtcorreo'].enable();
    } else {
      this.percepcionFormGroup.controls['txtcorreo'].disable();
    }
  }

  cambioBusquedaAutocompleteEntidadEmisora () {
    if ( typeof this.percepcionFormGroup.get('razonsocial').value === 'object') {
    } else {
      this.limpiarBusquedaEntidadEmisora(false);
    }
  }

  cambioSeleccionEntidadEmisora(entidad) {
    if (entidad !== undefined) {
      this.limpiarBusquedaEntidadEmisora(false);
      this.entidadEmisor = entidad;
      this.llenarDatosEmisorEnFormulario(false);
    }
  }

  eliminar(elementos: PercepcionCrearDetalle[]) {

  }

  compararSerie(option, selected) {
    if (selected) {
      return option.idSerie === selected.idSerie;
    }
    return true;
  }
  agregarItem(agrego: boolean) {
    if (agrego) {
      if (this.percepcionFormGroup.controls['cmbPorcentajePercepcion'].value) {
        this.agregarPersistencia();
        this.router.navigate(['./agregar-item'], {relativeTo: this.route});
      } else {
        this.percepcionFormGroup.controls['cmbPorcentajePercepcion'].markAsTouched();
        this.percepcionFormGroup.controls['cmbPorcentajePercepcion'].setValue(null);
        this._estilosService.eliminarEstiloInput('cmbPorcentajePercepcion', 'is-empty');
        this.percepcionFormGroup.controls['cmbPorcentajePercepcion'].setErrors({seleccioneUnTipoDePercepcion: true});
      }
    }
  }

  agregarPersistencia() {
    const percepcionCabecera = new PercepcionCabecera();
    percepcionCabecera.tipoMoneda = this.percepcionFormGroup.controls['txttipomoneda'].value;
    const serie = this.percepcionFormGroup.controls['cmbserie'].value;
    percepcionCabecera.serie = serie === '' ? null : serie;
    percepcionCabecera.observacion = this.percepcionFormGroup.controls['txtobservacion'].value;
    percepcionCabecera.fechaPago = this.percepcionFormGroup.controls['datefechapago'].value;
    percepcionCabecera.totalComprobante = this.percepcionFormGroup.controls['txttotal'].value;
    percepcionCabecera.tipoPorcentajePercepcion = this.percepcionFormGroup.controls['cmbPorcentajePercepcion'].value;
    percepcionCabecera.porcentajePercepcion = this.verificarMontoPorcentajePercepcion(percepcionCabecera.tipoPorcentajePercepcion);

    const percepcionAuxiliar = new PercepcionCrearAuxiliar();
    if (this.entidadEmisor) {
      this.entidadEmisor.correoElectronico = this.percepcionFormGroup.controls['txtcorreo'].value;
    }
    percepcionAuxiliar.entidadReceptora = this.entidadEmisor;
    percepcionAuxiliar.cabecera = percepcionCabecera;
    percepcionAuxiliar.detalle = this.tabla.getData();
    percepcionAuxiliar.entidadEmisora = this._utilsService.cargarEntidadEmisora();

    this._percepcionComunService.percepcionAuxiliar.next(percepcionAuxiliar);

    this._percepcionComunService.setPersistenciaPercepcionAuxiliar();
  }

  verificarMontoPorcentajePercepcion(tipoPercepcion: Parametros) {
    let porcentajePercepcion = 0;
    if (tipoPercepcion) {
      switch (tipoPercepcion.id_dominio) {
        case this._tiposService.TIPO_PERCEPCION_VENTA_INTERNA_ID:
          porcentajePercepcion = this._tiposService.TIPO_PERCEPCION_VENTA_INTERNA_TASA;
          break;
        case this._tiposService.TIPO_PERCEPCION_A_LA_ADQUISICION_DE_COMBUSTIBLE_ID:
          porcentajePercepcion = this._tiposService.TIPO_PERCEPCION_A_LA_ADQUISICION_DE_COMBUSTIBLE_TASA;
          break;
        case this._tiposService.TIPO_PERCEPCION_REALIZADA_AL_AGENTE_DE_PERCEPCION_CON_TASA_ESPECIAL_ID:
          porcentajePercepcion = this._tiposService.TIPO_PERCEPCION_REALIZADA_AL_AGENTE_DE_PERCEPCION_CON_TASA_ESPECIAL_TASA;
          break;
      }
    }
    return porcentajePercepcion;
  }

  ejecutarAccion(evento: [TipoAccion, PercepcionCrearDetalle]) {
    const tipoAccion = evento[0];
    const itemDetalle = evento[1];
    this.agregarPersistencia();
    itemDetalle.tipoPorcentajePercepcion = this.percepcionFormGroup.controls['cmbPorcentajePercepcion'].value;
    itemDetalle.porcentajePercepcion = this.verificarMontoPorcentajePercepcion(
      this.percepcionFormGroup.controls['cmbPorcentajePercepcion'].value
    );
    this._percepcionComunService.itemDetalleEditar.next(itemDetalle);
    switch (tipoAccion) {
      case TipoAccion.EDITAR:
        this.router.navigate(['./editar-item/', itemDetalle.id], {relativeTo: this.route});
        break;
    }
  }

  validarDataTable() {
    return this.tabla.getData().length > 0;
  }

  cambioPorcentajePercepcion() {
    const detalles = this.tabla.getData();
    for (const detalle of detalles) {
      detalle.tipoPorcentajePercepcion = this.percepcionFormGroup.controls['cmbPorcentajePercepcion'].value;
      const nuevoMontoPercepcion = this.verificarMontoPorcentajePercepcion(detalle.tipoPorcentajePercepcion);
      detalle.porcentajePercepcion = nuevoMontoPercepcion;
      detalle.montoPercepcion = (Number(detalle.importeSolesComprobante) * nuevoMontoPercepcion / 100).toFixed(2);
    }
  }
}
