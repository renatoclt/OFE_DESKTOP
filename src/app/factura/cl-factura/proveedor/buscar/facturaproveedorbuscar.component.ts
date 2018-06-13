import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FacturaBuscar, FacturaFiltros } from 'app/model/factura';
import { AppUtils } from "app/utils/app.utils";
import { MasterService } from 'app/service/masterservice';
import { FacturaService } from 'app/service/facturaservice';

import { URL_BUSCAR_CP, URL_BUSCAR_CP_BORRADOR } from 'app/utils/app.constants';
import { ComboItem } from "app/model/comboitem";
import { Boton } from 'app/model/menu';
import { ChangeDetectorRef } from '@angular/core';
import { LoginService } from 'app/service/login.service';
declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}
declare var $, swal: any;
declare var DatatableFunctions: any;

var oFacturaBuscarComponent: FacturaProveedorBuscarComponent, datatable;
@Component({
    moduleId: module.id,
    selector: 'facturaproveedorbuscar-cmp',
    templateUrl: 'facturaproveedorbuscar.component.html',
    providers: [MasterService, FacturaService]
})


export class FacturaProveedorBuscarComponent implements OnInit, AfterViewInit {
  public dtGuia: DataTable;
  public resultados: FacturaBuscar[];
  public filtro: FacturaFiltros;
  util: AppUtils;

  public listEstadoCombo: ComboItem[];
  public listMonedaCombo: ComboItem[];
  public botonBuscar: Boton = new Boton();
  public botonDetalle: Boton = new Boton();
  public botonDescartar: Boton = new Boton();
  public botonRegistrar: Boton = new Boton();
  public url_main_module_page = '/cl-factura/proveedor/buscar';

  public navigate(nav) {

    this.router.navigate(nav, { relativeTo: this.route });
  }

