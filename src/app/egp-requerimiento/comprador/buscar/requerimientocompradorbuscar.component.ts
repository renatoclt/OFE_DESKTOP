import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RFQCompradorService } from 'app/service/egp-rfqcompradorservice';
import { RFQCompradoBuscar } from 'app/model/egp-rfqcomprador';
import { AppUtils } from "app/utils/app.utils";
import { MasterService } from 'app/service/masterservice';
import { ComboItem } from "app/model/comboitem";

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];

}
declare var $: any;
declare var DatatableFunctions: any;
var oRequerimientoCompradorBuscarComponent, datatable;
@Component({
  moduleId: module.id,
  selector: 'requerimientocompradorbuscar-cmp',
  templateUrl: 'requerimientocompradorbuscar.component.html',
  providers: [MasterService]
})

export class RequerimientoCompradorBuscarComponent implements OnInit, AfterViewInit {
  util: AppUtils;
  public listEstadoCombo: ComboItem[];
  public resultados: any[];

  public navigate(nav) {

    this.router.navigate(nav, { relativeTo: this.route });
  }
  constructor(private router: Router, private route: ActivatedRoute, private _masterService: MasterService) {
    this.util = new AppUtils(this.router, this._masterService);
  }
  clicked(event) {

    event.preventDefault();

    datatable.ajax.reload();

  }




  ngOnInit() {
    // Code for the Validator
    //this.buscar();
    $('.datepicker').datetimepicker({
      format: 'MM/DD/YYYY',
      icons: {
        time: "fa fa-clock-o",
        date: "fa fa-calendar",
        up: "fa fa-chevron-up",
        down: "fa fa-chevron-down",
        previous: 'fa fa-chevron-left',
        next: 'fa fa-chevron-right',
        today: 'fa fa-screenshot',
        clear: 'fa fa-trash',
        close: 'fa fa-remove',
        inline: true
      }
    });
    oRequerimientoCompradorBuscarComponent = this;

    this.util.listEstadosRFQ(function (data: ComboItem[]) {
      oRequerimientoCompradorBuscarComponent.listEstadoCombo = data;
    });

    this.resultados = [
      {

        nroreq: "002",
        descripcion: "Limpieza",
        estado: "Activa",
        fechacreacion: "07/11/2017",
        usuariocomprador: "Daniela Montoya",
        version: "1",
        cotizaciones: "2",

      },
      {

        nroreq: "003",
        descripcion: "Brochas",
        estado: "Activa",
        fechacreacion: "15/01/2018",
        usuariocomprador: "Juan lopez",
        version: "1",
        cotizaciones: "2",

      },
      {
        
                nroreq: "004",
                descripcion: "CINTA",
                estado: "Activa",
                fechacreacion: "01/02/2018",
                usuariocomprador: "Gabriela Mendez",
                version: "1",
                cotizaciones: "2",
        
              },
              {
                
                    nroreq: "005",
                        descripcion: "pintado de edificio Institucional",
                        estado: "Activa",
                        fechacreacion: "19/02/2018",
                        usuariocomprador: "Juan Mendez",
                        version: "1",
                        cotizaciones: "1",
                
                      },


    ];
    
  }

  ngAfterViewInit() {


    cargarDataTable();
    DatatableFunctions.registerCheckAll();
  }


}

function cargarDataTable() {
  //$.fn.dataTable.ext.errMode = 'throw';
  datatable = $('#dtResultados').on('init.dt', function (e, settings, json) {
    DatatableFunctions.initDatatable(e, settings, json, datatable);
  }).DataTable({

    /*ajax: {
      "url": "http://b2miningdata.com/rfqc/v1/rfqcomprador/v1/listvm/1",
      "dataSrc": ""
    },*/
    ajax: function (data, callback, settings) {
      let result = {
        data: oRequerimientoCompradorBuscarComponent.resultados

      };
      callback(
        result
      );
    },
    columns: [
      { data: 'nroreq' },
      { data: 'descripcion' },
      { data: 'estado' },
      { data: 'fechacreacion' },
      { data: 'usuariocomprador' },
      { data: 'version' },
      { data: 'cotizaciones' },
      
    ],
    columnDefs: [
      {
        render: function (data, type, row) {
          return '<div class="text-right" height="100%"><div class="checkbox text-right"><label><input type="checkbox" name="optionsCheckboxes"></label></div></div>';
        },
        targets: 0
      },
      {

        render: function (data, type, row) {
          return '<div class="text-center"><a class="buscar-propuesta" href="/egp-cotizacion/comprador/buscar" row-id="' + row.nroreq + '">' +
            row.cotizaciones + '</a></div>';
        },
        targets: 7
      },
      {

        render: function (data, type, row) {
          return '<div class="text-center"><a class="editar" href="/egp-requerimiento/comprador/formulario/' + row.nroreq + '" row-id="' + row.nroreq + '">' +
            '<button class="btn btn-simple btn-info btn-icon edit" rel="tooltip" title="Ver/Editar" data-placement="left">' +
            '<i class="material-icons">visibility</i></button></a>' +
            '<button class="btn btn-simple btn-danger btn-icon remove" rel="tooltip" title="Eliminar" data-placement="left">' +
            '<i class="material-icons">delete</i>' +
            '</button></div>';
        },
        targets: 8
      }
    ]
  });

  datatable.on('click', '.edit', function (event) {
    var $tr = $(this).closest('tr');



    let row_id = $tr.find("a.editar").attr('row-id');
    let nav = ['/egp-requerimiento/comprador/formulario', row_id];

    oRequerimientoCompradorBuscarComponent.navigate(nav);
    event.preventDefault();

  });

  



}



