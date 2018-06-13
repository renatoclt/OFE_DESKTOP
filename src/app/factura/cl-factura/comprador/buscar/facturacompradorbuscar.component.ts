import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FacturaBuscar, FacturaFiltros } from 'app/model/factura';
import { AppUtils } from "app/utils/app.utils";
import { MasterService } from 'app/service/masterservice';
import { ComboItem } from "app/model/comboitem";
import { URL_BUSCAR_CP, URL_BUSCAR_CP_BORRADOR } from 'app/utils/app.constants';
import { Boton } from 'app/model/menu';
import { ChangeDetectorRef } from '@angular/core';
import { LoginService } from 'app/service/login.service';
declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}
declare var $: any;
declare var DatatableFunctions, swal: any;
var oFacturaBuscarComponent: FacturaCompradorBuscarComponent, datatable;

@Component({
  moduleId: module.id,
  selector: 'facturacompradorbuscar-cmp',
  templateUrl: 'facturacompradorbuscar.component.html',
  providers: [MasterService]
})

export class FacturaCompradorBuscarComponent implements OnInit, AfterViewInit {
  public dtGuia: DataTable;
  public resultados: FacturaBuscar[];
  public filtro: FacturaFiltros;
  util: AppUtils;
  public listEstadoCombo: ComboItem[];
  public listMonedaCombo: ComboItem[];
  public botonBuscar: Boton = new Boton();
  public botonDetalle: Boton = new Boton();
  public url_main_module_page = '/cl-factura/comprador/buscar';
  public navigate(nav) {
    this.router.navigate(nav, { relativeTo: this.route });
  }

  constructor(private router: Router, private route: ActivatedRoute, private _masterService: MasterService, private _securityService: LoginService, private cdRef: ChangeDetectorRef) {

    this.util = new AppUtils(this.router, this._masterService);
  }

  obtenerBotones() {

    let botones = this._securityService.ObtenerBotonesCache(this.url_main_module_page) as Boton[];
    if (botones) {

      this.configurarBotones(botones);
    }
    else {

      this._securityService.obtenerBotones(this.url_main_module_page).subscribe(
        botones => {

          oFacturaBuscarComponent.configurarBotones(botones);
          oFacturaBuscarComponent._securityService.guardarBotonesLocalStore(this.url_main_module_page, botones);
        },
        e => console.log(e),
        () => { });

    }

  }

  configurarBotones(botones: Boton[]) {

    if (botones && botones.length > 0) {
      this.botonBuscar = botones.find(a => a.nombre === 'buscar') ? botones.find(a => a.nombre === 'buscar') : this.botonBuscar;
      this.botonDetalle = botones.find(a => a.nombre === 'detalle') ? botones.find(a => a.nombre === 'detalle') : this.botonDetalle;

    }

  }

  validarfiltros() {


    if (this.filtro.fechaemisioninicio != null && this.filtro.fechaemisioninicio.toString() != "" && this.filtro.fechaemisionfin != null && this.filtro.fechaemisionfin.toString() != "") {
      let fechacreacioninicio = DatatableFunctions.ConvertStringToDatetime(oFacturaBuscarComponent.filtro.fechaemisioninicio);
      let fechacreacionfin = DatatableFunctions.ConvertStringToDatetime(oFacturaBuscarComponent.filtro.fechaemisionfin);
      let fechacreacioninicio_str = DatatableFunctions.FormatDatetimeForMicroService(fechacreacioninicio);
      let fechacreacionfin_str = DatatableFunctions.FormatDatetimeForMicroService(fechacreacionfin);

      if (fechacreacioninicio_str > fechacreacionfin_str) {
        swal({
          text: "El rango de Fechas de creación seleccionado no es correcto.",
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: "btn btn-warning"
        });

        return false;
      }
    }

    return true;
  }

  clicked(event) {
    if (this.validarfiltros())
      datatable.ajax.reload();

    event.preventDefault();
  }

  limpiar(event) {

    this.filtroDefecto();
    setTimeout(function () {
      $("input").each(function () {
        if (!$(this).val() && $(this).val() == '')
          $(this.parentElement).addClass("is-empty");
      });


    }, 200);

    event.preventDefault();
  }

