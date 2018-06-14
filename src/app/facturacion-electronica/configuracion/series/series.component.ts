import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ModoVistaAccion} from '../../general/data-table/utils/modo-vista-accion';
import {Accion, Icono} from '../../general/data-table/utils/accion';
import {TipoAccion} from '../../general/data-table/utils/tipo-accion';
import {DataTableComponent} from '../../general/data-table/data-table.component';
import {ColumnaDataTable} from '../../general/data-table/utils/columna-data-table';
import {ConfiguracionEmpresaService} from '../servicios/configuracion-empresa.service';
import {SeriesCrearEditarComponent} from './series-crear-editar/series-crear-editar.component';

import {HttpParams} from '@angular/common/http';
import {SeriesService} from '../../general/services/configuracionDocumento/series.service';
import {SeriesQuery} from '../models/series-query';
import {TiposService} from '../../general/utils/tipos.service';
import {ProductoQry} from '../../general/models/productos/producto';
import {Subscription} from 'rxjs/Subscription';
import {TranslateService} from '@ngx-translate/core';

declare var swal;
@Component({
  selector: 'app-empresa-emisora',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.css']
})
export class SeriesComponent implements OnInit, OnDestroy {
  titulo: string;
  nombreComprobante: string;
  public tituloModal: string;
  public columnasTabla: ColumnaDataTable[];
  public tipoAccion: any;
  public tipoSerie: string;
  public idAccionModal: string;
  public accionesTabla: Accion[];
  parametrosSeries: HttpParams;
  public nombreIdDelItem: string;
  private actualizarTablaSubscription: Subscription;
  private eliminarSeriesSubscription: Subscription;

  @ViewChild('tablaSeries') tablaSeries: DataTableComponent<SeriesQuery>;
  @ViewChild('editarItemComponent') editarItemComponent: SeriesCrearEditarComponent;

  constructor( private router: Router,
               private route: ActivatedRoute,
               public _seriesService: SeriesService,
               private _tiposService: TiposService,
               private _translateService: TranslateService,
               private _configuracionEmpresaService: ConfiguracionEmpresaService
  ) {
    this.inicializarVariables();
  }
  inicializarVariables() {
    this.titulo = 'seriesDe';
    this.inicializarVariablesTabla();
  }

  ngOnDestroy() {
    if (this.actualizarTablaSubscription) {
      this.actualizarTablaSubscription.unsubscribe();
    }
    if (this.eliminarSeriesSubscription) {
      this.eliminarSeriesSubscription.unsubscribe();
    }
  }

  inicializarVariablesTabla() {
    this.nombreIdDelItem = 'idSerie';
    this.tipoAccion = ModoVistaAccion.ICONOS;
    this.route
      .params
      .subscribe(params => {
        this.tipoSerie = params['id'] ;
        this.verificarTitulo();
        this._configuracionEmpresaService.tipoSerie.next(this.tipoSerie);
      });
    this.parametrosSeries = new HttpParams()
      .set('id_entidad', localStorage.getItem('id_entidad'))
      .set('tipo_documento', this.tipoSerie)
      .set('estado', '1');
    this.accionesTabla  = [
      new Accion('editar', new Icono('edit', 'btn-success'), TipoAccion.EDITAR)
    ];
    this.columnasTabla = [
      new ColumnaDataTable('serie', 'serie'),
      new ColumnaDataTable('sucursal', 'direccion'),
      new ColumnaDataTable('MAC', 'direccionMac'),
      new ColumnaDataTable('numeroCorrelativo', 'correlativo'),
      new ColumnaDataTable('numeroSecuencialAutomatico', 'tipoSerie')
    ];
  }

  verificarTitulo() {
    switch (this.tipoSerie) {
      case this._tiposService.TIPO_DOCUMENTO_FACTURA:
        this.nombreComprobante = this._tiposService.TIPO_DOCUMENTO_FACTURA_NOMBRE;
        break;
      case this._tiposService.TIPO_DOCUMENTO_BOLETA:
        this.nombreComprobante = this._tiposService.TIPO_DOCUMENTO_BOLETA_NOMBRE;
        break;
      case this._tiposService.TIPO_DOCUMENTO_NOTA_CREDITO:
        this.nombreComprobante = this._tiposService.TIPO_DOCUMENTO_NOTA_CREDITO_NOMBRE;
        break;
      case this._tiposService.TIPO_DOCUMENTO_NOTA_DEBITO:
        this.nombreComprobante = this._tiposService.TIPO_DOCUMENTO_NOTA_DEBITO_NOMBRE;
        break;
      case this._tiposService.TIPO_DOCUMENTO_RETENCION:
        this.nombreComprobante = this._tiposService.TIPO_DOCUMENTO_RETENCION_NOMBRE;
        break;
      case this._tiposService.TIPO_DOCUMENTO_PERCEPCION:
        this.nombreComprobante = this._tiposService.TIPO_DOCUMENTO_PERCEPCION_NOMBRE;
        break;
      case this._tiposService.TIPO_DOCUMENTO_COMUNICACION_BAJA_RETENCIONES_PERCEPCIONES:
        this.nombreComprobante = 'Resumen Bajas Percepción/Retención';
        break;
      case this._tiposService.TIPO_DOCUMENTO_RESUMEN_BOLETAS:
        this.nombreComprobante = 'Resumen Diario Boletas';
        break;
      case this._tiposService.TIPO_DOCUMENTO_COMUNICACION_BAJA_FACTURA_BOLETA_NOTAS:
        this.nombreComprobante = 'Resumen Bajas Boletas/Facturas/Notas';
        break;
    }
  }

  ngOnInit() {
  }

  actualizarTabla() {
    const that = this;
    this.actualizarTablaSubscription = this._configuracionEmpresaService.actualizarTabla.subscribe(
      data => {
        if (data) {
          setTimeout(
            () => {
              that.tablaSeries.cargarData();
            }, 1000
          );
        }
      }
    );
  }

  iniciarDataTabla(evento) {
    if (evento) {
      this.actualizarTabla();
    }
  }

  regresar() {
    this.router.navigateByUrl('configuracion/empresa-emisora');
  }

  agregarSerie() {
    this.tituloModal = "Agregar Serie";
    this.idAccionModal = 'A';
    this._configuracionEmpresaService.serieEditar.next(null);
    this.editarItemComponent.abrirModal();
  }

  ejecutarAccion(event: [TipoAccion, SeriesQuery]) {
    const accion = event[0];
    const serie = event[1];
    switch (accion) {
      case TipoAccion.EDITAR:
        this._configuracionEmpresaService.serieEditar.next(serie);
        this.abrirEditarModal();
        break;
    }
  }

  eliminarSeries(series: SeriesQuery[]) {
    const that = this;
    let siText = '';
    this._translateService.get('si').take(1).subscribe(nombre => siText = nombre);
    let noText = '';
    this._translateService.get('no').take(1).subscribe(nombre => noText = nombre);
    let deseaEliminarLosItemsSeleccionados = '';
    this._translateService.get('deseaEliminarLosItemsSeleccionados').take(1).subscribe(nombre => deseaEliminarLosItemsSeleccionados = nombre);
    swal({
      title: deseaEliminarLosItemsSeleccionados,
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
        that._seriesService.eliminarSeries(series).subscribe(
          data => {
            if (data) {
              setTimeout(
                () => {
                  that.tablaSeries.cargarData();
                }, 1200
              );
            }
          }
        );
      }, (dismiss) => {
      });
  }

  abrirEditarModal() {
    this.tituloModal = 'Editar Serie';
    this.idAccionModal = 'E';
    this.editarItemComponent.abrirModal();
  }
}
