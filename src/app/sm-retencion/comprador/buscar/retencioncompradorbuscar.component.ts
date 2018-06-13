import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { RetencionesBuscar, RetencionesFiltros } from '../../../model/sm-retenciones';

import { AppUtils } from "../../../utils/app.utils";
import { MasterService } from '../../../service/masterservice';
import { ComboItem } from "app/model/comboitem";
import {URL_BUSCAR_RETENCIONES} from 'app/utils/app.constants';
import { LoginService } from '../../../service/login.service';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];

}
declare var $, DatatableFunctions, swal, moment: any;
var oRetencionesCompradorBuscarComponent: RetencionCompradorBuscarComponent;
var datatable;
@Component({
  moduleId: module.id,
  selector: 'RetencionesCompradorbuscar-cmp',
  templateUrl: './retencioncompradorbuscar.component.html',
  providers: [MasterService]
})

export class RetencionCompradorBuscarComponent implements OnInit, AfterViewInit {
  util: AppUtils;
  public listEstadoCombo: ComboItem[];
  public resultados: RetencionesBuscar[];
  public filtro: RetencionesFiltros;
  public url_main_module_page = '/sm-retencion/comprador/buscar';

  public navigate(nav) {

    this.router.navigate(nav, { relativeTo: this.route });
  }
  constructor(private router: Router, private route: ActivatedRoute, private _masterService: MasterService) {
    this.util = new AppUtils(this.router, this._masterService);
  }

