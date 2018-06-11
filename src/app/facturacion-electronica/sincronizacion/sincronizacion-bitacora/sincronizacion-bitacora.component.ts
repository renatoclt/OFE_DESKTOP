import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BitacoraSincronizacion } from '../../general/models/sincronizacion/bitacoraSincronizacion';
import { EstadoSincronizacion } from '../../general/models/sincronizacion/estadoSincronizacion';
import { TipoSincronizacion } from '../../general/models/sincronizacion/tipoSincronizacion'
import { DataTableComponent } from '../../general/data-table/data-table.component';
import { EstadoDocumentoService } from '../../general/services/documento/estadoDocumento.service';
import { EstadoDocumento } from '../../general/models/documento/estadoDocumento';
import { SincronizacionService } from '../../general/services/sincronizacion/sincronizacion.service'
import { TiposService } from '../../general/utils/tipos.service';
import {HttpParams} from '@angular/common/http';
import { ColumnaDataTable } from '../../general/data-table/utils/columna-data-table';
import { ConstantesLoginService } from '../../../service/loginConstantes';

@Component({
    selector: 'app-bitacora',
    templateUrl: './sincronizacion-bitacora.component.html',
    providers: [SincronizacionService],
    styleUrls: []
})
export class BitacoraComponent implements OnInit {

    public mensajeBusqueda: string;
    public bitacoraSincronizado: string;
    public tipoAtributos: string;
    public urlSincronizado: string;
    public cabecera: string[] = [];
    public atributos: string[] = [];
    public columna: ColumnaDataTable[];
    public estadosSincronizacion: EstadoSincronizacion[] = [];
    public tiposSincronizacion: TipoSincronizacion[] = [];
    public estadosDocumentos: EstadoDocumento[] = [];
    public sincronizado: EstadoSincronizacion = new EstadoSincronizacion();
    public noSincronizado: EstadoSincronizacion = new EstadoSincronizacion();
    public onLine: TipoSincronizacion = new TipoSincronizacion();
    public offLine: TipoSincronizacion = new TipoSincronizacion();
    public urlBase : String = "";
    public bitacoraFormGroup: FormGroup;
    public parametros: HttpParams;

    @ViewChild('tablaNormal') tabla: DataTableComponent<BitacoraSincronizacion>;

    constructor(public router: Router,
        private tipos: TiposService,
        private sincronizacionService: SincronizacionService,
        private estadoDocumentoService: EstadoDocumentoService) {
        this.sincronizado.idEstado = 1;
        this.sincronizado.estado = "Sincronizado";
        this.noSincronizado.idEstado = 0;
        this.noSincronizado.estado = "No Sincronizado";
        this.estadosSincronizacion = [this.sincronizado, this.noSincronizado];
        
        this.onLine.idTipo = 1;
        this.onLine.tipo = "OnLine";
        this.offLine.idTipo = 0;
        this.offLine.tipo = "OffLine";
        this.tiposSincronizacion = [this.onLine, this.offLine];
    }

    ngOnInit() {
        this.initForm();
        this.columna = [new ColumnaDataTable('Fecha','fecSincronizadoFecha'), new ColumnaDataTable('Hora','fechaSincronizadoHora'), new ColumnaDataTable('Usuario', 'idUsuarioCreacion'),
                        new ColumnaDataTable('NroComprobante', 'numeroComprobante'), new ColumnaDataTable('Generado','generado'), 
                        new ColumnaDataTable('Estado Sincronización','estadoSincronizado'), new ColumnaDataTable('Estado Documento','estadoComprobante')];
        
        // this.parametros = new HttpParams();
        this.estadoDocumentoService.obtenerEstadosComprobantes().subscribe((val) => {
            this.estadosDocumentos = val;
        });
        this.bitacoraSincronizado = this.sincronizacionService.getBitacoraSincronizado();
        if (this.bitacoraSincronizado == this.tipos.TIPO_DOCUMENTO_RETENCION) {
            this.tipoAtributos = this.tipos.CABECERA_RETENCIONES;
            this.urlSincronizado =  this.sincronizacionService.getUrlObjeto();
            this.urlBase = 'http://localhost:3000/v1/retenciones';
            console.log(this.urlSincronizado);
        }
        if(this.bitacoraSincronizado == this.tipos.TIPO_DOCUMENTO_PERCEPCION){
            this.urlSincronizado =  this.sincronizacionService.getUrlObjeto();
            this.urlBase = 'http://localhost:3000/v1/percepcion';
        }
        if(this.bitacoraSincronizado == this.tipos.TIPO_DOCUMENTO_FACTURA){
            console.log('ingreseeeee');
            this.urlSincronizado =  this.sincronizacionService.getUrlObjeto();
            this.urlBase = 'http://localhost:3000/v1/factura';
        }
        if(this.bitacoraSincronizado == this.tipos.TIPO_DOCUMENTO_BOLETA){
            this.urlSincronizado =  this.sincronizacionService.getUrlObjeto();
            this.urlBase = 'http://localhost:3000/v1/boleta';
        }
    }
    private iniciarData(){
        this.parametros = new HttpParams();
        switch (this.bitacoraSincronizado){
            case(this.tipos.TIPO_DOCUMENTO_FACTURA):{
                console.log('ingreseeeee');
                this.tabla.urlServicio = 'http://localhost:3000/v1/factura';
                break;
            }
            case(this.tipos.TIPO_DOCUMENTO_BOLETA):{
                this.tabla.urlServicio = 'http://localhost:3000/v1/boleta';
                break;
            }
            case(this.tipos.TIPO_DOCUMENTO_RETENCION):{
                this.tabla.urlServicio = 'http://localhost:3000/v1/retenciones';
                break;
            }
            case(this.tipos.TIPO_DOCUMENTO_PERCEPCION):{
                this.tabla.urlServicio = 'http://localhost:3000/v1/percepcion';
                break;
            }
        }
        
        this.tabla.setParametros(this.parametros);
        this.tabla.cargarData();
        // this.buscar();
    }
    private initForm() {
        const fecha = new Date();
        const fecha_actual = fecha.getDate().toString() + '/' + fecha.getMonth().toString() + '/' + fecha.getFullYear().toString();
        this.bitacoraFormGroup = new FormGroup({
            'txtComprobante': new FormControl('', [Validators.required]),
            'cmbGenerado': new FormControl('', [Validators.required]),
            'cmbEstadoDocumento': new FormControl('', [Validators.required]),
            'datefechaInicio': new FormControl(fecha_actual, [Validators.required]),
            'datefechaFin': new FormControl(fecha_actual, [Validators.required]),
            'cmbEstadoSincronizacion': new FormControl('', [Validators.required])
        });
        
    }