  filtroDefecto() {
    let fechacreacioni = new Date();
    fechacreacioni.setMonth(fechacreacioni.getMonth() - 1);
    this.filtro = {
      nrocomprobantepago: '',
      razonsocialproveedor: '',
      rucproveedor: '',
      estado: 'NONE',
      moneda: 'NONE',
      fechaemisioninicio: fechacreacioni,
      fechaemisionfin: new Date(),
      tipoemisionfisico: true,
      tipoemisionelectronico: true,
    }
  }

  ngOnInit() {

    oFacturaBuscarComponent = this;
    this.filtroDefecto();
    this.util.listMonedas(function (data: ComboItem[]) {
      oFacturaBuscarComponent.listMonedaCombo = data;
    });

    this.util.listEstadoCP(function (data: ComboItem[]) {
      oFacturaBuscarComponent.listEstadoCombo = data;
    });

  }

  ngAfterViewInit() {
    cargarDataTable();
    DatatableFunctions.registerCheckAll();
    this.obtenerBotones();
  }

  ngAfterViewChecked() {

    this.cdRef.detectChanges();
  }

}

//  request.setRequestHeader("origen_datos", 'PEB2M');
function cargarDataTable() {

  datatable = $('#dtResultados').on('init.dt', function (e, settings, json) {
    DatatableFunctions.initDatatable(e, settings, json, datatable);
  }).DataTable({
    order: [[7, "desc"]],
    searching: false,
    serverSide: true,
    ajax: {

      beforeSend: function (request) {
        if (!oFacturaBuscarComponent.util.tokenValid()) {
          return;
        };
        request.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('access_token'));
        request.setRequestHeader("origen_datos", 'PEB2M');
        request.setRequestHeader("tipo_empresa", 'C');
        request.setRequestHeader("org_id", localStorage.getItem('org_id'));
        request.setRequestHeader("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
      },
      url: URL_BUSCAR_CP,


      dataSrc: "data",
      data: function (d) {

        if (oFacturaBuscarComponent.filtro.nrocomprobantepago != "") {
          d.NumeroFactura = oFacturaBuscarComponent.filtro.nrocomprobantepago;
        }
        if (oFacturaBuscarComponent.filtro.razonsocialproveedor != "") {
          d.RazonSocialProveedor = oFacturaBuscarComponent.filtro.razonsocialproveedor;
        }

        if (oFacturaBuscarComponent.filtro.rucproveedor != "") {
          d.RucProveedor = oFacturaBuscarComponent.filtro.rucproveedor;
        }

        if (oFacturaBuscarComponent.filtro.estado != "NONE") {
          d.Estado = oFacturaBuscarComponent.filtro.estado;
        }
        if (oFacturaBuscarComponent.filtro.moneda != "NONE")
          d.Moneda = oFacturaBuscarComponent.filtro.moneda;


        if (oFacturaBuscarComponent.filtro.fechaemisioninicio) {

          let fechacreacioninicio = DatatableFunctions.ConvertStringToDatetime(oFacturaBuscarComponent.filtro.fechaemisioninicio);
          d.FechaEmision_inicio = DatatableFunctions.FormatDatetimeForMicroService(fechacreacioninicio);
        }

        if (oFacturaBuscarComponent.filtro.fechaemisionfin) {

          let fechacreacionfin = DatatableFunctions.AddDayEndDatetime(DatatableFunctions.ConvertStringToDatetime(oFacturaBuscarComponent.filtro.fechaemisionfin));
          d.FechaEmision_fin = DatatableFunctions.FormatDatetimeForMicroService(fechacreacionfin);
        }

        d.column_names = 'IdComprobante,NumeroFactura,RazonSocialProveedor,TipoComprobante,DocumentoErp,FormaPago,Total,Moneda,Estado,FechaEmision,FechaProgramadaPago,FechaPago,Observaciones,ObservacionesPago,MotivoRechazoSAP,MotivoErrorSAP';

      }
    },

    columns: [
      { data: 'NumeroFactura', name: 'NumeroFactura' },
      { data: 'RazonSocialProveedor', name: 'RazonSocialProveedor' },
      { data: 'TipoComprobante', name: 'TipoComprobante' },
      { data: 'DocumentoErp', name: 'DocumentoErp' },
      { data: 'FormaPago', name: 'FormaPago' },
      { data: 'Total', name: 'Total' },
      { data: 'Estado', name: 'Estado' },
      { data: 'FechaEmision', name: 'FechaEmision' },
      { data: 'FechaProgramadaPago', name: 'FechaProgramadaPago', visible: false }, //fechaprogramadapago
      { data: 'FechaPago', name: 'FechaPago' },//fechapago
      { data: 'NumeroFactura', name: 'Nota' },// notas
      { data: 'NumeroFactura', name: 'NumeroFactura' },
      { data: 'ObservacionesPago', name: 'ObservacionesPago', visible: false }, //fechaprogramadapago
      { data: 'Observaciones', name: 'Observaciones', visible: false }, //fechaprogramadapago
    ],
    columnDefs: [
      { "className": "text-center", "targets": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
      {
        render: function (data, type, row) {
          if(!((typeof row.MotivoRechazoSAP === "undefined") || (row.MotivoRechazoSAP.trim().length === 0)))
              return `<div class="text-center">
              <button class="btn btn-simple" style="color:red;" onclick='swal({ title:"Documento Rechazado", text: "`+row.MotivoRechazoSAP+`", buttonsStyling: false, confirmButtonClass: "btn btn-danger", confirmButtonColor: "#ec6c62"});'>Rechazo</button>
              </div>`;

          if(!((typeof row.MotivoErrorSAP === "undefined") || (row.MotivoErrorSAP.trim().length === 0)))          
              return `<div class="text-center">
              <button class="btn btn-simple" style="color:red;" onclick='swal({ title:"Error SAP", text: "`+row.MotivoErrorSAP+`", buttonsStyling: false, confirmButtonClass: "btn btn-danger", confirmButtonColor: "#ec6c62"});'>Error</button>
              </div>`;

          return row.DocumentoErp
        },
/*
        render: function (data, type, row) {

          //return data +' ('+ row[3]+')';
          return row.DocumentoErp ? row.DocumentoErp : '';
        },
*/         
        targets: 3
      },      
      {
        render: function (data, type, row) {
          //return data +' ('+ row[3]+')';
          return row.Moneda + ' ' + DatatableFunctions.FormatNumber(row.Total);
        },
        targets: 5
      },
      {
        render: function (data, type, row) {
          let disabled = '';
          let href = 'href="/cl-factura/comprador/formulario-pub/' + row.IdComprobante + '"';
          if (!oFacturaBuscarComponent.botonDetalle.habilitado) {
            disabled = 'disabled';
            href = '';
          }
          //return data +' ('+ row[3]+')';
          return '<div class="text-center"><a class="editar" ' + href + ' row-id="' + row.IdComprobante + '">' +
            '<button class="btn btn-simple btn-info btn-icon edit" rel="tooltip" title="Ver" data-placement="left" ' + disabled + '><i class="material-icons">visibility</i></button></a>' +
            '</div>';
        },
        targets: 11
      },
      {
        render: function (data, type, row) {
          return '<a data-toggle="modal" class="observaciones" data-target="#mdlObservaciones" style="cursor:hand">Observaciones</a>';
        },
        targets: 12
      }
    ]
  });

  datatable.on('click', '.observaciones', function (event) {
    var $tr = $(this).closest('tr');

    var data = datatable.row($tr).data();

    $("#mdlObservaciones_obs").html(data.Observaciones);
    $("#mdlObservaciones_obs_pago").html((data.ObservacionesPago == null ? "" : DatatableFunctions.ReplaceToken(data.ObservacionesPago)));

    event.preventDefault();

  });


  datatable.on('click', '.edit', function (event) {
    if (oFacturaBuscarComponent.botonDetalle.habilitado) {
      var $tr = $(this).closest('tr');

      var data = datatable.row($tr).data();
      console.log("click edit", event);
      let row_id = $tr.find("a.editar").attr('row-id');
      let nav = ['/cl-factura/comprador/formulario-pub', row_id];

      oFacturaBuscarComponent.navigate(nav);
    }
    event.preventDefault();

  });

 

}
