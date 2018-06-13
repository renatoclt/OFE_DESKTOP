import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EstadoDocumentoService} from '../../general/services/documento/estadoDocumento.service';
import {Subscription} from 'rxjs/Subscription';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {EstadoDocumento} from '../../general/models/documento/estadoDocumento';
import {TranslateService} from '@ngx-translate/core';
import {EntidadService} from '../../general/services/organizacion/entidad.service';
import {Observable} from 'rxjs/Observable';
import {CatalogoDocumentoIdentidadService} from '../../general/utils/catalogo-documento-identidad.service';
import {EstilosServices} from '../../general/utils/estilos.services';
import {HttpParams} from '@angular/common/http';
import {DataTableComponent} from '../../general/data-table/data-table.component';
import {ReportesService} from '../../general/services/reportes/reportes.service';
import {TiposService} from '../../general/utils/tipos.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ReporteDocumentoEmisorService} from './servicios/reporte-documento-emisor.service';
import {ReporteDocumentoEmisorConsulta} from '../../general/models/reportes/reporteDocumentoEmisorConsulta';
import {ValidadorPersonalizado} from '../../general/services/utils/validadorPersonalizado';
import {ColumnaDataTable} from '../../general/data-table/utils/columna-data-table';

@Component({
  selector: 'app-reporte-documento-emisor',
  templateUrl: './reporte-documento-emisor.component.html',
  styleUrls: ['./reporte-documento-emisor.component.css']
})
export class ReporteDocumentoEmisorComponent implements OnInit, OnDestroy {

  titulo: string;

  columnasTabla: ColumnaDataTable[];

  ordenarPorElCampo: string;
  nombreIdDelItem: string;

  dropDownConfiguracion: {};

  estados: BehaviorSubject<EstadoDocumento[]>;
  estadosSubscription: Subscription;

  reportesFormGroup: FormGroup;

  parametrosBusqueda: HttpParams;

  tipoMetodoReporteDocumentoEmisor: string;
  urlReporteDocumentoEmisor: string;

  escogioUnaEmpresa: boolean;
  atributosConEvento: string[];

  @ViewChild('tablaReporteDocumentoPorEmisor') tablaReportes: DataTableComponent<ReporteDocumentoEmisorConsulta>;

  constructor(private _estadoService: EstadoDocumentoService,
              private _tiposService: TiposService,
              private _entidadService: EntidadService,
              private _estilosService: EstilosServices,
              private _catalogoDocumentoIdentidadService: CatalogoDocumentoIdentidadService,
              public _reportesService: ReportesService,
              private _translateService: TranslateService,
              private _reporteDocumentoEmisorService: ReporteDocumentoEmisorService,
              private route: ActivatedRoute,
              private router: Router) {
    this.inicializarVariables();
    this.iniciarFormGroup();
    this.cargarEstados();
  }

  cargarEstados() {
    this.estados = this._estadoService.obtenerEstadosComprobantes();
    this.estadosSubscription = this.estados.map(
      estado => {
        estado.map(item => {
          item['itemName'] = item.descripcion;
          item['id'] = item.idEstadoComprobante;
        });
      }
    ).subscribe();
  }

  iniciarFormGroup() {
    const fecha = new Date();
    const fechaActual = fecha.getDate().toString() + '/' + (fecha.getMonth() + 1).toString() + '/' + fecha.getFullYear().toString();
    this.reportesFormGroup = new FormGroup({
      'txtEmpresa': new FormControl({value: '', disabled: false}, []),
      'txtFechaReporteDel': new FormControl({value: fechaActual, disabled: false}, [Validators.required]),
      'txtFechaReporteAl': new FormControl({value: fechaActual, disabled: false}, [Validators.required]),
      'cmbEstados': new FormControl({value: '', disabled: false}, [Validators.required]),
    }, ValidadorPersonalizado.fechaDeberiaSerMenor('txtFechaReporteDel', 'txtFechaReporteAl', 'errorFecha'));
    this.parametrosBusqueda = new HttpParams()
      .set('estados', '')
      .set('id', '')
      .set('fechaInicio', this.convertirFecha(this.reportesFormGroup.controls['txtFechaReporteDel'].value).toString())
      .set('fechaFinal', this.convertirFecha(this.reportesFormGroup.controls['txtFechaReporteAl'].value).toString())
      .set('pagina', '0')
      .set('limite', '10');
  }

  inicializarVariables() {
    this.escogioUnaEmpresa = false;
    this.urlReporteDocumentoEmisor = this._reportesService.urlReportes;
    this.tipoMetodoReporteDocumentoEmisor = this._reportesService.TIPO_ATRIBUTO_REPORTES_DOCUMENTO_POR_EMISOR;
    this.titulo = 'documentoPorEmisorReportes';
    this.columnasTabla = [
      new ColumnaDataTable('emisor', 'emisorNom'),
      new ColumnaDataTable('facturas', 'facturas'),
      new ColumnaDataTable('facturasAnticipo', 'facturasAnticipo'),
      new ColumnaDataTable('boletas', 'boletas'),
      new ColumnaDataTable('boletasAnticipo', 'boletasAnticipo'),
      new ColumnaDataTable('notaCredito', 'notaCredito'),
      new ColumnaDataTable('notaDebito', 'notaDebito'),
      new ColumnaDataTable('retencion', 'retencion'),
      new ColumnaDataTable('percepcion', 'percepcion'),
      new ColumnaDataTable('total', 'todos')
    ];
    this.atributosConEvento = ['facturas', 'facturasAnticipo', 'boletas', 'boletasAnticipo',
      'notaCredito', 'notaDebito', 'retencion', 'percepcion'];
    this.ordenarPorElCampo = 'emisorNom';
    this.nombreIdDelItem = 'id';
    this.parametrosBusqueda = new HttpParams();
    let estadosText = '';
    this._translateService.get('estados').take(1).subscribe(data => estadosText = data);
    let seleccionarTodos = '';
    this._translateService.get('seleccionarTodos').take(1).subscribe(data => seleccionarTodos = data);
    let deseleccionaTodos = '';
    this._translateService.get('deseleccionaTodos').take(1).subscribe(data => deseleccionaTodos = data);
    this.dropDownConfiguracion = {
      disabled: false,
      classes: 'drop-down-personalizado',
      text: '',
      selectAllText: seleccionarTodos,
      unSelectAllText: deseleccionaTodos,
      enableSearchFilter: false,
      showCheckbox: true
    };
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.estadosSubscription.unsubscribe();
  }