    public volver() {
        this.router.navigateByUrl('sincronizacion/sincronizar');
    }

    public buscar() {
        var fechaInicio : string = this.bitacoraFormGroup.get('datefechaInicio').value;
        var fechaFin : string = this.bitacoraFormGroup.get('datefechaFin').value;
        if (fechaInicio == "" && fechaFin == "") {
            this.mensajeBusqueda = "Ingrese la fecha inicio y la fecha fin";
        } else {
            var fechaI : Date = new Date(Number.parseInt(fechaInicio.split("/", 3)[2]), Number.parseInt(fechaInicio.split("/", 2)[1]) - 1, Number.parseInt(fechaInicio.split("/", 1)[0]));
            var fechaF : Date = new Date(Number.parseInt(fechaFin.split("/", 3)[2]), Number.parseInt(fechaFin.split("/", 2)[1]) - 1,  Number.parseInt(fechaFin.split("/", 1)[0]));
            if (fechaI.getTime() >= fechaI.getTime()) {
                fechaInicio = fechaInicio.split("/", 3)[2] + "-" + fechaInicio.split("/", 2)[1] + "-" + fechaInicio.split("/", 1)[0];
                fechaFin = fechaFin.split("/", 3)[2] + "-" + fechaFin.split("/", 2)[1] + "-" + fechaFin.split("/", 1)[0];

                var TipoGenerado: String = '';
                if (this.bitacoraFormGroup.get('cmbGenerado').value != "") {
                    TipoGenerado = this.bitacoraFormGroup.get('cmbGenerado').value.toString();
                }
                var estadoDocumento: string = "";
                if (this.bitacoraFormGroup.get('cmbEstadoDocumento').value != "") {
                    var idDocumento : number = this.bitacoraFormGroup.get('cmbEstadoDocumento').value;
                    for (let estado of this.estadosDocumentos) {
                        if (estado.idEstadoComprobante == idDocumento) {
                            estadoDocumento = estado.idEstadoComprobante.toString();
                            break;
                        }
                    }
                }
                var estadoSincronizacion: string = "";
                if (this.bitacoraFormGroup.get('cmbEstadoSincronizacion').value != "") {
                    estadoSincronizacion = this.bitacoraFormGroup.get('cmbEstadoSincronizacion').value;
                }
                var comprobante: string = "";
                if (this.bitacoraFormGroup.get('txtComprobante').value != ""){
                    comprobante = this.bitacoraFormGroup.get('txtComprobante').value;
                }

                this.parametros = new HttpParams()
                    .set('numeroComprobante', comprobante == null ? "" : comprobante.toString())
                    .set('generado', TipoGenerado == null ? "" : TipoGenerado.toString())
                    .set('estado', estadoDocumento == null ? "" : estadoDocumento.toString())
                    .set('estadoSincronizado', estadoSincronizacion == null ? "" : estadoSincronizacion.toString())
                    .set('fechaInicio', fechaInicio)
                    .set('fechaFin', fechaFin);

                this.tabla.urlServicio = this.urlBase + '/search/buscar';    
                //this.tabla.limpiarDataTemporal();
                this.tabla.setParametros(this.parametros);
                this.tabla.cargarData();
                /*this.sincronizacionService.buscarPorFechaTipoSincronizacion(fechaInicio, fechaFin, comprobante, estadoDocumento, TipoGenerado, estadoSincronizacion).subscribe((val) => {
                    this.estadosDocumentos = val;
                });*/
                //this.tabla.cargaData(this.urlSincronizado + this.sincronizacionService.filtro);
                
            } else {
                this.mensajeBusqueda = "La fecha inicio no puede ser mayor a la fecha fin";
            }
        }
    }
    
}