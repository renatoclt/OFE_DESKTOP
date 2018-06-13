import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ConfiguracionEmpresaService} from '../../servicios/configuracion-empresa.service';
import {EstilosServices} from '../../../general/utils/estilos.services';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subscription} from 'rxjs/Subscription';
import {SeriesQuery} from '../../models/series-query';
import {SeriesCrear} from '../../models/series-crear';
import {SeriesService} from '../../../general/services/configuracionDocumento/series.service';
import {TiposService} from '../../../general/utils/tipos.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-series-crear-editar',
  templateUrl: './series-crear-editar.component.html',
  styleUrls: ['./series-crear-editar.component.css']
})
export class SeriesCrearEditarComponent implements OnInit, OnDestroy {

  public seriesFormGroup: FormGroup;
  @Input() idModal: string;
  @Input() tituloModal: string;
  @Input() idAccionModal: string;
  @ViewChild('modalEditar') modalEditar: ElementRef;

  nombreBotonGuardar: BehaviorSubject<string>;
  serieEditarSubscription: Subscription;
  editar: BehaviorSubject<boolean>;
  serieEditar: SeriesQuery;
  esComprobanteRestringido: boolean;

  constructor(private _configuracionEmpresaService: ConfiguracionEmpresaService,
              private _seriesService: SeriesService,
              private _tiposService: TiposService,
              private route: ActivatedRoute,
              private _estilosService: EstilosServices) { }

  ngOnInit() {
    this.editar = new BehaviorSubject(false);
    this.nombreBotonGuardar = new BehaviorSubject('agregarItem');
    // this.iniciarFormGroup();
    // this.escucharEventos();
    this.serieEditar = null;
    this.route
      .params
      .subscribe(params => {
        this.verificarComprobantes(params['id']);
      });
    this.serieEditarSubscription = this._configuracionEmpresaService.serieEditar.subscribe(
      serie => {
        // this.limpiarFormGroup();
        if (serie) {
          this.serieEditar = serie;
          this.nombreBotonGuardar.next('editar');
          this.editar.next(true);
          this.cargarDatosEnFormGroup();
        } else {
          this.limpiarFormGroup();
          this.seriesFormGroup.controls['checkBoxTipoSerie'].setValue(true);
          this.nombreBotonGuardar.next('agregarItem');
          this.editar.next(false);
          if (!this.esComprobanteRestringido) {
            this.seriesFormGroup.enable(true);
          }
        }
      }
    );
  }

  verificarComprobantes(tipoDocumento: string) {
    console.log(tipoDocumento);
    const seriesConRestricciones = [
      this._tiposService.TIPO_DOCUMENTO_COMUNICACION_BAJA_RETENCIONES_PERCEPCIONES,
      this._tiposService.TIPO_DOCUMENTO_RESUMEN_BOLETAS,
      this._tiposService.TIPO_DOCUMENTO_COMUNICACION_BAJA_FACTURA_BOLETA_NOTAS
    ];
    this.esComprobanteRestringido = seriesConRestricciones.findIndex(item => item === tipoDocumento) !== -1;
    if (this.esComprobanteRestringido) {
      console.log('entro');
      this.iniciarFormGroup(true);
    } else {
      this.iniciarFormGroup();
      this.escucharEventos();
    }
  }

  escucharEventos() {
    console.log('ENTRO VALIDACION TIPO SERIE')
    this.seriesFormGroup.controls['checkBoxTipoSerie'].valueChanges.subscribe(
      valor => {
        this.verificarTipoSerie();
      }
    );
  }

  verificarTipoSerie() {
    this.seriesFormGroup.controls['txtDireccionMac'].reset();
    this._estilosService.agregarEstiloInput('txtDireccionMac', 'is-empty');
    if (this.seriesFormGroup.controls['checkBoxTipoSerie'].value) {
      this.seriesFormGroup.controls['txtDireccionMac'].setValidators([]);
      if (!this.editar.value) {
        this.seriesFormGroup.controls['txtDireccionMac'].disable(true);
      }
    } else {
      // this.seriesFormGroup.controls['txtDireccionMac'].setValidators([Validators.required]);
      if (!this.editar.value) {
        this.seriesFormGroup.controls['txtDireccionMac'].enable(true);
        this.seriesFormGroup.controls['txtDireccionMac'].markAsTouched();
      }
    }
  }

  ngOnDestroy() {
    if (this.serieEditarSubscription) {
      this.serieEditarSubscription.unsubscribe();
    }
    this.limpiarFormGroup();
  }

  iniciarFormGroup(esComprobanteRestringido: boolean = false) {
    console.log('tipo ', esComprobanteRestringido);
    this.seriesFormGroup = new FormGroup({
      txtNombreSerie: new FormControl({value: '', disabled: false}, [Validators.required]),
      txtNombreSucursal: new FormControl({value: '', disabled: this.esComprobanteRestringido}, this.esComprobanteRestringido ? [] : [Validators.required]),
      // txtDireccionMac: new FormControl({value: '', disabled: this.esComprobanteRestringido}, this.esComprobanteRestringido ? [] : [Validators.required]),
      txtDireccionMac: new FormControl({value: '', disabled: this.esComprobanteRestringido}),
      txtCorrelativoInicial: new FormControl({value: this.esComprobanteRestringido ? '1' : '', disabled: this.esComprobanteRestringido}, this.esComprobanteRestringido ? [] : [Validators.required]),
      checkBoxTipoSerie: new FormControl({value: false, disabled: this.esComprobanteRestringido})
    });
  }

