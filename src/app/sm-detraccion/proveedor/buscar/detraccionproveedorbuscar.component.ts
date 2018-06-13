import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { DetraccionBuscar, DetraccionFiltros } from '../../../model/sm-detracciones';

import { AppUtils } from "../../../utils/app.utils";
import { MasterService } from '../../../service/masterservice';
import { ComboItem } from "app/model/comboitem";
import {URL_BUSCAR_DETRACCION} from 'app/utils/app.constants';
import { LoginService } from '../../../service/login.service';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];

}
declare var $, DatatableFunctions, swal, moment: any;
var oDetraccionProveedorBuscarComponent: DetraccionProveedorBuscarComponent;
var datatable;
@Component({
  moduleId: module.id,
  selector: 'DetraccionProveedorbuscar-cmp',
  templateUrl: './detraccionproveedorbuscar.component.html',
  providers: [MasterService]
})

export class DetraccionProveedorBuscarComponent implements OnInit, AfterViewInit {
  util: AppUtils;
  public listEstadoCombo: ComboItem[];
  public resultados: DetraccionBuscar[];
  public filtro: DetraccionFiltros;
  public url_main_module_page = '/sm-detraccion/proveedor/buscar';

  public navigate(nav) {

    this.router.navigate(nav, { relativeTo: this.route });
  }
  constructor(private router: Router, private route: ActivatedRoute, private _masterService: MasterService) {
    this.util = new AppUtils(this.router, this._masterService);
  }