  listarProductosDeAutcompletado(keyword: any) {
    if (keyword) {
      return this._entidadService.buscarRazonSocialAutoCompletado(keyword,
          this._catalogoDocumentoIdentidadService.TIPO_DOCUMENTO_IDENTIDAD_RUC, '0', '6');
    } else {
      return Observable.of([]);
    }
  }

  public formatoDeListaAutocompletado(data: any): string {
    return data['denominacion'];
  }

  public formatoDeValorAutocompletado(data: any): string {
    return data['denominacion'];
  }

  public cambioLaBusquedaDeAutocompleteDeLaEmpresa() {
    if ( typeof this.reportesFormGroup.get('txtEmpresa').value === 'object') {
      this.escogioUnaEmpresa = true;
    } else {
      this.escogioUnaEmpresa = false;
    }
  }

  public cambioLaSeleccionDeLaEmpresa(empresa) {
    if (empresa !== undefined) {
      this.escogioUnaEmpresa = true;
      this._estilosService.eliminarEstiloInput( 'txtEmpresa', 'is-empty');
    }
  }

  public convertirFecha(fechaString: string) {
    const fechaParseada = fechaString.split('/');
    const dia = fechaParseada[0];
    const mes = fechaParseada[1];
    const anio = fechaParseada[2];
    return anio + '-' + mes + '-' + dia;
  }

  public buscar() {
    let estadosABuscar = '';
    const tamanio = this.reportesFormGroup.controls['cmbEstados'].value.length;
    let i = 0;
    for (const estadosSeleccionados of this.reportesFormGroup.controls['cmbEstados'].value) {
      estadosABuscar += estadosSeleccionados.idEstadoComprobante.toString();
      if (++i < tamanio) {
        estadosABuscar += ',';
      }
    }

    let idEmpresa = '';
    if (this.escogioUnaEmpresa) {
      console.log('escogio empresa');
      idEmpresa = this.reportesFormGroup.controls['txtEmpresa'].value.id;
    } else {
      console.log('no escogio empresa');
      idEmpresa = '';
    }
    this.tablaReportes.setUrlServicio(this._reportesService.urlReportes);
    this._reporteDocumentoEmisorService.estados.next(estadosABuscar);
    this.parametrosBusqueda = new HttpParams()
      .set('estados', estadosABuscar)
      .set('id', idEmpresa)
      .set('fechaInicio', this.convertirFecha(this.reportesFormGroup.controls['txtFechaReporteDel'].value).toString())
      .set('fechaFinal', this.convertirFecha(this.reportesFormGroup.controls['txtFechaReporteAl'].value).toString())
      .set('pagina', '0')
      .set('limite', '10')
    this.tablaReportes.setParametros(this.parametrosBusqueda);
    this.tablaReportes.cargarData();
  }

  public iniciarData(event) {

  }

  public seleccionaEstado(event, selecciona: boolean) {
    console.log('uno ', event);
  }

  public seleccionaTodosEstados(event, selecionna: boolean) {
    console.log('todos ', event);
  }

  eventoLanzado(evento) {
    const item = evento[0];
    const atributo = evento[1];
    this._reporteDocumentoEmisorService.reporteGeneral.next(item);
    this._reporteDocumentoEmisorService.fechaInicio.next(this.convertirFecha(this.reportesFormGroup.controls['txtFechaReporteDel'].value).toString());
    this._reporteDocumentoEmisorService.fechaFinal.next(this.convertirFecha(this.reportesFormGroup.controls['txtFechaReporteAl'].value).toString());

    let tipoDocumento = '';
    switch (atributo) {
      case 'facturas':
        tipoDocumento = this._tiposService.TIPO_DOCUMENTO_FACTURA;
        break;
      case 'facturasAnticipo':
        tipoDocumento = 'AF';
        break;
      case 'boletas':
        tipoDocumento = this._tiposService.TIPO_DOCUMENTO_BOLETA;
        break;
      case 'boletasAnticipo':
        tipoDocumento = 'AB';
        break;
      case 'notaCredito':
        tipoDocumento = this._tiposService.TIPO_DOCUMENTO_NOTA_CREDITO;
        break;
      case 'notaDebito':
        tipoDocumento = this._tiposService.TIPO_DOCUMENTO_NOTA_DEBITO;
        break;
      case 'retencion':
        tipoDocumento = this._tiposService.TIPO_DOCUMENTO_RETENCION;
        break;
      case 'percepcion':
        tipoDocumento = this._tiposService.TIPO_DOCUMENTO_PERCEPCION;
        break;
    }
    this._reporteDocumentoEmisorService.tipoDocumento.next(tipoDocumento);
    this.router.navigate(['./detalle'], {relativeTo: this.route});
  }
}
