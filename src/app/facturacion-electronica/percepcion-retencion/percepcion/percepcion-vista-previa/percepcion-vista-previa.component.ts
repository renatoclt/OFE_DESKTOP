import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PadreRetencionPercepcionService} from '../../services/padre-retencion-percepcion.service';
import {PercepcionComunService} from '../servicios/percepcion-comun.service';
import {DataTableComponent} from '../../../general/data-table/data-table.component';
import {PercepcionCrearDetalle} from '../modelos/percepcion-crear-detalle';
import {PercepcionCrearAuxiliar} from '../modelos/percepcion-crear-auxiliar';
import {UtilsService} from '../../../general/utils/utils.service';
import {CreacionComprobantes} from '../../../general/services/comprobantes/creacionComprobantes';
import {PercepcionCrear} from '../modelos/percepcion-crear';
import {ColumnaDataTable} from '../../../general/data-table/utils/columna-data-table';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-percepcion-vista-previa',
  templateUrl: './percepcion-vista-previa.component.html',
  styleUrls: ['./percepcion-vista-previa.component.css']
})
export class PercepcionVistaPreviaComponent implements OnInit, OnDestroy {

  public columnasTabla: ColumnaDataTable[];
  public ordenarPorElCampo: string;

  public formatoFechaEmision: string;
  public tituloComprobante: string;
  public totalEnPalabras: string;

  public percepcionAuxiliar: PercepcionCrearAuxiliar;

  eliminarPersistencia: BehaviorSubject<boolean>;

  @ViewChild('tablaNormal') tabla: DataTableComponent<PercepcionCrearDetalle>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _utilsService: UtilsService,
    private _creacionComprobantes: CreacionComprobantes,
    private _percepcionComunService: PercepcionComunService,
    private _padreRetencionPerpcionService: PadreRetencionPercepcionService) {
    this._padreRetencionPerpcionService.actualizarComprobante(this.route.snapshot.data['codigo'],
      this.route.snapshot.data['mostrarCombo'], true);
  }

  ngOnInit() {
    this.inicializarVariables();
    this.cargarPersistencia();
  }

  ngOnDestroy() {
    if (this.eliminarPersistencia.value) {
      this._percepcionComunService.eliminarPersistenciaPercepcionAuxiliar();
    }
  }

  cargarPersistencia() {
    this.percepcionAuxiliar = this._percepcionComunService.percepcionAuxiliar.value;
    this.formatoFechaEmision = '';
    if (this.percepcionAuxiliar) {
      this.formatoFechaEmision = this._utilsService.convertirFechaAFormato(this.percepcionAuxiliar.cabecera.fechaPago);
      this.totalEnPalabras =
        this._utilsService.convertirMontoEnLetras(
          this.percepcionAuxiliar.cabecera.totalComprobante,
          this.percepcionAuxiliar.cabecera.tipoMoneda
        );
    } else {
      this.regresar();
    }
  }

  cargarDataTablePersistencia() {
    this.tabla.insertarData(this.percepcionAuxiliar.detalle);
  }

  inicializarVariables() {
    this.tituloComprobante = 'percepcionElectronica';
    this.eliminarPersistencia = new BehaviorSubject(true);
    this.inicializarVariablesDataTable();
  }

  inicializarVariablesDataTable() {
    this.columnasTabla = [
      new ColumnaDataTable('tipoComprobante', 'tipoComprobante.descripcionLarga'),
      new ColumnaDataTable('serie', 'serieComprobante'),
      new ColumnaDataTable('numeroCorrelativo', 'correlativoComprobante'),
      new ColumnaDataTable('fechaEmision', 'fechaEmisionComprobante'),
      new ColumnaDataTable('monedaOrigen', 'monedaComprobante.descripcionLarga'),
      new ColumnaDataTable('importeTotal', 'importeTotalComprobante', {'text-align': 'right'}),
      new ColumnaDataTable('importeTotalsoles', 'importeSolesComprobante', {'text-align': 'right'}),
      new ColumnaDataTable('porcentajePercepcion', 'tipoPorcentajePercepcion.descripcion_dominio'),
      new ColumnaDataTable('importePercepcionSoles', 'montoPercepcion', {'text-align': 'right'})
    ];
    this.ordenarPorElCampo = 'serieComprobante';
  }


  regresar() {
    this.eliminarPersistencia.next(false);
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  emitir() {
    this._percepcionComunService.fillPercepcionAEmitir();
    this._creacionComprobantes.crearPercepcion(this._percepcionComunService.percepcion.value).subscribe(
      data => {
        if (data !== null) {
          this._percepcionComunService.percepcion.next(new PercepcionCrear());
          this._percepcionComunService.eliminarPersistenciaPercepcionAuxiliar();
          this.router.navigate(['../../emision', data['id']], { relativeTo: this.route});
        }
      }
    );

  }


  iniciarDataTable(event) {
    this.cargarDataTablePersistencia();
  }

}