  validarfiltros() {
    
        oDetraccionProveedorBuscarComponent.filtro.nrodetracciondesde = oDetraccionProveedorBuscarComponent.filtro.nrodetracciondesde.trim();
        
        oDetraccionProveedorBuscarComponent.filtro.nrodetraccionhasta = oDetraccionProveedorBuscarComponent.filtro.nrodetraccionhasta.trim();
    
        if (this.filtro.nrodetracciondesde == "") {
          if (this.filtro.fechapagoinicio == null || this.filtro.fechapagoinicio.toString() == "") {
            swal({
              text: "Fecha de Aceptación inicio es un campo requerido.",
              type: 'warning',
              buttonsStyling: false,
              confirmButtonClass: "btn btn-warning"
            });
            return false;
          }
          if (this.filtro.fechapagofin == null || this.filtro.fechapagofin.toString() == "") {
            swal({
              text: "Fecha de Aceptación fin es un campo requerido.",
              type: 'warning',
              buttonsStyling: false,
              confirmButtonClass: "btn btn-warning"
            });
            return false;
    
          }
    
          if (this.filtro.fechapagoinicio != null && this.filtro.fechapagoinicio.toString() != "" && this.filtro.fechapagofin != null && this.filtro.fechapagofin.toString() != "") {
            let fechaemisioninicio = DatatableFunctions.ConvertStringToDatetime(oDetraccionProveedorBuscarComponent.filtro.fechapagoinicio);
            let fechaemisionfin = DatatableFunctions.ConvertStringToDatetime(oDetraccionProveedorBuscarComponent.filtro.fechapagoinicio);
    
    
    
            if (moment(fechaemisionfin).diff(fechaemisioninicio, 'days') > 30) {
    
              swal({
                text: 'El filtro de búsqueda "Fecha de Aceptación" debe tener un rango máximo de 30 días entre la Fecha Inicial y la Fecha Fin.',
                type: 'warning',
                buttonsStyling: false,
                confirmButtonClass: "btn btn-warning"
              });
    
              return false;
            }
    
            let fechaemisioninicio_str = DatatableFunctions.FormatDatetimeForMicroService(fechaemisioninicio);
            let fechaemisionfin_str = DatatableFunctions.FormatDatetimeForMicroService(fechaemisionfin);
    
            if (fechaemisioninicio_str > fechaemisionfin_str) {
              swal({
                text: "El rango de Fechas de Aceptación seleccionado no es correcto. La Fecha Inicial es mayor a la Fecha Fin.",
                type: 'warning',
                buttonsStyling: false,
                confirmButtonClass: "btn btn-warning"
              });
    
              return false;
            }
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
    fechacreacioni.setDate(fechacreacioni.getDate() - 30);
    this.filtro = {

      nrodetracciondesde:'',
      nrodetraccionhasta:'',
      ruccompradora:'',
      nrofactura:'',
      estado:'NONE',
      fechapagoinicio:fechacreacioni,
      fechapagofin:new Date(),
    }
  }





  ngOnInit() {

    oDetraccionProveedorBuscarComponent = this;
    //PARA COLOCAR EL TIPO DE ESTADO TEGP QUE BUSCAR
    this.util.listEstadoHAS(function (data: ComboItem[]) {
      oDetraccionProveedorBuscarComponent.listEstadoCombo = data;
    });
    this.filtroDefecto();

  
  }

  ngAfterViewInit() {


    cargarDataTable();

  }


}

function filtrarResultados(item) {
  //

  /*if (oDetraccionCompradorBuscarComponent.filtro.nrodetracciondesde) {

    return item.nroretenciones.indexOf(oDetraccionCompradorBuscarComponent.filtro.NumDetraccionesDesde) >= 0;
  }
  else return true;*/
}

function cargarDataTable() {
  console.log("holaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  datatable = $('#dtResultados').DataTable({
    order: [[1, "asc"]],
    searching: false,
    serverSide: true,
    
    ajax: {

      beforeSend: function (request) {
        request.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('access_token'));
        request.setRequestHeader("origen_datos", 'PEB2M');
        request.setRequestHeader("tipo_empresa", 'C');
        request.setRequestHeader("org_id", localStorage.getItem('org_id'));
        request.setRequestHeader("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
      },
      url: URL_BUSCAR_DETRACCION,
      dataSrc: "data",
      data: function (d) {


        //alert(oDetraccionCompradorBuscarComponent.filtro.fechapagoinicio);
        if (oDetraccionProveedorBuscarComponent.filtro.nrodetracciondesde != "") {
          d.NumDetraccionesDesde = oDetraccionProveedorBuscarComponent.filtro.nrodetracciondesde;
        }

        if (oDetraccionProveedorBuscarComponent.filtro.ruccompradora != "") {
          d.RucCompradora = oDetraccionProveedorBuscarComponent.filtro.ruccompradora;
        }
        if (oDetraccionProveedorBuscarComponent.filtro.ruccompradora != "") {
          d.NumeroFactura = oDetraccionProveedorBuscarComponent.filtro.nrofactura;
        }

        if (oDetraccionProveedorBuscarComponent.filtro.estado != "NONE") {
          d.Estado = oDetraccionProveedorBuscarComponent.filtro.estado;
        }

        if (oDetraccionProveedorBuscarComponent.filtro.nrodetraccionhasta != "") {
          d.NumDetraccionesHasta = oDetraccionProveedorBuscarComponent.filtro.nrodetraccionhasta;
        }

        if (oDetraccionProveedorBuscarComponent.filtro.fechapagoinicio) {
          let fechapagoinicio = DatatableFunctions.ConvertStringToDatetime(oDetraccionProveedorBuscarComponent.filtro.fechapagoinicio);
          d.FechaPagoInicio = DatatableFunctions.FormatDatetimeForMicroService(fechapagoinicio);
        }

        if (oDetraccionProveedorBuscarComponent.filtro.fechapagofin) {
          let fechapagofin = DatatableFunctions.ConvertStringToDatetime(oDetraccionProveedorBuscarComponent.filtro.fechapagofin);
          d.FechaPagoFin = DatatableFunctions.FormatDatetimeForMicroService(fechapagofin);
        }

        //d.column_names = 'NumeroConstancia,RazonSocialComprador,RucComprador,FechaHoraPago,Moneda,TotalMontoDetraccion,Estado';
        d.column_names = 'IdDetraccion,NumeroConstancia,RazonSocial,Ruc,FechaHoraPago,Moneda,TotalMontoDetraccion,Estado';
      }
    },
    columns: [
      { data: 'NumeroConstancia',name: 'NumeroConstancia'},
      { data: 'RazonSocial' ,name: 'RazonSocial'}, //DocumentoMaterial
      { data: 'Ruc',name: 'Ruc' },
      { data: 'FechaHoraPago' ,name: 'FechaHoraPago'},
      { data: 'Moneda' ,name: 'Moneda'},
      { data: 'TotalMontoDetraccion' ,name: 'TotalMontoDetraccion'},
      { data: 'Estado' ,name: 'Estado'},
      { data: 'IdDetraccion', name: 'IdDetraccion'},
      
    ],
    columnDefs: [
      { "className": "text-center", "targets": [0, 1, 2, 3, 4, 5, 6, 7] },
      {
        render: function (data, type, row) {
          let disabled = '';
          let href = 'href="/sm-detraccion/proveedor/formulario' + row.IdDetraccion + '"';
          /*if (!oDetraccionCompradorBuscarComponent.botonDetalle.habilitado) {
            disabled = 'disabled';
            href = '';
          }*/

          return '<div class="text-center"><a '+ href +' IdDetraccion ="' + row.IdDetraccion + '">' +
            '<button class="btn btn-simple btn-info btn-icon edit" rel="tooltip" title="Ver/Editar" data-placement="left"><i class="material-icons">visibility</i></button></a></div>';
        },
        targets: 7
      }
    ]
  });


  datatable.on('click', '.edit', function (event) {
    var $tr = $(this).closest('tr');
    var data = datatable.row($tr).data();
    //console.log($tr.find( "a" ).attr('nroretenciones'));
    //if (data)
    let IdDetraccion = $tr.find("a").attr('IdDetraccion');
    let nav = ['/sm-detraccion/proveedor/formulario', IdDetraccion];

    oDetraccionProveedorBuscarComponent.navigate(nav);
    event.preventDefault();

  });

}
