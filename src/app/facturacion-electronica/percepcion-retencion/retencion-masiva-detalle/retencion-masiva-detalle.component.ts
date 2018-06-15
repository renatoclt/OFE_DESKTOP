import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { RutasService } from '../../general/utils/rutas.service';
import {ArchivoMasivaService} from '../services/archivoMasiva.service';
import {DataTableComponent} from '../../general/data-table/data-table.component';
import {HttpParams} from '@angular/common/http';
import {PadreRetencionPercepcionService} from '../services/padre-retencion-percepcion.service';
import {ColumnaDataTable} from '../../general/data-table/utils/columna-data-table';
declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}
declare var $, swal: any;
@Component({
  selector: 'app-retencion-masiva',
  templateUrl: './retencion-masiva-detalle.component.html',
  styleUrls: ['./retencion-masiva-detalle.css']
})
export class RetencionMasivaDetalleComponent implements OnInit {

  id: number;
  nombreArchivo: string;

  columnasTabla: ColumnaDataTable[];

  ordenarPorElCampo: string;
  @ViewChild('tablaDetalleMasiva') tablaDetalleMasiva: DataTableComponent<PruebaError>;

  totalRegistros: number;
  totalErrores: number;
  idTablaDetalleMasiva= 'tablaDetalleMasiva';

  parametrosDetalleMasiva: HttpParams;
  tipoMetodoMasiva: string;
  urlDetalleArchivoMasivaService: string;

  constructor(
              private route: ActivatedRoute,
              private router: Router,
              private _rutas: RutasService,
              public _archivosMasivaService: ArchivoMasivaService,
              private _padreRetencionPerpcionService: PadreRetencionPercepcionService) {
    this._padreRetencionPerpcionService.actualizarComprobante(this.route.snapshot.data['codigo'],
      this.route.snapshot.data['mostrarCombo'], true);
    this.columnasTabla = [
      new ColumnaDataTable('fila', 'fila'),
      new ColumnaDataTable('serie', 'serie'),
      new ColumnaDataTable('numeroCorrelativo', 'correlativo'),
      new ColumnaDataTable('descripcionError', 'error', {'text-align': 'left'})
    ];
    this.ordenarPorElCampo = 'serie';
    this.tipoMetodoMasiva = this._archivosMasivaService.TIPO_ATRIBUTO_DETALLE_DOCUMENTO_MASIVO;
    this.urlDetalleArchivoMasivaService = this._archivosMasivaService.urlQryDetalleMasivo;
    this.totalRegistros = 0;
    this.totalErrores = 0;
    this.nombreArchivo = '';
  }

  ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
        this.parametrosDetalleMasiva = new HttpParams().set('id_archivo', params['idDocumentoMasivo']);
        this.nombreArchivo = params['nombreArchivo'];
        this.totalRegistros = +params['totalRegistros'];
        this.totalErrores = +params['totalErrores'];
      }
    );
  }
  iniciarDataDetalleMasiva(event) {

  }

  regresar() {
    this.router.navigateByUrl( 'percepcion-retencion/retencion/crear/masiva' );
  }

}


export class PruebaError {
  fila: number;
  columna: number;
  serie: string;
  correlativo: string;
  error: string;
  constructor() {

  }
}
