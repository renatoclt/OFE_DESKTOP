import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CreacionComprobantes} from '../../../general/services/comprobantes/creacionComprobantes';
import {DataTableComponent} from '../../../general/data-table/data-table.component';
import {NotaDebito} from '../modelos/notaDebito';
import {JsonDocumentoParametroNotaDebito} from '../modelos/jsonDocumentoParametroNotaDebito';
import * as WrittenNumber from 'written-number';
import {NotaDebitoService} from '../servicios/nota-debito-service';
import {TranslateService} from '@ngx-translate/core';
import {PadreComprobanteService} from '../../services/padre-comprobante.service';
import {TiposService} from '../../../general/utils/tipos.service';
import {ColumnaDataTable} from '../../../general/data-table/utils/columna-data-table';


@Component({
  selector: 'app-vista-previa-nota-debito',
  templateUrl: './vista-previa-nota-debito.component.html',
  styleUrls: ['./vista-previa-nota-debito.component.css']
})
export class VistaPreviaNotaDebitoComponent implements OnInit, OnDestroy {
  columnasTabla: ColumnaDataTable[];
  tituloComprobante: string;

  tipoNotaComprobante: string;
  pathRegresarA: string;

  totalEnPalabras: string;
  public urlLogo: string;
  notaDebito: NotaDebito;

  @ViewChild(DataTableComponent) dataTable: DataTableComponent<any>;

  fechaEmision: Date;
  formatoFechaEmision: string;
  ordenarPorElCampo: string;

  eliminarPersistencia: boolean;

  constructor(private route: ActivatedRoute,
              private _notaDebitoService: NotaDebitoService,
              private router: Router,
              private _creacionComprobantes: CreacionComprobantes,
              private _translateService: TranslateService,
              private _tiposService: TiposService,
              private _padreComprobanteService: PadreComprobanteService) {
    this._padreComprobanteService.actualizarComprobante(this.route.snapshot.data['codigo'], this.route.snapshot.data['mostrarCombo']);
    this.notaDebito = this._notaDebitoService.obtenerNotaDebitoPersistencia();
    this.eliminarPersistencia = true;
    if (this._notaDebitoService.estaUsandoPersistencia.value) {
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
    this.route.data.subscribe(
      data => {
        this.tituloComprobante = data['titulo'];
      }
    );
    const documentoParametroAux = this.notaDebito.documentoParametro[0];
    if (documentoParametroAux) {
      const jsonDocumentoParametroAux: JsonDocumentoParametroNotaDebito = JSON.parse(documentoParametroAux.json);
      this.tipoNotaComprobante = jsonDocumentoParametroAux.valor;
    }
    const arr = this.notaDebito.totalComprobante.toString().split('.');
    const entero = arr[0];
    const decimal = arr[1];
    let con = '';
    this._translateService.get('con').take(1).subscribe(data => con = data);
    this.totalEnPalabras =
      (WrittenNumber(Number(entero), { lang: 'es' }) + ' ' + con + ' ' + decimal + '/100 ' +
        this.notaDebito.auxMonedaTablaMaestra.descripcionLarga);
  }

  ngOnDestroy() {
    if (this.eliminarPersistencia) {
      this._notaDebitoService.eliminarNotaDebitoPersistencia();
    }
  }
  public getRUCOrganizacion() {
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    this.urlLogo = usuarioActual.org_url_image != null ? usuarioActual.org_url_image : '';
  }

  iniciarDataTable(evento) {
    const detalles = this.notaDebito.detalleEbiz;
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
    this.notaDebito.fechaEmision = this.fechaEmision.getTime();
    this._creacionComprobantes.crearNotaDebito(this.notaDebito).subscribe(
      data => {
        if (data !== null) {
          this._notaDebitoService.notaDebito.next(new NotaDebito());
          this._notaDebitoService.eliminarNotaDebitoPersistencia();
          this._notaDebitoService.estaUsandoPersistencia.next(false);
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
