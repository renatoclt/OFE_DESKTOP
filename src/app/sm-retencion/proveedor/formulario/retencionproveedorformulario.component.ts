import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';

import { MomentModule } from 'angular2-moment/moment.module';
import { AppUtils } from "../../../utils/app.utils";
import { MasterService } from '../../../service/masterservice';
import { ComboItem } from "app/model/comboitem";
import { Retenciones, Caracteristicas  } from "app/model/sm-retenciones";
import '../../../../assets/js/plugins/jquery.PrintArea.js';

import { retencionesService } from "app/service/sm-retencionesservice";
import { LoginService } from 'app/service/login.service';
declare var moment: any;
declare var swal: any;

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}
declare var $,DatatableFunctions: any;
var oretencionesProveedorFormularioComponent: RetencionProveedorFormularioComponent, dtRetencionDetalle;
@Component({
  moduleId: module.id,
  selector: 'Retencionesproveedorformulario-cmp',
  templateUrl: './retencionproveedorformulario.component.html',
  providers: [retencionesService, MasterService,LoginService]
})

export class RetencionProveedorFormularioComponent implements OnInit, AfterViewInit {

  public toggleButton: boolean = true;
  public id: string = '0';

  util: AppUtils;
  public listPrioridadCombo: ComboItem[];
  public listMonedaCombo: ComboItem[];
  public listUnidadMedidaCombo: ComboItem[];
  public listEstadoCombo: ComboItem[];
  public item: Retenciones;
  public url_main_module_page = '/retencion/comprador/buscar';


  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private _masterService: MasterService, private _dataService: retencionesService) {
    this.util = new AppUtils(this.router, this._masterService);
    this.item = new Retenciones();
  }



  print(event): void {

    //oretencionesCompradorFormularioComponent.item.moneda_txt = $("#moneda option:selected").text();
    //oretencionesCompradorFormularioComponent.item.estado = $("#estadoComprador option:selected").text();
    setTimeout(function () {
      $("div#print-section-has").printArea({ popTitle: 'RETENCIONES', mode: "iframe", popClose: false });
    }, 200);

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
      
      this.util.listEstadoRetencion(function (data: ComboItem[]) {
  
        oretencionesProveedorFormularioComponent.listEstadoCombo = data;
      });

      oretencionesProveedorFormularioComponent = this;
     //this.atributos = [];
  }
    


  ngAfterViewInit() {


    this._dataService
      .obtener(this.id)
      .subscribe(
      p => {

        this.item = p;
        console.log(this.item);
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


          dtRetencionDetalle.ajax.reload();
        }, 100);




      },
      e => console.log(e),
      () => { });


    dtRetencionDetalle = $('#dtRetencionDetalle').DataTable({
      footerCallback: function (row, data, start, end, display) {
       
        /*var total = 0;
        data.forEach(element => {
          if (element.es_subitem == false){
           
            total = total + parseFloat(element.valorrecibido.replace(',',''));
          }
        });
        var api = this.api(), data;

        //oretencionesCompradorFormularioComponent.item.total = DatatableFunctions.FormatNumber(total);
        //$(api.column(8).footer()).html(
        //  oretencionesCompradorFormularioComponent.item.total
        );*/
      },
      "order": [[1, "asc"]],
      "ajax": function (data, callback, settings) {


        console.log('**************************************');
        console.log('**************************************');
        console.log(oretencionesProveedorFormularioComponent.item.detalle);
        console.log('**************************************');
        console.log('**************************************');

        let result = {
          data: oretencionesProveedorFormularioComponent.item.detalle

        };
        callback(result);
      },
     
      "createdRow": function (row, data, index) {
        
  
                  //$(row).attr('parentid', data.parentid);
                  $('td', row).eq(0).addClass('text-center');
        
              },
      columns: [

/*
        dfechadocumento
        ditemretencion
        dmoneda
        dmontoorigen
        dmontopago
        dmontoretenido
        dnrodocerpitem
        dnumerodocumento
        dseriedocumento
        dtipodocumento
        
        */
        //{ data: 'nroitem' },
     //   { data: 'tipo' },
       // { data: 'serie' },
       { data: 'ditemretencion' },
       { data: 'dtipodocumento' },
       { data: 'dseriedocumento' },
        { data: 'dnumerodocumento' },
        { data: 'dfechadocumento' },
        { data: 'dmoneda' },
       // { data: 'imptoperacion' },
       { data: 'dmontoorigen' },
        { data: 'dmontopago' },
        { data: 'dmontoretenido' },
        { data: 'dvcnrodocerpitem' },   
     //   { data: 'nroerpcliente' },
      ],
      columnDefs: [
        { "className": "text-center", "targets": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
/*
        {
          render: function (data, type, row) {
            return row.nroitem;
          },
          targets: 8,
        },
        {
          render: function (data, type, row) {
            return row.valorrecibido;
          },
          targets: 6
        }
        */
      ]
    });





  }


}