import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {BASE_URL} from 'app/utils/app.constants';
declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}
declare var $: any;
var oRequerimientoProveedorBuscarComponent;
var datatable;
@Component({
  moduleId: module.id,
  selector: 'requerimientoproveedorbuscar-cmp',
  templateUrl: 'requerimientoproveedorbuscar.component.html',
})
export class RequerimientoProveedorBuscarComponent implements OnInit, AfterViewInit {

  constructor(private router: Router, private route: ActivatedRoute) { }
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

    oRequerimientoProveedorBuscarComponent = this;

  }

  ngAfterViewInit() {

    cargarDataTable();
  }
}
function cargarDataTable() {

    datatable = $('#dtResultados').DataTable({
   
    ajax: {
      url: BASE_URL +"rfqp/v1/rfqproveedor/v1/listvm/1",
      "dataSrc": "",
       "data": function ( d ) {
                console.log(d);
                d.edison = "myValue";
                // d.custom = $('#myInput').val();
                // etc
            }
    },
    columns: [
      { data: 'nroreq' },
      { data: 'observacion' },
      { data: 'observacion' },
      { data: 'estado' },
      { data: 'fechacreacion' },
      { data: 'usuarioproveedor' },
      { data: 'version' },
      { data: 'nroreq' },

    ],
    columnDefs: [



      {
        // The `data` parameter refers to the data for the cell (defined by the
        // `data` option, which defaults to the column being worked with, in
        // this case `data: 0`.
        render: function (data, type, row) {

          //return data +' ('+ row[3]+')';
          return '<div class="text-center"><a class="editar" href="/requerimiento/proveedor/formulario/'+row.nroreq+'" row-id="'+row.nroreq+'">' +
            '<button class="btn btn-simple btn-info btn-icon edit" rel="tooltip" title="Ver/Editar" data-placement="left">' +
            '<i class="material-icons">visibility</i>' +
            '</button></div>';


        },
        targets: 7
      }
    ]
  });

  datatable.on('click', '.edit', function (event) {
    var $tr = $(this).closest('tr');

    let row_id=$tr.find( "a.editar" ).attr('row-id');   
    let nav = ['/requerimiento/proveedor/formulario', row_id];
    oRequerimientoProveedorBuscarComponent.navigate(nav);
    event.preventDefault();

  });

 

}