  validarfiltros() {
    
        // oRetencionesCompradorBuscarComponent.filtro.nroretencioninicio = oRetencionesCompradorBuscarComponent.filtro.nroretencioninicio.trim();
        
        // oRetencionesCompradorBuscarComponent.filtro.nroretencionfin = oRetencionesCompradorBuscarComponent.filtro.nroretencionfin.trim();
      ///****añadir para org compradora*****/// */
        if (this.filtro.nroretencioninicio == "") {
            if (this.filtro.fechaemisioninicio == null || this.filtro.fechaemisioninicio.toString() == "") {
                swal({
                  text: "Fecha de Aceptación inicio es un campo requerido.",
                  type: 'warning',
                  buttonsStyling: false,
                  confirmButtonClass: "btn btn-warning"
                });
                return false;
            }
            if (this.filtro.fechaemisionfin == null || this.filtro.fechaemisionfin.toString() == "") {
                swal({
                  text: "Fecha de Aceptación fin es un campo requerido.",
                  type: 'warning',
                  buttonsStyling: false,
                  confirmButtonClass: "btn btn-warning"
                });
                return false;
            }
    
            if (this.filtro.fechaemisioninicio != null && this.filtro.fechaemisioninicio.toString() != "" && this.filtro.fechaemisionfin != null && this.filtro.fechaemisionfin.toString() != "") {
                let fechaemisioninicio = DatatableFunctions.ConvertStringToDatetime(oRetencionesCompradorBuscarComponent.filtro.fechaemisioninicio);
                let fechaemisionfin = DatatableFunctions.ConvertStringToDatetime(oRetencionesCompradorBuscarComponent.filtro.fechaemisionfin);
        
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
          nroretencioninicio: '',
          nroretencionfin: '',
          ruc: '',
          nrofactura: '',
          estado: '',
          fechaemisioninicio: fechacreacioni,
          fechaemisionfin: new Date(),
      }
  }

  ngOnInit() {
    oRetencionesCompradorBuscarComponent = this;
    //PARA COLOCAR EL TIPO DE ESTADO TEGP QUE BUSCAR
    this.util.listEstadoRetencion(function (data: ComboItem[]) {
      oRetencionesCompradorBuscarComponent.listEstadoCombo = data;
    });
    this.filtroDefecto();
  }

  ngAfterViewInit() {
      cargarDataTable();
  }


}

function filtrarResultados(item) {
  //

  /*if (oRetencionesCompradorBuscarComponent.filtro.nroretencioninicio) {

    return item.nroretenciones.indexOf(oRetencionesCompradorBuscarComponent.filtro.nroretencioninicio) >= 0;
  }
  else return true;*/
}

function cargarDataTable() {
  console.log('AQUI HAY UN ERRORRRRRRRRRR');
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
          url: URL_BUSCAR_RETENCIONES,
          dataSrc: "data",
          data: function (d) {
              if (oRetencionesCompradorBuscarComponent.filtro.nroretencioninicio != "") {
                d.numeroRetencioninicio = oRetencionesCompradorBuscarComponent.filtro.nroretencioninicio;
              }

              if (oRetencionesCompradorBuscarComponent.filtro.nroretencionfin != "") {
                d.numeroRetencionfin = oRetencionesCompradorBuscarComponent.filtro.nroretencionfin;
              }

              if (oRetencionesCompradorBuscarComponent.filtro.ruc != "") {
                d.Ruc = oRetencionesCompradorBuscarComponent.filtro.ruc;
              }
        
              if (oRetencionesCompradorBuscarComponent.filtro.estado != "NONE") {
                d.Estado = oRetencionesCompradorBuscarComponent.filtro.estado;
              }

              if (oRetencionesCompradorBuscarComponent.filtro.nrofactura != "") {
                d.NumeroFactura = oRetencionesCompradorBuscarComponent.filtro.nrofactura;
              }

              if (oRetencionesCompradorBuscarComponent.filtro.fechaemisioninicio) {
                let fechaemisioninicio = DatatableFunctions.ConvertStringToDatetime(oRetencionesCompradorBuscarComponent.filtro.fechaemisioninicio);
                d.FechaEmisioninicio = DatatableFunctions.FormatDatetimeForMicroService(fechaemisioninicio);
              }

              if (oRetencionesCompradorBuscarComponent.filtro.fechaemisionfin) {
                let fechaemisionfin = DatatableFunctions.ConvertStringToDatetime(oRetencionesCompradorBuscarComponent.filtro.fechaemisionfin);
                d.FechaEmisionfin = DatatableFunctions.FormatDatetimeForMicroService(fechaemisionfin);
              }

              d.columnnames = 'Id,Comprobante,Organizacion,Ruc,Emision,Moneda,Total,Estado,Observacion';
          }
      },
      columns: [
          { data: 'Comprobante',name: 'Comprobante' },
          { data: 'Organizacion' ,name: 'Organizacion'}, 
          { data: 'Ruc', name: 'Ruc' },
          { data: 'Emision' ,name: 'Emision'},
          { data: 'Moneda' ,name: 'Moneda'},
          { data: 'Total' ,name: 'Total'},
          { data: 'Estado' ,name: 'Estado'},
          { data: 'Id' ,name: 'Id'},
      ],
      columnDefs: [
          { "className": "text-center", "targets": [0, 1, 2, 3, 4, 5, 6, 7] },
          {
            
            render: function (data, type, row) {
              let href = 'href="/sm-retencion/comprador/formulario' + row.Id + '"';
              return '<div class="text-center"><a href="/sm-retencion/comprador/formulario/' + row.Id + '" Id="' + row.Id + '">' +
                '<button class="btn btn-simple btn-info btn-icon edit" rel="tooltip" title="Ver/Editar" data-placement="left"><i class="material-icons">visibility</i></button></a></div>';
            },
            targets: 7
          },
      ]
  });


  datatable.on('click', '.edit', function (event) {
      var $tr = $(this).closest('tr');
      var data = datatable.row($tr).data();
      //console.log($tr.find( "a" ).attr('nroretenciones'));
      //if (data)
      let Id = $tr.find("a").attr('Id');
      let nav = ['/sm-retencion/comprador/formulario', Id];

      oRetencionesCompradorBuscarComponent.navigate(nav);
      event.preventDefault();
  });

}