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
var oCotizacionCompradorBuscarComponent;
@Component({
  moduleId: module.id,
  selector: 'cotizacioncompradorbuscar-cmp',
  templateUrl: 'cotizacioncompradorbuscar.component.html',
  providers: [MasterService]
})
export class CotizacionCompradorBuscarComponent implements OnInit, AfterViewInit {
  
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
    oCotizacionCompradorBuscarComponent=this;
    
    this.resultados = [
      {
        nrocotizacion: "00000000001121",
        orgproveedora: "SODIMAC PERU S.A.",
        usuarioproveedor: "Jose R.",
        estado: "Activo",
        version: "1",
        fechacreacion: "01/06/2017",
        oc: "000000001524",
      },
      {
        nrocotizacion: "00000000001122",
        orgproveedora: "EMPRESA EDITORA EL COMERCIO SA",
        usuarioproveedor: "Carlo P.",
        estado: "Anulado",
        version: "1",
        fechacreacion: "09/06/2017",
        oc: "000000001564",
      },
      {
        nrocotizacion: "00000000001123",
        orgproveedora: "EMPRESA EDITORA EL COMERCIO SA",
        usuarioproveedor: "Andres I.",
        estado: "Activo",
        version: "1",
        fechacreacion: "12/06/2017",
        oc: "000000001561",
      },
    ];
   
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
          data: oCotizacionCompradorBuscarComponent.resultados

        };
        callback(
          result
        );
      },
      columns: [

        { data: 'nrocotizacion' },
        { data: 'orgproveedora' },
        { data: 'usuarioproveedor' },
        { data: 'estado' },
        { data: 'version' },
        { data: 'fechacreacion' },
        { data: 'oc' },
        { data: 'nrocotizacion' }
      ],
      columnDefs: [
        {
          render: function (data, type, row) {
            return '<div class="text-center"><a href="/egp-cotizacion/comprador/formulario/' + row.nrocotizacion + '" row-id="' + row.nrocotizacion + '">' +
              '<button class="btn btn-simple btn-info btn-icon edit" rel="tooltip" title="Ver/Editar" data-placement="left">' +
              '<i class="material-icons">visibility</i></button></a></div>';
          },
          targets: 7
        }
      ]

    });

   


    datatable.on('click', '.edit', function (event) {
      var $tr = $(this).closest('tr');
      
      let row_id = $tr.find("a").attr('row-id');


      let nav = ['/egp-cotizacion/comprador/formulario', row_id];

      oCotizacionCompradorBuscarComponent.navigate(nav);
      event.preventDefault();

    });


  }
}
