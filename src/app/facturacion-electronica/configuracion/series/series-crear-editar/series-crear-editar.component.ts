import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ConfiguracionEmpresaService} from '../../servicios/configuracion-empresa.service';
import {EstilosServices} from '../../../general/utils/estilos.services';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subscription} from 'rxjs/Subscription';
import {SeriesQuery} from '../../models/series-query';
import {SeriesCrear} from '../../models/series-crear';
import {SeriesService} from '../../../general/services/configuracionDocumento/series.service';

@Component({
  selector: 'app-series-crear-editar',
  templateUrl: './series-crear-editar.component.html',
  styleUrls: ['./series-crear-editar.component.css']
})
export class SeriesCrearEditarComponent implements OnInit, OnDestroy {

  public seriesFormGroup: FormGroup;
  @Input() idModal: string;
  @ViewChild('modalEditar') modalEditar: ElementRef;

  nombreBotonGuardar: BehaviorSubject<string>;
  serieEditarSubscription: Subscription;
  editar: BehaviorSubject<boolean>;
  serieEditar: SeriesQuery;

  constructor(private _configuracionEmpresaService: ConfiguracionEmpresaService,
              private _seriesService: SeriesService,
              private _estilosService: EstilosServices) { }

  ngOnInit() {
    this.editar = new BehaviorSubject(false);
    this.nombreBotonGuardar = new BehaviorSubject('agregarItem');
    this.iniciarFormGroup();
    this.escucharEventos();
    this.serieEditar = null;
    this.serieEditarSubscription = this._configuracionEmpresaService.serieEditar.subscribe(
      serie => {
        this.limpiarFormGroup();
        if (serie) {
          this.serieEditar = serie;
          this.nombreBotonGuardar.next('editar');
          this.editar.next(true);
          this.cargarDatosEnFormGroup();
        } else {
          this.nombreBotonGuardar.next('agregarItem');
          this.editar.next(false);
          this.seriesFormGroup.enable(true);
        }
      }
    );
  }

  escucharEventos() {
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
      this.seriesFormGroup.controls['txtDireccionMac'].setValidators([Validators.required]);
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
  }

  iniciarFormGroup() {
    this.seriesFormGroup = new FormGroup({
      txtNombreSerie: new FormControl('', Validators.required),
      txtNombreSucursal: new FormControl('', Validators.required),
      txtDireccionMac: new FormControl('', Validators.required),
      txtCorrelativoInicial: new FormControl('', Validators.required),
      checkBoxTipoSerie: new FormControl(false)
    });
  }

  abrirModal() {
    $('#' + this.idModal).modal('show');
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
      this.seriesFormGroup.enable(true);
    } else {
      if (this.serieEditar) {
        this._seriesService.actualizarSerie(this.cargarDatosModificarSerie());
      } else {
        this._seriesService.crearSerie(this.cargarDatosCrearSerie());
      }
    }
  }

  cargarDatosCrearSerie() {
    const serie = new SeriesCrear();
    serie.idEntidad = Number(localStorage.getItem('id_entidad'));
    serie.correlativo = this.seriesFormGroup.controls['txtCorrelativoInicial'].value;
    serie.direccion = this.seriesFormGroup.controls['txtNombreSucursal'].value;
    serie.direccionMac = this.seriesFormGroup.controls['txtDireccionMac'].value;
    serie.idTipoDocumento = this._configuracionEmpresaService.tipoSerie.value;
    serie.serie = this.seriesFormGroup.controls['txtNombreSerie'].value;
    serie.tipoSerie = this.seriesFormGroup.controls['checkBoxTipoSerie'].value;
    return serie;
  }

  cargarDatosModificarSerie() {
    const serie = new SeriesQuery();
    serie.idEntidad = Number(localStorage.getItem('id_entidad'));
    serie.correlativo = this.seriesFormGroup.controls['txtCorrelativoInicial'].value;
    serie.direccion = this.seriesFormGroup.controls['txtNombreSucursal'].value;
    serie.direccionMac = this.seriesFormGroup.controls['txtDireccionMac'].value;
    serie.idTipoDocumento = this._configuracionEmpresaService.tipoSerie.value;
    serie.serie = this.seriesFormGroup.controls['txtNombreSerie'].value;
    serie.tipoSerie = this.seriesFormGroup.controls['checkBoxTipoSerie'].value;
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
