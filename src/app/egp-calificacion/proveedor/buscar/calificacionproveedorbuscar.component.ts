import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';



import { CalificacionBuscar, CalificacionFiltros } from '../../../model/calificacion';

import { AppUtils } from "../../../utils/app.utils";
import { MasterService } from '../../../service/masterservice';
import { ComboItem } from "app/model/comboitem";


declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];

}
declare var $: any;
declare var DatatableFunctions: any;
var oCalificacionProveedorBuscarComponent;
var datatable;
@Component({
  moduleId: module.id,
  selector: 'calificacionproveedorbuscar-cmp',
  templateUrl: 'calificacionproveedorbuscar.component.html',
  providers: [MasterService]
})

export class CalificacionProveedorBuscarComponent implements OnInit, AfterViewInit {
  util: AppUtils;
  public listEntidadCompradoraCombo: ComboItem[];
  public resultados: CalificacionBuscar[];
  public filtro: CalificacionFiltros;

  public navigate(nav) {

    this.router.navigate(nav, { relativeTo: this.route });
  }
  constructor(private router: Router, private route: ActivatedRoute, private _masterService: MasterService) {
    this.util = new AppUtils(this.router, this._masterService);
  }
  clicked(event) {

    datatable.ajax.reload();
    //datatable.ajax.url( "http://b2miningdata.com/rfqp/v1/rfqproveedor/v1/listvm/1" ).load();
    event.preventDefault();
  }




  ngOnInit() {

    

    this.listEntidadCompradoraCombo = [
      {
        valor: "1",
        desc: "Minsa"
      },
      {
        valor: "2",
        desc: "Adinelsa"
      },
      {
        valor: "3",
        desc: "Municipalidad de Miraflores"
      }
    ];
    
    this.filtro = {

      rucdni: '',
      razonsocial: '',
      nrooc: '',
      entidadcompradora: '',
    }
    this.resultados = [
      {
        rucdni: "4590015491",
        razonsocial: 'CPP',
        calificacion: 3,
        id: 1,
      },

      {
        rucdni: "4590015490",
        razonsocial: '3M',
        calificacion: 2,
        id: 2,
      },


      {
        rucdni: "4590015493",
        razonsocial: 'Pintado de Edificio S.A.C',
        calificacion: 4,
        id: 2,
      },
    ];
    
    oCalificacionProveedorBuscarComponent = this;
  }

  ngAfterViewInit() {


    cargarDataTable();
    DatatableFunctions.registerCheckAll();

  }


}

function cargarDataTable() {

  datatable = $('#dtResultados').on('init.dt', function (e, settings, json) {
    DatatableFunctions.initDatatable(e, settings, json, datatable);
  }).DataTable({
    order: [[1, "desc"]],
    /* ajax: {
       "url": "https://jsonplaceholder.typicode.com/posts",
       "dataSrc": ""
     },*/

    "ajax": function (data, callback, settings) {
      
      let result = {
        data: oCalificacionProveedorBuscarComponent.resultados

      };
      
      callback(
        result
      );
    },
    columns: [
    {data: 'id'},
      { data: 'rucdni' },
      { data: 'razonsocial' },
      { data: 'calificacion' },
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
    
          let starts = "";
          for(var xI=0;xI<row.calificacion;xI++){
            starts += '<i class="material-icons">star</i>';
          }
          
          for(var xI=0;xI<(5-row.calificacion);xI++){
            starts += '<i class="material-icons">star_border</i>';
          }
          
          return '<div>' + starts + '</div>';
        },

        targets: 3
      },
      {

        render: function (data, type, row) {

          //return data +' ('+ row[3]+')';
          return '<div class="text-center"><a href="/egp-calificacion/proveedor/formulario/' + row.id + '" id="' + row.id + '">' +
            '<button class="btn btn-simple btn-info btn-icon edit" rel="tooltip" title="Ver/Editar" data-placement="left">' +
            '<i class="material-icons">visibility</i></button></a>' +
            '</div>';
        },
        targets: 4
      }
    ]
  });


  datatable.on('click', '.edit', function (event) {
    var $tr = $(this).closest('tr');

    var data = datatable.row($tr).data();
    //console.log("click edit", event);
    let id = $tr.find("a").attr('id');

    //console.log("click edit", oCalificacionProveedorBuscarComponent);
    let nav = ['/egp-calificacion/proveedor/formulario', id];

    oCalificacionProveedorBuscarComponent.navigate(nav);
    event.preventDefault();

  });



}



