import {Component, OnInit, ViewChild} from '@angular/core';
import {ReporteDocumentoEmisorService} from '../servicios/reporte-documento-emisor.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DataTableComponent} from '../../../general/data-table/data-table.component';
import {TABLA_MAESTRA_TIPO_COMPROBANTE, TABLA_MAESTRA_TIPO_DOCUMENTO, TablaMaestra} from '../../../general/models/documento/tablaMaestra';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {TablaMaestraService} from '../../../general/services/documento/tablaMaestra.service';
import {TiposService} from '../../../general/utils/tipos.service';
import {ReporteDocumentoEmisorDetalleConsulta} from '../../../general/models/reportes/reporte-documento-emisor-detalle-consulta';
import {ReportesService} from '../../../general/services/reportes/reportes.service';
import {HttpParams} from '@angular/common/http';
import {Accion, Icono} from '../../../general/data-table/utils/accion';
import {TipoAccion} from '../../../general/data-table/utils/tipo-accion';
import {EstilosServices} from '../../../general/utils/estilos.services';
import {ModoVistaAccion} from '../../../general/data-table/utils/modo-vista-accion';
import {ArchivoService} from '../../../general/services/archivos/archivo.service';
import {ColumnaDataTable} from '../../../general/data-table/utils/columna-data-table';

@Component({
  selector: 'app-reporte-documento-emisor-detalle',
  templateUrl: './reporte-documento-emisor-detalle.component.html',
  styleUrls: ['./reporte-documento-emisor-detalle.component.css']
})
export class ReporteDocumentoEmisorDetalleComponent implements OnInit {

  @ViewChild('tablaReporteDocumentoPorEmisorDetalle') tablaReportesDetalle: DataTableComponent<ReporteDocumentoEmisorDetalleConsulta>;

  private todosTiposComprobantes: BehaviorSubject<TablaMaestra[]>;
  public tiposComprobantes: BehaviorSubject<TablaMaestra[]>;

  ordenarPorElCampo: string;
  nombreIdDelItem: string;
  columnasTabla: ColumnaDataTable[];
  parametrosBusqueda: HttpParams;
  urlReporteDocumentoEmisorDetalle: string;
  tipoMetodoReporteDocumentoEmisorDetalle: string;

  valorTipoComprobante: string;

  acciones: Accion[];
  tipoAccion: ModoVistaAccion;

  constructor(private _reporteDocumentoEmisorService: ReporteDocumentoEmisorService,
              private _reportesService: ReportesService,
              private _tablaMaestraService: TablaMaestraService,
              private _tiposService: TiposService,
              private _estiloService: EstilosServices,
              private _archivoService: ArchivoService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.inicializarVariables();
    if (this._reporteDocumentoEmisorService.reporteGeneral.value === null) {
      this.regresar();
    } else {
      this.cargarData();
    }
  }

  cargarData() {
    this.cargarTiposComprobantes();
  }

  iniciarData(evento) {
    if (this._reporteDocumentoEmisorService.reporteGeneral.value !== null) {
      this.cargarDataEnTabla();
    }
  }

  cargarDataEnTabla() {
    this.tablaReportesDetalle.setUrlServicio(this.urlReporteDocumentoEmisorDetalle);
    this.parametrosBusqueda = new HttpParams()
      .set('estados', this._reporteDocumentoEmisorService.estados.value)
      .set('fechaInicio', this._reporteDocumentoEmisorService.fechaInicio.value)
      .set('fechaFinal', this._reporteDocumentoEmisorService.fechaFinal.value)
      .set('emisor', this._reporteDocumentoEmisorService.reporteGeneral.value.emisorId.toString())
      .set('tipoDocumento', this.valorTipoComprobante)
      .set('pagina', '0')
      .set('limite', '10')
      .set('esArray', 'true');
    this.tablaReportesDetalle.setParametros(this.parametrosBusqueda);
    this.tablaReportesDetalle.cargarData();
  }
  inicializarVariables() {
    this.ordenarPorElCampo = 'serie';
    this.nombreIdDelItem = 'idComprobantePago';
    this.tipoAccion = ModoVistaAccion.ICONOS;
    this.parametrosBusqueda = new HttpParams();
    this.urlReporteDocumentoEmisorDetalle = this._reportesService.urlReportesEmisor;
    this.tipoMetodoReporteDocumentoEmisorDetalle = this._reportesService.TIPO_ATRIBUTO_REPORTES_DOCUMENTO_POR_EMISOR_DETALLE;
    this.columnasTabla = [
      new ColumnaDataTable('serie', 'serie'),
      new ColumnaDataTable('numeroCorrelativo', 'numeroCorrelativo'),
      new ColumnaDataTable('tipoDocumento', 'tipoDocumento'),
      new ColumnaDataTable('numeroDocumento', 'numeroDocumento'),
      new ColumnaDataTable('razonSocialReceptor', 'razonSocialReceptor'),
      new ColumnaDataTable('estado', 'estado')
    ];
    this.acciones = [
      new Accion('visualizar', new Icono('visibility', 'btn-info'), TipoAccion.VISUALIZAR)
    ];
  }

  cargarTiposComprobantes() {
    this.todosTiposComprobantes = this._tablaMaestraService.obtenerPorIdTabla(TABLA_MAESTRA_TIPO_COMPROBANTE);
    const codigosComprobantes = [
      this._tiposService.TIPO_DOCUMENTO_FACTURA,
      // this._tiposService.TIPO_DOCUMENTO_FACTURA_ANTICIPO,
      this._tiposService.TIPO_DOCUMENTO_BOLETA,
      // this._tiposService.TIPO_DOCUMENTO_BOLETA_ANTICIPO,
      this._tiposService.TIPO_DOCUMENTO_NOTA_CREDITO,
      this._tiposService.TIPO_DOCUMENTO_NOTA_DEBITO,
      this._tiposService.TIPO_DOCUMENTO_RETENCION,
      this._tiposService.TIPO_DOCUMENTO_PERCEPCION
    ];
    this.tiposComprobantes = this._tablaMaestraService.obtenerPorCodigosDeTablaMaestraHardCode(this.todosTiposComprobantes, codigosComprobantes);
    this.valorTipoComprobante = this._reporteDocumentoEmisorService.tipoDocumento.value;
    this._estiloService.eliminarEstiloInput('cmbTipoComprobante', 'is-empty');
  }

  regresar() {
    this.router.navigate(['../../../'], {relativeTo: this.route});
  }

  ejecutarAccion(evento) {
    const accion: TipoAccion = evento[0];
    const item: ReporteDocumentoEmisorDetalleConsulta = evento[1];
    switch (accion) {
      case TipoAccion.VISUALIZAR:
        this.visualizarComprobante(item.idComprobantePago);
        break;
    }

  }

  visualizarComprobante(idComprobante: string) {
    this._archivoService.retornarArchivoRetencionPercepcionbase(idComprobante)
      .subscribe(
        data => {
          if (data) {
            const winparams =
              'dependent = yes, locationbar = no, menubar = yes, resizable, screenX = 50, screenY = 50, width = 800, height = 800';
            const htmlPop = '<embed width=100% height=100% type="application/pdf" src="data:application/pdf;base64,' + data + '"> </embed>';
            const printWindow = window.open('', 'PDF', winparams);
            printWindow.document.write(htmlPop);
          }
        }
      );
  }

  cambioTipoComprobante() {
    this.cargarDataEnTabla();
  }

}
