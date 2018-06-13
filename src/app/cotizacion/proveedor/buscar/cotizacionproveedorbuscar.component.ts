import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppUtils } from "../../../utils/app.utils";
import { MasterService } from '../../../service/masterservice';
import {BASE_URL} from 'app/utils/app.constants';
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
        nrocotizacion: "00000000001121",
        nroreq: "00001",
        orgcompradora: "CENTENARIO RETAIL S.A.C.",
        usuariocompradora: "Jose R.",
        estado: "Activo",
        version: "1",
        fechacreacion: "01/06/2017",
        oc: "000000001524",
      },
      {
        nrocotizacion: "00000000001122",
        nroreq: "00002",
        orgcompradora: "CENTENARIO RETAIL S.A.C.",
        usuariocompradora: "Carlo P.",
        estado: "Anulado",
        version: "1",
        fechacreacion: "09/06/2017",
        oc: "000000001564",
      },
      {
        nrocotizacion: "00000000001123",
        nroreq: "00003",
        orgcompradora: "CENTENARIO RETAIL S.A.C.",
        usuariocompradora: "Andres I.",
        estado: "Activo",
        version: "1",
        fechacreacion: "12/06/2017",
        oc: "000000001561",
      },
    ];

    this.dtSolicitudCotizacion = {
      headerRow: ['N° Cotización', 'N° Req.', 'Organización Compradora', 'Usuario Comprador', 'Estado', 'Versión', 'Fecha Creación', 'OC', 'Acciones'],
      footerRow: ['N° Cotización', 'N° Req.', 'Organización Compradora', 'Usuario Comprador', 'Estado', 'Versión', 'Fecha Creación', 'OC', 'Acciones'],

      dataRows: [
        ['00001', '00001', 'Minedu', 'Jose R.', 'Activo', '1', '01/06/2017', 'Xavi C.', '', ''],
        ['00001', '00001', 'Organizacion 2', 'Carlo P.', 'Anulado', '1', '05/06/2017', 'Luis Q.', '', ''],
        ['00001', '00001', 'Organizacion 3', 'Andres I.', 'Activo', '1', '12/06/2017', 'Jose B.', '', ''],
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
            return '<div class="text-center"><a href="/cotizacion/proveedor/formulario/' + row.nrocotizacion + '" row-id="' + row.nrocotizacion + '">' +
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


      let nav = ['/cotizacion/proveedor/formulario', row_id];

      oCotizacionProveedorBuscarComponent.navigate(nav);
      event.preventDefault();

    });


  }
}
