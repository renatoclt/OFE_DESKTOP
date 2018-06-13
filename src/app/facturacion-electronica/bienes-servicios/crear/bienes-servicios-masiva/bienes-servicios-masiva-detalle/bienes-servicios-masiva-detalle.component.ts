import {Component, OnInit, ViewChild} from '@angular/core';
import {ColumnaDataTable} from '../../../../general/data-table/utils/columna-data-table';
import {ActivatedRoute, Router} from '@angular/router';
import {DataTableComponent} from '../../../../general/data-table/data-table.component';
import {HttpParams} from '@angular/common/http';
import {ArchivoMasivaService} from '../../../../percepcion-retencion/services/archivoMasiva.service';

@Component({
  selector: 'app-bienes-servicios-masiva-detalle',
  templateUrl: './bienes-servicios-masiva-detalle.component.html',
  styleUrls: ['./bienes-servicios-masiva-detalle.component.css']
})
export class BienesServiciosMasivaDetalleComponent implements OnInit {

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
    public _archivosMasivaService: ArchivoMasivaService) {
    this.columnasTabla = [
      new ColumnaDataTable('fila', 'fila'),
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
    this.router.navigateByUrl( 'bienes-servicios/crear/masiva' );
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
