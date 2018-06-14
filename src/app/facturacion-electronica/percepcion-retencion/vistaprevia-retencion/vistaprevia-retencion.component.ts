import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataTableComponent} from '../../general/data-table/data-table.component';
import {Retencionebiz} from '../models/retencionebiz';
import {PersistenciaServiceRetencion} from '../services/persistencia.service';
import {RetencionpersiscabeceraService} from '../services/retencionpersiscabecera.service';
import {RetencionCabecera} from '../models/retencion-cabecera';
import * as WrittenNumber from 'written-number';
import {PrincipalRetencion} from '../models/principal-retencion';
import {NuevoDocumentoService} from '../../general/services/documento/nuevoDocumento';
import {PersistenciaEntidadService} from '../services/persistencia.entidad.service';
import {Entidad} from '../../general/models/organizacion/entidad';
import {HttpClient} from '@angular/common/http';
import {PersistenciaPost} from '../services/persistencia-post';
import {Post_retencion} from '../models/post_retencion';
import {Rdetalle} from '../models/rdetalle';
import {TiposService} from '../../general/utils/tipos.service';
import {SpinnerService} from '../../../service/spinner.service';
import {RefreshService} from '../../general/services/refresh.service';
import {PadreRetencionPercepcionService} from '../services/padre-retencion-percepcion.service';
import {ColumnaDataTable} from '../../general/data-table/utils/columna-data-table';
import {UtilsService} from '../../general/utils/utils.service';
import {FormatoFecha} from '../../general/utils/formato-fechas';
declare var  swal: any;

@Component({
  selector: 'app-vistaprevia',
  templateUrl: './vistaprevia-retencion.component.html',
  styleUrls: ['./vistaprevia-retencion.css']
})

export class VistapreviaRetencionComponent implements OnInit {
  public listaitems: Retencionebiz[];
  public retencioncab: RetencionCabecera;
  public entidadlogueo: Entidad;
  public entidadreceptora: Entidad;
  public documentoreferenciaunit: Rdetalle = new Rdetalle();
  public columnasTabla: ColumnaDataTable[];
  @ViewChild('tablaNormal') tabla: DataTableComponent<Retencionebiz>;
////////////////////////////////////////////////////

