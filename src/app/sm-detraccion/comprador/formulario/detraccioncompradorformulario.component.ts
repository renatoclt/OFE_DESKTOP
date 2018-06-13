import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';

import { MomentModule } from 'angular2-moment/moment.module';
import { AppUtils } from "../../../utils/app.utils";
import { MasterService } from '../../../service/masterservice';
import { ComboItem } from "app/model/comboitem";
import { Detraccion } from "app/model/sm-detracciones";
import '../../../../assets/js/plugins/jquery.PrintArea.js';
import { AdjuntoService } from "app/service/adjuntoservice";
import { Archivo } from "app/model/archivo";
import { detraccionesService } from "app/service/sm-detraccionesservice";
import { LoginService } from '../../../service/login.service';
//import { Boton } from 'app/model/menu';
import { ChangeDetectorRef } from '@angular/core';
//import { Caracteristicas } from 'app/model/retenciones';
declare var moment: any;
declare var swal: any;

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}
declare var $,DatatableFunctions: any;
var oDetraccionCompradorFormularioComponent: DetraccionCompradorFormularioComponent, dtDetraccionDetalle, dtArchivos, archivo: Archivo;
@Component({
  moduleId: module.id,
  selector: 'detraccioncompradorformulario-cmp',
  templateUrl: './detraccioncompradorformulario.component.html',
  providers: [ AdjuntoService,detraccionesService, MasterService, LoginService]
})

export class DetraccionCompradorFormularioComponent implements OnInit, AfterViewInit {

  public toggleButton: boolean = true;
  public id: string = '0';

  util: AppUtils;
  public listPrioridadCombo: ComboItem[];
  public listMonedaCombo: ComboItem[];
  public listUnidadMedidaCombo: ComboItem[];
  public listEstadoCombo: ComboItem[];
  public item: Detraccion;
  public detraccion: Detraccion;
  public bienservicio: string;
  public tipooperacion: string;
  public url_main_module_page = '/detraccion/comprador/buscar';


  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private _masterService: MasterService, private _dataService: detraccionesService, private _dataServiceAdjunto: AdjuntoService, private_securityService: LoginService) {
    this.util = new AppUtils(this.router, this._masterService);
    this.item = new Detraccion();
    this.bienservicio = '';
    this.tipooperacion = '';
    
   
    }



    print(event): void {

      //oDetraccionCompradorFormularioComponent.item.moneda_txt = $("#moneda option:selected").text();
      //oRequerimientoCompradorFormularioComponent.item.estado = $("#estadoComprador option:selected").text();
      setTimeout(function () {
          $("div#print-section-material").printArea({ popTitle: 'DETRACCIÓN', mode: "iframe", popClose: false });
      }, 100);
      //hay que chequear en donde imprime esta parte en conformidaad de servicio
    }
  ngOnInit() {

    //oDetraccionCompradorFormularioComponent = this;
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
    });

    if (this.id != '0') {
      this.toggleButton = true;

    } else {
      this.toggleButton = false;
    }
    
    this.util.listEstadoDetraccion(function (data: ComboItem[]) {

      oDetraccionCompradorFormularioComponent.listEstadoCombo = data;
    });

    oDetraccionCompradorFormularioComponent = this
   
  }


  ngAfterViewInit() {

    this._dataService
      .obtener(this.id)
      .subscribe(
      p => {
        this.item = p;
        //console.log(this.item);
        
        oDetraccionCompradorFormularioComponent.bienservicio = p.codbienservicio.trim() + ' - '+ p.nombienservicio.trim(); 
        oDetraccionCompradorFormularioComponent.tipooperacion = p.codtipooperacion.trim() + ' - '+ p.nrotipooperacion.trim(); 

        setTimeout(function () {

          $("input").each(function () {
            $(this).keydown();
            if (!$(this).val() && $(this).val() == '')
              $(this.parentElement).addClass("is-empty");
          });
          $("select").each(function () {
            $(this).keydown();
            if (!$(this).val() && $(this).val() == '')
              $(this.parentElement).addClass("is-empty");
          });
          $("textarea").each(function () {
            $(this).keydown();
            if (!$(this).val() && $(this).val() == '')
              $(this.parentElement).addClass("is-empty");
          });

          dtDetraccionDetalle.ajax.reload();
          //dtArchivos.ajax.reload();
        }, 100);
      },
      e => console.log(e),
      () => { }
    );
      
     //

    dtDetraccionDetalle = $('#dtDetraccionDetalle').DataTable({
      "order": [[1, "asc"]],
      "ajax": function (data, callback, settings) {
        let result = {
          data: oDetraccionCompradorFormularioComponent.item.detalles

        };
        callback(
          result
        );
      },

      "createdRow": function (row, data, index) {


        if (data.es_subitem == false && data.tienesubitem) {
          $(row).addClass('highlight');
          $(row).attr('identificador', data.id);
        }
        else {
          //$(row).attr('parentid', data.parentid);
          $('td', row).eq(0).addClass('text-center');
        }

      },
      columns: [

       // { data: 'id' },
        { data: 'tipodocumento' },
        { data: 'seriedocumento' },
        { data: 'nrodocumento' },
        { data: 'fechadocumento' },
        { data: 'monedadet' },
        { data: 'tipocambio' },
        { data: 'montooriginal' },
        { data: 'montopago' },
        { data: 'montodetractado' },
        { data: 'saldofactura' }
      ],
      columnDefs: [
        { "className": "text-center", "targets": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
       
      ]
    });

    dtDetraccionDetalle.on('click', '.atributos', function (event) {
      var $tr = $(this).closest('tr');
      let id = $tr.find("a").attr('row-id');

    });

  }
  ngAfterViewChecked() {

    //this.cdRef.detectChanges();
  }

}