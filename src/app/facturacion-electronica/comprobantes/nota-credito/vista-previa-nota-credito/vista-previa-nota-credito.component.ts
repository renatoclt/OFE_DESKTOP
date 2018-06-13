import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NotaCredito} from '../modelos/notaCredito';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CreacionComprobantes} from '../../../general/services/comprobantes/creacionComprobantes';
import {JsonDocumentoParametroNotaCredito} from '../modelos/jsonDocumentoParametroNotaCredito';
import {DataTableComponent} from '../../../general/data-table/data-table.component';
import * as WrittenNumber from 'written-number';
import {NotaCreditoService} from '../servicios/nota-credito.service';
import {TranslateService} from '@ngx-translate/core';
import {TiposService} from '../../../general/utils/tipos.service';
import {PadreComprobanteService} from '../../services/padre-comprobante.service';
import {ColumnaDataTable} from '../../../general/data-table/utils/columna-data-table';

@Component({
  selector: 'app-vista-previa-nota-credito',
  templateUrl: './vista-previa-nota-credito.component.html',
  styleUrls: ['./vista-previa-nota-credito.component.css']
})
export class VistaPreviaNotaCreditoComponent implements OnInit, OnDestroy {
  columnasTabla: ColumnaDataTable[];
  tituloComprobante: string;
  tipoNotaComprobante: string;
  pathRegresarA: string;
  totalEnPalabras: string;
  public urlLogo: string;
  notaCredito: NotaCredito;

  @ViewChild(DataTableComponent) dataTable: DataTableComponent<any>;

  fechaEmision: Date;
  formatoFechaEmision: string;
  ordenarPorElCampo: string;

  eliminarPersistencia: boolean;

  constructor(private route: ActivatedRoute,
              private _notaCreditoService: NotaCreditoService,
              private router: Router,
              private _creacionComprobantes: CreacionComprobantes,
              private _translateService: TranslateService,
              private _padreComprobanteService: PadreComprobanteService) {
    this._padreComprobanteService.actualizarComprobante(this.route.snapshot.data['codigo'], this.route.snapshot.data['mostrarCombo']);
    this.notaCredito = this._notaCreditoService.obtenerNotaCreditoPersistencia();
    this.eliminarPersistencia = true;
    if (this._notaCreditoService.estaUsandoPersistencia.value) {
      this.tituloComprobante = '';
      this.columnasTabla = [
        new ColumnaDataTable('codigo', 'codigoItem'),
        new ColumnaDataTable('descripcion', 'descripcionItem', {'text-align': 'left'}),
        new ColumnaDataTable('cantidad', 'cantidad', {'text-align': 'right'}),
        new ColumnaDataTable('unidadMedida', 'detalle.unidadMedida'),
        new ColumnaDataTable('valorUnitario', 'precioUnitario', {'text-align': 'right'}),
        new ColumnaDataTable('igv', 'detalle.subtotalIgv', {'text-align': 'right'}),
        new ColumnaDataTable('isc', 'detalle.subtotalIsc', {'text-align': 'right'}),
        new ColumnaDataTable('valorVenta', 'precioTotal', {'text-align': 'right'})
      ];
      this.ordenarPorElCampo = 'codigoItem';
      this.fechaEmision = new Date();
      this.formatoFechaEmision = this.obtenerFecha();
      this.leerParametrosUrl();
    } else {
      this.regresar();
    }

  }

  obtenerFecha(): string {
    const dateConvertido = new Date();
    const dia = dateConvertido.getDate();
    const mes = dateConvertido.getMonth() + 1;
    const anio = dateConvertido.getFullYear();
    return anio + '-' + this.ponerCeros(mes, 2) + mes + '-' + this.ponerCeros(dia, 2) + dia;
  }

  ponerCeros(numero: number , cantidadZeros: number) {
    return '0'.repeat(cantidadZeros - numero.toString().length);
  }

  leerParametrosUrl() {
    this.route.queryParams.subscribe(
      (parametros: Params) => {
        this.pathRegresarA = parametros['regresarA'];
      }
    );
  }

  ngOnInit() {
    this.getRUCOrganizacion();
    this.route.data.subscribe(
      data => {
        this.tituloComprobante = data['titulo'];
      }
    );
    const documentoParametroAux = this.notaCredito.documentoParametro[0];
    if (documentoParametroAux) {
      const jsonDocumentoParametroAux: JsonDocumentoParametroNotaCredito = JSON.parse(documentoParametroAux.json);
      this.tipoNotaComprobante = jsonDocumentoParametroAux.valor;
    }
    const arr = this.notaCredito.totalComprobante.toString().split('.');
    const entero = arr[0];
    const decimal = arr[1];
    let con = '';
    this._translateService.get('con').take(1).subscribe(data => con = data);
    this.totalEnPalabras =
      (WrittenNumber(Number(entero), { lang: 'es' }) + ' ' + con + ' ' + decimal + '/100 ' +
        this.notaCredito.auxMonedaTablaMaestra.descripcionLarga);
  }

  ngOnDestroy() {
    if (this.eliminarPersistencia) {
      this._notaCreditoService.eliminarNotaCreditoPersistencia();
    }
  }
  public getRUCOrganizacion() {
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    this.urlLogo = usuarioActual.org_url_image != null ? usuarioActual.org_url_image : '';
  }

  iniciarDataTable(evento) {
    const detalles = this.notaCredito.detalleEbiz;
    detalles.map(
      detalleData => {
        if (detalleData.codigoItem === '') {
          detalleData.codigoItem = '-';
        }
        if (detalleData.descripcionItem === '') {
          detalleData.descripcionItem = '-';
        }
        if (detalleData.detalle.unidadMedida === '') {
          detalleData.detalle.unidadMedida = '-';
        }
      }
    );
    this.dataTable.insertarData(detalles);
  }

  emitir() {
    this.fechaEmision = new Date();
    this.notaCredito.fechaEmision = this.fechaEmision.getTime();
    this._creacionComprobantes.crearNotaCredito(this.notaCredito).subscribe(
      data => {
        if (data !== null) {
          this._notaCreditoService.notaCredito.next(new NotaCredito());
          this._notaCreditoService.eliminarNotaCreditoPersistencia();
          this._notaCreditoService.estaUsandoPersistencia.next(false);
          this.router.navigate(['../../emision', data['id']], { relativeTo: this.route});
        }
      }
    );

  }

  regresar() {
    this.eliminarPersistencia = false;
    this.router.navigate(['../'], { relativeTo: this.route});
  }
}