  constructor(private cpService: FacturaService, private router: Router, private route: ActivatedRoute, private _masterService: MasterService, private _securityService: LoginService, private cdRef: ChangeDetectorRef) {
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
      this.botonDescartar = botones.find(a => a.nombre === 'descartarborrador') ? botones.find(a => a.nombre === 'descartarborrador') : this.botonDescartar;
      this.botonRegistrar = botones.find(a => a.nombre === 'registrarcomprobante') ? botones.find(a => a.nombre === 'registrarcomprobante') : this.botonRegistrar;

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

  async DescartarBorradoresAsincrono(checkboxGuias) {

    for (let checkboxGuia of checkboxGuias) {
      //oFacturaProveedorFormularioComponent.factura.detallefactura
      let id_borrador = $(checkboxGuia).val();
      let oc = await this.cpService
        .descartarBorrador(id_borrador).toPromise();

    }
  }
  async  DescartarBorradores(event) {
    event.preventDefault();
    let checkboxGuias = $('#dtResultados').find('.checkboxCP:checked');
    if (checkboxGuias.length <= 0) {
      swal({
        text: "Debe seleccionar un comprobante de pago.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
      return false;
    }

    swal({
      html: '¿Está seguro de descartar los comprobantes de pagos seleccionados?',
      type: "warning",
      //html: true,
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-default",
      cancelButtonClass: "btn btn-warning",
    }).then(
      function () {


        oFacturaBuscarComponent.DescartarBorradoresAsincrono(checkboxGuias);



        setTimeout(function () {

          datatable.ajax.reload();
          swal({
            text: "Se descartó los comprobantes de pagos seleccionados.",
            type: 'success',
            buttonsStyling: false,
            confirmButtonClass: "btn btn-success"
          });

        }, 1000);





      },
      function (dismiss) {
      })




  }


  clicked(event) {
    if (this.validarfiltros()) {

      if (this.filtro.publicada)

        datatable.ajax.url(URL_BUSCAR_CP).load();
      else
        datatable.ajax.url(URL_BUSCAR_CP_BORRADOR).load();
    }

    if(event)
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

    if(event)
      event.preventDefault();
  }

      filtroDefecto() {
        let fechacreacioni = new Date();
        fechacreacioni.setMonth(fechacreacioni.getMonth() - 1);
        this.filtro = {
          nrocomprobantepago: '',
          razonsocialcliente: '',
          ruccliente: '',
          estado: 'NONE',
          moneda: 'NONE',
          fechaemisioninicio: fechacreacioni,
          fechaemisionfin: new Date(),
          tipoemisionfisico: true,
          tipoemisionelectronico: true,
          publicada: true,
        }
      }

      ngOnInit() {
        oFacturaBuscarComponent = this;
        this.filtroDefecto();
        this.util.listMonedas(function (data: ComboItem[]) {
          oFacturaBuscarComponent.listMonedaCombo = data;
        });

        this.util.listEstadoCP(function (data: ComboItem[]) {

          data = data.filter(a => a.valor != 'CBORR');
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

function cargarDataTable() {
        let url = URL_BUSCAR_CP_BORRADOR;
        if (oFacturaBuscarComponent.filtro.publicada)
          url = URL_BUSCAR_CP;
        datatable = $('#dtResultados')
          .on('init.dt', function (e, settings, json) {
            DatatableFunctions.initDatatable(e, settings, json, datatable);
          })
          .DataTable({
            order: [[8, "desc"]],
            searching: false,
            serverSide: true,
            ajax: {

              beforeSend: function (request) {
                if (!oFacturaBuscarComponent.util.tokenValid()) {
                  return;
                };
                request.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('access_token'));
                request.setRequestHeader("origen_datos", 'PEB2M');
                request.setRequestHeader("tipo_empresa", 'P');
                request.setRequestHeader("org_id", localStorage.getItem('org_id'));
                request.setRequestHeader("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
              },
              url: url,

              dataSrc: "data",
              data: function (d) {

                if (oFacturaBuscarComponent.filtro.nrocomprobantepago != "") {
                  d.NumeroFactura = oFacturaBuscarComponent.filtro.nrocomprobantepago;
                }

                if (oFacturaBuscarComponent.filtro.razonsocialcliente != "") {
                  d.RazonSocialComprador = oFacturaBuscarComponent.filtro.razonsocialcliente;
                }

                if (oFacturaBuscarComponent.filtro.ruccliente != "") {
                  d.RucCliente = oFacturaBuscarComponent.filtro.ruccliente;
                }

                if (oFacturaBuscarComponent.filtro.estado != "NONE") {
                  d.Estado = oFacturaBuscarComponent.filtro.estado;
                }

                if (oFacturaBuscarComponent.filtro.moneda != "NONE"){
                  d.Moneda = oFacturaBuscarComponent.filtro.moneda;
                }

                if (oFacturaBuscarComponent.filtro.fechaemisioninicio) {
                  let fechacreacioninicio = DatatableFunctions.ConvertStringToDatetime(oFacturaBuscarComponent.filtro.fechaemisioninicio);
                  d.FechaEmision_inicio = DatatableFunctions.FormatDatetimeForMicroService(fechacreacioninicio);
                }

                if (oFacturaBuscarComponent.filtro.fechaemisionfin) {

                  let fechacreacionfin = DatatableFunctions.AddDayEndDatetime(DatatableFunctions.ConvertStringToDatetime(oFacturaBuscarComponent.filtro.fechaemisionfin));
                  d.FechaEmision_fin = DatatableFunctions.FormatDatetimeForMicroService(fechacreacionfin);
                }


                d.column_names = 'IdComprobante,NumeroFactura,RazonSocialProveedor,TipoComprobante,DocumentoErp,FormaPago,Total,Moneda,Estado,FechaEmision,FechaProgramadaPago,FechaPago,Observaciones,ObservacionesPago,RazonSocialCliente,MotivoRechazoSAP,MotivoErrorSAP';
                //d.column_names = 'IdComprobante,NumeroFactura,RazonSocialProveedor,TipoComprobante,DocumentoErp,FormaPago,Total,Moneda,Estado,FechaEmision,FechaProgramadaPago,FechaPago,Observaciones,ObservacionesPago,RazonSocialCliente';
                if (!oFacturaBuscarComponent.filtro.publicada)
                  d.column_names = '[NumeroFactura,RazonSocialProveedor,RazonSocialCliente,TipoComprobante,DocumentoErp,FormaPago,Total,Moneda,Estado,FechaEmision,FechaProgramadaPago,FechaPago,Observaciones,ObservacionesPago]';
              }
            },

            columns: [

              { data: 'NumeroFactura', name: 'NumeroFactura' },
              { data: 'NumeroFactura', name: 'NumeroFactura' },
              { data: 'RazonSocialCliente', name: 'RazonSocialCliente' },
              { data: 'TipoComprobante', name: 'TipoComprobante' },
              { data: 'NumeroFactura', name: 'NumeroFactura' },
              { data: 'FormaPago', name: 'FormaPago' },
              { data: 'Total', name: 'Total' },
              { data: 'Estado', name: 'Estado' },
              { data: 'FechaEmision', name: 'FechaEmision' },
              { data: 'FechaProgramadaPago', name: 'FechaProgramadaPago', visible: false },
              { data: 'FechaPago', name: 'FechaPago' },
              { data: 'NumeroFactura', name: 'Nota' },
              { data: 'NumeroFactura', name: 'NumeroFactura' },
            ],
            columnDefs: [
              { "className": "text-center", "targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
              {

                render: function (data, type, row) {

                  //return data +' ('+ row[3]+')';
                  return '<div class="text-right" height="100%"><div class="checkbox text-right"><label><input class="checkboxCP" type="checkbox" value="' + row.IdComprobante + '"  name="optionsCheckboxes"></label></div></div>';
                },
                targets: 0
              },
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
                  targets: 4
              },
              {
                  render: function (data, type, row) {
                    //return data +' ('+ row[3]+')';
                    return row.Moneda + ' ' + DatatableFunctions.FormatNumber(row.Total);
                  },
                  targets: 6
              },
              {
                  render: function (data, type, row) {
                      let esBorrador = oFacturaBuscarComponent.filtro.publicada ? '0' : '1';
                      let title = "Ver/Editar";
                      if (oFacturaBuscarComponent.filtro.publicada)
                        title = "Ver";
                      //return data +' ('+ row[3]+')';

                      let disabled = '';
                      let formularioDetalle = esBorrador=='1'?'formulario-pre':'formulario-pub';
                      let href = 'href="/cl-factura/proveedor/'+formularioDetalle+'/' + row.IdComprobante + '"';
                      if (!oFacturaBuscarComponent.botonDetalle.habilitado) {
                        disabled = 'disabled';
                        href = '';
                      }
                      return '<div class="text-center"><a class="editar" ' + href + ' row-id="' + row.IdComprobante + '" esBorrador="' + esBorrador + '" id_doc="' + row.id_doc + '">' +
                        '<button class="btn btn-simple btn-info btn-icon edit" rel="tooltip" title="' + title + '" data-placement="left" ' + disabled + '><i class="material-icons">visibility</i></button></a>' +
                        '</div>';
                  },
                  targets: 12
              },
              {
                  render: function (data, type, row) {
                    return '<a data-toggle="modal" class="observaciones" data-target="#mdlObservaciones" style="cursor:hand">Observaciones</a>';
                  },
                  targets: 11
              }
            ],
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
                let esBorrador = $tr.find("a.editar").attr('esBorrador');
                let id_doc = $tr.find("a.editar").attr('id_doc');
                let formularioDetalle = esBorrador=='1'?'formulario-pre':'formulario-pub';

                let nav = ['/cl-factura/proveedor/'+formularioDetalle, row_id, { b: esBorrador, c: id_doc }];
                oFacturaBuscarComponent.navigate(nav);
            }
            event.preventDefault();

          });

}

function cargarObservaciones(Observaciones, ObservacionesPago) {
  $('#mdlObservaciones .modal-body').html(Observaciones);
}