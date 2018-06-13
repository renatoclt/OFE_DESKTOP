import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppUtils } from "../../../utils/app.utils";
import { MasterService } from '../../../service/masterservice';
declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}
declare var $: any;
declare var DatatableFunctions: any;
var oRequerimientoProveedorBuscarComponent, datatable;
var datatable;
@Component({
  moduleId: module.id,
  selector: 'requerimientoproveedorbuscar-cmp',
  templateUrl: 'requerimientoproveedorbuscar.component.html',
})
export class RequerimientoProveedorBuscarComponent implements OnInit, AfterViewInit {
  public dtResultados: DataTable;
  //public filtro: ;
  public resultados: any[];
  constructor(private router: Router, private route: ActivatedRoute, private _masterService: MasterService) {
    //this.util = new AppUtils(this.router, this._masterService);
  }
  public navigate(nav) {

    this.router.navigate(nav, { relativeTo: this.route });
  }
   clicked(event) {

    event.preventDefault();

    /*$('#dtResultados').dataTable().fnDestroy();
    cargarDataTable();*/

     //datatable.ajax.reload();

    datatable.ajax.url( "http://b2miningdata.com/rfqp/v1/rfqproveedor/v1/listvm/1" ).load();
  }


  ngOnInit() {
    // Code for the Validator

    
    oRequerimientoProveedorBuscarComponent = this;

    this.resultados = [
      {
        nroreq: "0001",
        orgcompradora: "PROVIAS",
        usuariocompradora: "Jose R.",
        estado: "Activo",
        fechacreacion: "19/02/2018",
        vendedor: "Juan Mendez",
        version: "1",
      },
    ];

  }

  ngAfterViewInit() {

    cargarDataTable();
  }
}
function cargarDataTable() {

  var datatable = $('#dtResultados').DataTable({
    order: [[1, "asc"]],
    /* ajax: {
       "url": "https://jsonplaceholder.typicode.com/posts",
       "dataSrc": ""
     },*/

     "ajax": function (data, callback, settings) {


      let result = {
        data: oRequerimientoProveedorBuscarComponent.resultados

      };
      callback(
        result
      );
    },
    columns: [

      { data: 'nroreq' },
      { data: 'orgcompradora' },
      { data: 'usuariocompradora' },
      { data: 'estado' },
      { data: 'fechacreacion' },
      { data: 'vendedor' },
      { data: 'version' },
      { data: 'nrocotizacion' }
    ],
    columnDefs: [
      {
        render: function (data, type, row) {
          return '<div class="text-center"><a href="/egp-requerimiento/proveedor/formulario/' + row.nroreq+ '" nroreq="' + row.nroreq + '">' +
          '<button class="btn btn-simple btn-info btn-icon edit" rel="tooltip" title="Ver/Editar" data-placement="left">' +
          '<i class="material-icons">visibility</i></button></a></div>'
        },
        targets: 7
      }
    ]

  });

  datatable.on('click', '.edit', function (event) {
    var $tr = $(this).closest('tr');

    let nroreq = $tr.find("a").attr('nroreq');


    let nav = ['/egp-requerimiento/proveedor/formulario', nroreq];

    oRequerimientoProveedorBuscarComponent.navigate(nav);
    event.preventDefault();

  });

 

}