  public rucreceptor: number;              // COMPRADORA
  public razonsocialreceptor: string;      // COMPRADORA
  public domiciliofiscalreceptor: string;  // COMPRADORA
  public domiciliofiscalremisor: string;   // PROVEEDORA
  public rucemisor: number;                // PROVEEDORA
  public razonsocialemisor: string;        // PROVEEDORA
  public fechaemisiones: string;
  public totales: number;
  public totalespalabaras: String;
  public tipocambio: string;
  public banco: string;
  public domiciliofiscalemisor: string;
  public observacion: string;
  public mesnorm: string;
  public dianorm: string;
  public series: string;
  public tipo_moneda: string;
  public total_importe: string;
  public org_busqueda: Entidad;
  public retencion_principal: PrincipalRetencion;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private _utilsService: UtilsService,
              private persistenciaService: PersistenciaServiceRetencion,
              private RetencionCabecerapersistenciaService: RetencionpersiscabeceraService,
              private _nuevodocumento: NuevoDocumentoService,
              private _entidadPersistenciaService: PersistenciaEntidadService,
              private httpClient: HttpClient,
              private _postpersisservice: PersistenciaPost,
              private _tipos: TiposService,
              private Refresh: RefreshService,
              private _padreRetencionPerpcionService: PadreRetencionPercepcionService) {
    this._padreRetencionPerpcionService.actualizarComprobante(this.route.snapshot.data['codigo'],
      this.route.snapshot.data['mostrarCombo'], true);
    this.retencion_principal = new PrincipalRetencion();
    this.entidadlogueo = new Entidad;
    this.org_busqueda = new Entidad;
    this.entidadreceptora = new Entidad;
    this.listaitems = [];
    this.columnasTabla = [
      new ColumnaDataTable('tipo', 'tipoDocumentoDestinoDescripcion'),
      new ColumnaDataTable('serie', 'serieDocumentoDestino'),
      new ColumnaDataTable('numeroCorrelativo', 'correlativoDocumentoDestino'),
      new ColumnaDataTable('fechaEmision', 'fechaEmisionDestino'),
      new ColumnaDataTable('Moneda Origen', 'monedaDestino'),
      new ColumnaDataTable('importeTotal', 'totalMonedaDestino', {'text-align': 'right'}),
      new ColumnaDataTable('importeTotalsoles', 'totalImporteDestino', {'text-align': 'right'}),
      new ColumnaDataTable('importeRetencionsoles', 'totalImporteAuxiliarDestino', {'text-align': 'right'}),
      new ColumnaDataTable('Nro Doc ERP', 'polizaFactura')
    ];
  }
  ngOnInit() {
    // ********** VISTA DE DATOS EN HTML ********* //
    this.retencioncab = this.RetencionCabecerapersistenciaService.getCabeceraRetencion();
    this.org_busqueda = this._entidadPersistenciaService.getEntidad();
    if (this.retencioncab != null) {
      let totalAux = 0;
      this.listaitems = this.persistenciaService.getListaProductos();
      for (let i = 0 ; i < this.listaitems.length; i++ ) {
        totalAux += Number(this.listaitems[i].totalImporteDestino);
      }
      this.total_importe = totalAux.toFixed(2);

      const fechastr = this.retencioncab.fecPago.toString().split('/');
      const dia = fechastr[0];
      const mes = fechastr[1];
      if ((mes.length < 2) && (Number(mes) < 10)) {
        this.mesnorm = '0' + mes;
      } else {
        this.mesnorm = mes;
      }
      if ((dia.length < 2) && (Number(dia) < 10)) {
        this.dianorm = '0' + dia;
      } else {
        this.dianorm = dia;
      }
      const anio = fechastr[2];
      this.rucemisor = this.retencioncab.rucProveedor;                  // COMPRADORA
      this.razonsocialemisor = this.retencioncab.razonSocialProveedor;  // COMPRADORA
      this.domiciliofiscalemisor = this.retencioncab.direccionproveedor;         // COMPRADORA
      this.rucreceptor = this.retencioncab.rucComprador;                    // PROVEEDORA
      this.razonsocialreceptor = this.retencioncab.razonSocialComprador;    // PROVEEDORA
      this.domiciliofiscalreceptor = this.retencioncab.direccioncomprador;           // PROVEEDORA
      this.observacion = this.retencioncab.observacionComprobante;
      this.fechaemisiones =  anio + '-' + this.mesnorm + '-' + this.dianorm;
      this.totales = this.retencioncab.total;
      this.tipo_moneda = this.retencioncab.moneda.toString();
      this.calcularTotales();
      this.tipocambio = '-';
      this.banco = '-';
      this.series = this.retencioncab.serie;
    } else {
      this.router.navigateByUrl('percepcion-retencion/retencion/crear');
    }

    // ********** FIN DE VISTA DE DATOS EN HTML ********* //

    this.entidadlogueo.idTipoEntidad = '1';
    this.entidadlogueo.idEntidad = localStorage.getItem('id_entidad');
    this.entidadlogueo.tipoDocumento = '6';
    this.entidadlogueo.documento = localStorage.getItem('org_ruc');
    this.entidadlogueo.denominacion = localStorage.getItem('org_nombre');
    this.entidadlogueo.nombreComercial = localStorage.getItem('org_nombre');
    this.entidadlogueo.direccionFiscal = localStorage.getItem('org_direccion');
    this.entidadlogueo.ubigeo = '040101';
    this.entidadlogueo.correo = localStorage.getItem('org_email');
    this.entidadlogueo.notifica = 'S';

    this.entidadreceptora.idTipoEntidad = '2';
    this.entidadreceptora.idEntidad = this.org_busqueda.idEntidad;
    this.entidadreceptora.tipoDocumento = '6';
    this.entidadreceptora.documento = this.org_busqueda.documento;
    this.entidadreceptora.denominacion = this.org_busqueda.denominacion;
    this.entidadreceptora.nombreComercial = this.org_busqueda.denominacion;
    this.entidadreceptora.direccionFiscal = this.org_busqueda.direccionFiscal;
    this.entidadreceptora.ubigeo = this.org_busqueda.ubigeo;
    this.entidadreceptora.correo = this.retencioncab.email;
    this.entidadreceptora.notifica = 'S';
  }



  public calcularTotales() {
    this.totalespalabaras = Number(this.retencioncab.total).toFixed(2);
    const arr = this.totalespalabaras.split('.');
    const entero = arr[0];
    const decimal = arr[1];
    this.totalespalabaras =  (WrittenNumber(Number(entero), { lang: 'es' }) + ' '
      + ' CON ' + decimal + '/100 SOLES.');
  }

  regresar() {
    this.Refresh.CargarPersistencia = true;
    console.log('this.Refresh.CargarPersistencia - VISTAPREVIA ');
    console.log(this.Refresh.CargarPersistencia);
    this.router.navigateByUrl('percepcion-retencion/retencion/crear/individual');
  }

  armarjson() {
    const fechastr = this.retencioncab.fecPago.toString().split('/');
    const dia = fechastr[0];
    const mes = fechastr[1];
    const anio = fechastr[2];
    this.retencion_principal.numeroComprobante = this.retencioncab.serie;
    this.retencion_principal.rucProveedor =  this.retencioncab.rucProveedor.toString();
    this.retencion_principal.rucComprador = this.retencioncab.rucComprador.toString();
    this.retencion_principal.idTablaTipoComprobante = this.retencioncab.idTablaTipoComprobante;
    this.retencion_principal.idRegistroTipoComprobante = this.retencioncab.idtipocomprobanteproveedor;
    this.retencion_principal.idTipoComprobante = this.retencioncab.idTipoComprobante;
    this.retencion_principal.razonSocialComprador = this.retencioncab.razonSocialComprador;
    this.retencion_principal.razonSocialProveedor = this.retencioncab.razonSocialProveedor;
    this.retencion_principal.moneda = this.retencioncab.moneda;
    this.retencion_principal.porcentajeImpuesto = this.retencioncab.porcentajeImpuesto;
    this.retencion_principal.fechaEmision = new Date(Number(anio), Number(mes) - 1, Number(dia), 0, 0, 0, 0).getTime();
    this.retencion_principal.observacionComprobante = this.retencioncab.observacionComprobante;
    this.retencion_principal.tipoComprobante = this.retencioncab.tipocomprobanteproveedor;
    this.retencion_principal.montoPagado = 0;
    // this.retencion_principal.montoPagado = this.retencioncab.totalimporte - this.retencioncab.total;
    this.retencion_principal.monedaDescuento = 'PEN';
    this.retencion_principal.montoDescuento = this.retencioncab.total;
    this.retencion_principal.descuento = 0.00;  // POR DEFECTO 0
    // this.retencion_principal.totalComprobante = this.retencioncab.totalimporte;
    this.retencion_principal.totalComprobante = this.retencioncab.totalimporte - this.retencioncab.total;

    this.retencion_principal.tipoItem = 3; // POR DEFECTO
    this.retencion_principal.idTablaMoneda = this._tipos.ID_TABLA_TIPO_MONEDA;
    this.retencion_principal.idRegistroMoneda = this._tipos.TIPO_MONEDA_SOL;
    this.retencion_principal.idSerie = this.retencioncab.idserie;
    this.retencion_principal.pagoBanco = '-';

    this.retencion_principal.detalleEbiz = [];
    this.retencion_principal.documentoConcepto = [];
    this.retencion_principal.documentoParametro = [];
    this.retencion_principal.documentoEntidad.push(this.entidadreceptora);
    this.retencion_principal.documentoEntidad.push(this.entidadlogueo);
    const persistencia_detalle = this.persistenciaService.getListaProductos();

    for (let i = 0 ; i < persistencia_detalle.length ; i++) {
      this.documentoreferenciaunit = new Rdetalle();
      this.documentoreferenciaunit.idDocumentoDestino = persistencia_detalle[i].idDocumentoDestino;
      this.documentoreferenciaunit.tipoDocumentoOrigen = persistencia_detalle[i].tipoDocumentoOrigen;
      this.documentoreferenciaunit.serieDocumentoDestino = persistencia_detalle[i].serieDocumentoDestino;
      this.documentoreferenciaunit.correlativoDocumentoDestino = persistencia_detalle[i].correlativoDocumentoDestino;
      this.documentoreferenciaunit.fechaEmisionDestino =
        this._utilsService.convertirFechaStringATimestamp(persistencia_detalle[i].fechaEmisionDestino, '-', FormatoFecha.ANIO_MES_DIA);
      this.documentoreferenciaunit.totalImporteDestino = persistencia_detalle[i].totalImporteDestino;
      this.documentoreferenciaunit.totalImporteAuxiliarDestino = persistencia_detalle[i].totalImporteAuxiliarDestino;
      this.documentoreferenciaunit.totalPorcentajeAuxiliarDestino = persistencia_detalle[i].totalPorcentajeAuxiliarDestino;
      this.documentoreferenciaunit.tipoDocumentoOrigenDescripcion = persistencia_detalle[i].tipoDocumentoOrigenDescripcion;
      this.documentoreferenciaunit.tipoDocumentoDestinoDescripcion = persistencia_detalle[i].tipoDocumentoDestinoDescripcion;
      this.documentoreferenciaunit.monedaDestino = persistencia_detalle[i].monedaDestino;
      this.documentoreferenciaunit.totalMonedaDestino = persistencia_detalle[i].totalMonedaDestino;
      this.documentoreferenciaunit.auxiliar1 = persistencia_detalle[i].auxiliar1;
      this.documentoreferenciaunit.auxiliar2 = persistencia_detalle[i].auxiliar2;
      this.documentoreferenciaunit.tipoDocumentoDestino = persistencia_detalle[i].tipoDocumentoDestino;
      this.documentoreferenciaunit.polizaFactura = persistencia_detalle[i].polizaFactura;
      this.retencion_principal.documentoReferencia.push(this.documentoreferenciaunit);
    }
  }

  emitir() {
    this.armarjson();
    this._nuevodocumento.subir(this.retencion_principal).subscribe(
      data => {
        const datapost = new Post_retencion();
        const that = this;
        setTimeout(function () {
         if (data) {
           that.router.navigate(['percepcion-retencion/retencion/crear/individual/emision', data.id]);
         }
         },  3000 );
      },
      error => {
      }
    );
    this.persistenciaService.vaciar_data();
    this.RetencionCabecerapersistenciaService.vaciar_data();
    this._entidadPersistenciaService.eliminar();
  }


  iniciarData(event) {
    this.listaitems = this.persistenciaService.getListaProductos();
    this.tabla.insertarData(this.listaitems);
  }
}
