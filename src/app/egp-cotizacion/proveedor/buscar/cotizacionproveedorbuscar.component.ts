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
var oCotizacionProveedorBuscarComponent;
@Component({
  moduleId: module.id,
  selector: 'cotizacionproveedorbuscar-cmp',
  templateUrl: 'cotizacionproveedorbuscar.component.html',
  providers: [MasterService]
})
export class CotizacionProveedorBuscarComponent implements OnInit, AfterViewInit {
  public dtSolicitudCotizacion: DataTable;

  public resultados: any[];
  util: AppUtils;
  public navigate(nav) {

    this.router.navigate(nav, { relativeTo: this.route });
  }
  constructor(private router: Router, private route: ActivatedRoute, private _masterService: MasterService) {
    this.util = new AppUtils(this.router, this._masterService);
  }
  ngOnInit() {
    // Code for the Validator

    oCotizacionProveedorBuscarComponent = this;

    this.resultados = [
      {
        nrocotizacion: "00000000001",
        nroreq: "00001",
        orgcompradora: "PROVIAS",
        usuariocompradora: "Jose R.",
        estado: "Activo",
        version: "1",
        fechacreacion: "01/01/2018",
        oc: "000000004",
      },
      {
        nrocotizacion: "00000000002",
        nroreq: "00002",
        orgcompradora: "PROVIAS",
        usuariocompradora: "Carlo P.",
        estado: "Anulado",
        version: "1",
        fechacreacion: "1/02/2018",
        oc: "000000003",
      },
      {
        nrocotizacion: "00000000003",
        nroreq: "00003",
        orgcompradora: "PROVIAS",
        usuariocompradora: "Andres I.",
        estado: "Activo",
        version: "1",
        fechacreacion: "03/02/2018",
        oc: "000000002",
      },
      {
        nrocotizacion: "00000000004",
        nroreq: "00003",
        orgcompradora: "PROVIAS",
        usuariocompradora: "Jose R.",
        estado: "Activo",
        version: "1",
        fechacreacion: "1/02/2018",
        oc: "000000001",
      },
    ];

    this.dtSolicitudCotizacion = {
      headerRow: ['N° Cotización', 'N° Req.', 'Organización Compradora', 'Usuario Comprador', 'Estado', 'Versión', 'Fecha Creación', 'OC', 'Acciones'],
      footerRow: ['N° Cotización', 'N° Req.', 'Organización Compradora', 'Usuario Comprador', 'Estado', 'Versión', 'Fecha Creación', 'OC', 'Acciones'],

      dataRows: [
        ['00001', '00001', '3M', 'Jose R.', 'Activo', '1', '19/02/2019', 'Xavi C.', '', ''],
        ['00001', '00001', 'CPP', 'Carlo P.', 'Anulado', '1', '05/06/2017', 'Luis Q.', '', ''],
        ['00001', '00001', 'Claro', 'Andres I.', 'Activo', '1', '12/06/2017', 'Jose B.', '', ''],
      ]
    };
  }

  ngAfterViewInit() {

    var datatable = $('#dtResultados').DataTable({
      order: [[1, "asc"]],
      /* ajax: {
         "url": "https://jsonplaceholder.typicode.com/posts",
         "dataSrc": ""
       },*/

      "ajax": function (data, callback, settings) {


        let result = {
          data: oCotizacionProveedorBuscarComponent.resultados

        };
        callback(
          result
        );
      },
      columns: [

        { data: 'nrocotizacion' },
        { data: 'nroreq' },
        { data: 'orgcompradora' },
        { data: 'usuariocompradora' },
        { data: 'estado' },
        { data: 'version' },
        { data: 'fechacreacion' },
        { data: 'oc' },
        { data: 'nrocotizacion' }
      ],
      columnDefs: [
        {
          render: function (data, type, row) {
            return '<div class="text-center"><a href="/egp-cotizacion/proveedor/formulario/' + row.nrocotizacion + '" row-id="' + row.nrocotizacion + '">' +
              '<button class="btn btn-simple btn-info btn-icon edit" rel="tooltip" title="Ver/Editar" data-placement="left">' +
              '<i class="material-icons">visibility</i></button></a></div>';
          },
          targets: 8
        }
      ]

    });

    


    datatable.on('click', '.edit', function (event) {
      var $tr = $(this).closest('tr');

      let row_id = $tr.find("a").attr('row-id');


      let nav = ['/egp-cotizacion/proveedor/formulario', row_id];

      oCotizacionProveedorBuscarComponent.navigate(nav);
      event.preventDefault();

    });


  }
}
