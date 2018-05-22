import {Component, OnInit, ViewChild} from '@angular/core';
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

@Component({
  selector: 'app-empresa-emisora',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.css']
})
export class SeriesComponent implements OnInit {
  titulo: string;
  public columnasTabla: ColumnaDataTable[];
  public tipoAccion: any;
  public tipoSerie: string;
  public accionesTabla: Accion[];
  parametrosSeries: HttpParams;
  public nombreIdDelItem: string;

  @ViewChild('tablaSeries') tablaSeries: DataTableComponent<SeriesQuery>;
  @ViewChild('editarItemComponent') editarItemComponent: SeriesCrearEditarComponent;

  constructor( private router: Router,
               private route: ActivatedRoute,
               public _seriesService: SeriesService,
               private _configuracionEmpresaService: ConfiguracionEmpresaService
  ) {
    this.inicializarVariables();
  }
  inicializarVariables() {
    this.titulo = 'series';
    this.inicializarVariablesTabla();
  }

  inicializarVariablesTabla() {
    this.nombreIdDelItem = 'idSerie';
    this.tipoAccion = ModoVistaAccion.ICONOS;
    this.route
      .params
      .subscribe(params => {
        this.tipoSerie = params['id'] ;
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

  ngOnInit() {
  }

  iniciarDataTabla() {

  }

  regresar() {
    this.router.navigateByUrl('configuracion/empresa-emisora');
  }

  agregarSerie() {
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

  abrirEditarModal() {
    this.editarItemComponent.abrirModal();
  }
}