  abrirModal() {
    $('#' + this.idModal).modal('show');
  }

  cerrarModal() {
    $('#' + this.idModal).modal('hide');
  }

  limpiarFormGroup() {
    this.seriesFormGroup.reset();
    this._estilosService.agregarEstiloInput('txtNombreSerie', 'is-empty');
    this._estilosService.agregarEstiloInput('txtNombreSucursal', 'is-empty');
    this._estilosService.agregarEstiloInput('txtDireccionMac', 'is-empty');
    this._estilosService.agregarEstiloInput('txtCorrelativoInicial', 'is-empty');
  }

  cargarDatosEnFormGroup() {
    this.seriesFormGroup.controls['txtNombreSerie'].setValue(this.serieEditar.serie);
    this.seriesFormGroup.controls['txtNombreSucursal'].setValue(this.serieEditar.direccion);
    this.seriesFormGroup.controls['txtDireccionMac'].setValue(this.serieEditar.direccionMac);
    this.seriesFormGroup.controls['txtCorrelativoInicial'].setValue(this.serieEditar.correlativo);
    this.seriesFormGroup.controls['checkBoxTipoSerie'].setValue(this.serieEditar.tipoSerie);

    this._estilosService.eliminarEstiloInput('txtNombreSerie', 'is-empty');
    this._estilosService.eliminarEstiloInput('txtNombreSucursal', 'is-empty');
    this._estilosService.eliminarEstiloInput('txtDireccionMac', 'is-empty');
    this._estilosService.eliminarEstiloInput('txtCorrelativoInicial', 'is-empty');

    if (this.serieEditar.tipoSerie) {
      this._estilosService.agregarEstiloInput('txtDireccionMac', 'is-empty');
    }
    this.seriesFormGroup.disable(true);
  }

  guardarItem() {
    if (this.editar.value) {
      this.editar.next(false);
      this.nombreBotonGuardar.next('guardar');
      if (this.esComprobanteRestringido) {
        this.seriesFormGroup.controls['txtNombreSerie'].enable(true);
      } else {
        this.seriesFormGroup.controls['txtNombreSucursal'].enable(true);
        // this.seriesFormGroup.controls['txtNombreSucursal'].enable(true);
        // this.seriesFormGroup.enable(true);
      }
      if (this.serieEditar.tipoSerie == 0) {
        this.seriesFormGroup.controls['checkBoxTipoSerie'].enable();
      }
    } else {
      if (this.serieEditar) {
        this._seriesService.actualizarSerie(this.cargarDatosModificarSerie()).subscribe(
          data => {
            if (data) {
              this._configuracionEmpresaService.actualizarTabla.next(true);
              this.cerrarModal();
            } else {
              this._configuracionEmpresaService.actualizarTabla.next(false);
            }
          },
          error => {
            this._configuracionEmpresaService.actualizarTabla.next(false);
          }
        );
      } else {
        this._seriesService.crearSerie(this.cargarDatosCrearSerie()).subscribe(
          data => {
            if (data) {
              this._configuracionEmpresaService.actualizarTabla.next(true);
              this.cerrarModal();
            } else {
              this._configuracionEmpresaService.actualizarTabla.next(false);
            }
          },
          error => {
            this._configuracionEmpresaService.actualizarTabla.next(false);
          }
        );
      }
    }
  }

  cargarDatosCrearSerie() {
    const serie = new SeriesCrear();
    serie.idEntidad = Number(localStorage.getItem('id_entidad'));
    serie.correlativo = this.seriesFormGroup.controls['txtCorrelativoInicial'].value;
    serie.direccion = this.seriesFormGroup.controls['txtNombreSucursal'].value;
    serie.direccionMac = this.seriesFormGroup.controls['txtDireccionMac'].value ? this.seriesFormGroup.controls['txtDireccionMac'].value : '';
    serie.idTipoDocumento = this._configuracionEmpresaService.tipoSerie.value;
    serie.serie = this.seriesFormGroup.controls['txtNombreSerie'].value;
    serie.tipoSerie = this.seriesFormGroup.controls['checkBoxTipoSerie'].value ? 1 : 0;
    return serie;
  }

  cargarDatosModificarSerie() {
    const serie = new SeriesQuery();
    serie.idEntidad = Number(localStorage.getItem('id_entidad'));
    serie.idSerie = this.serieEditar.idSerie;
    serie.estado = this.serieEditar.estado;
    serie.correlativo = this.seriesFormGroup.controls['txtCorrelativoInicial'].value;
    serie.direccion = this.seriesFormGroup.controls['txtNombreSucursal'].value;
    serie.direccionMac = this.seriesFormGroup.controls['txtDireccionMac'].value ? this.seriesFormGroup.controls['txtDireccionMac'].value : '';
    serie.idTipoDocumento = this._configuracionEmpresaService.tipoSerie.value;
    serie.serie = this.seriesFormGroup.controls['txtNombreSerie'].value;
    serie.tipoSerie = this.seriesFormGroup.controls['checkBoxTipoSerie'].value ? 1 : 0;
    return serie;
  }

  regresar() {
    $('#' + this.idModal).modal('close');
  }

  habilitarFormGroup() {
    if (this.editar.value) {
      return true;
    }
    return this.seriesFormGroup.valid;
  }

}
