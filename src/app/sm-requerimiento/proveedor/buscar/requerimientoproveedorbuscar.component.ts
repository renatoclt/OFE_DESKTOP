import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {  RFQCompradoBuscar, RFQFiltros } from 'app/model/sm-rfqcomprador';
import { AppUtils } from 'app/utils/app.utils';
import { MasterService } from 'app/service/masterservice';
import { ComboItem } from 'app/model/comboitem';
import { ChangeDetectorRef } from '@angular/core';
import { URL_PRUEBA_RFQ } from 'app/utils/app.constants';
import { LoginService } from 'app/service/login.service';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}

declare var $, DatatableFunctions, swal, moment: any;
var oRequerimientoProveedorBuscarComponent: RequerimientoProveedorBuscarComponent;
var datatable;

@Component({
  moduleId: module.id,
  selector: 'requerimientoproveedorbuscar-cmp',
  templateUrl: './requerimientoproveedorbuscar.component.html',
  providers: [MasterService]
})

export class RequerimientoProveedorBuscarComponent implements OnInit, AfterViewInit {
      util: AppUtils;
      // public dtResultados: DataTable;
      public listEstadoCombo: ComboItem[];
      public resultados: RFQCompradoBuscar[];
      public filtro: RFQFiltros;
      location: Location;
      public url_main_module_page = '/sm-requerimiento/proveedor/buscar';

      public navigate(nav) {
          this.router.navigate(nav, { relativeTo: this.route });
      }

      constructor(private router: Router, private route: ActivatedRoute, private _masterService: MasterService,
                  private _securityService: LoginService,  private cdRef: ChangeDetectorRef) {
          this.util = new AppUtils(this.router, this._masterService);
      }


      validarfiltros() {

        oRequerimientoProveedorBuscarComponent.filtro.numeroseguimientorfq = oRequerimientoProveedorBuscarComponent.filtro.numeroseguimientorfq.trim();

        if (this.filtro.numeroseguimientorfq == "") {
          if (this.filtro.fechacreacioninicio == null || this.filtro.fechacreacioninicio.toString() == "") {
              swal({
                text: 'Fecha de Aceptación inicio es un campo requerido.',
                type: 'warning',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-warning'
              });
              return false;
          }

          if (this.filtro.fechacreacionfin == null || this.filtro.fechacreacionfin.toString() == "") {
              swal({
                text: 'Fecha de Aceptación fin es un campo requerido.',
                type: 'warning',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-warning'
              });
              return false;
          }

          if (this.filtro.fechacreacioninicio != null && this.filtro.fechacreacioninicio.toString() != "" && this.filtro.fechacreacionfin != null && this.filtro.fechacreacionfin.toString() != "") {
            let fechaemisioninicio = DatatableFunctions.ConvertStringToDatetime(oRequerimientoProveedorBuscarComponent.filtro.fechacreacioninicio);
            let fechaemisionfin = DatatableFunctions.ConvertStringToDatetime(oRequerimientoProveedorBuscarComponent.filtro.fechacreacionfin);

            if (moment(fechaemisionfin).diff(fechaemisioninicio, 'days') > 30) {

              swal({
                text: 'El filtro de búsqueda "Fecha de Aceptación" debe tener un rango máximo de 30 días '+
                      'entre la Fecha Inicial y la Fecha Fin.',
                type: 'warning',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-warning'
              });

              return false;
            }

            let fechaemisioninicio_str = DatatableFunctions.FormatDatetimeForMicroService(fechaemisioninicio);
            let fechaemisionfin_str = DatatableFunctions.FormatDatetimeForMicroService(fechaemisionfin);

            if (fechaemisioninicio_str > fechaemisionfin_str) {
              swal({
                text: 'El rango de Fechas de Aceptación seleccionado no es correcto. La Fecha Inicial es mayor a la Fecha Fin.',
                type: 'warning',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-warning'
              });

              return false;
            }
          }
        }
        return true;
      }
      /***************FUNCION CLICK - PARA VALIDAR FILTROS****************** */
    clicked(event) {
        // console.log("holasasasas")
        if (this.validarfiltros()) {
            datatable.ajax.reload();
        }
        event.preventDefault();
    }

    /***********FUNCION LIMPIAR ********* */
    limpiar(event) {
        this.filtroDefecto();
        setTimeout(function () {
            $('input').each(function () {
                if (!$(this).val() && $(this).val() === '') {
                    $(this.parentElement).addClass('is-empty');
                }
            });
        }, 200);
        event.preventDefault();
    }

    /*************obtiene los filtros de RFQFILTROS************** */
    filtroDefecto() {
        let fechacreacioni = new Date();
        fechacreacioni.setDate(fechacreacioni.getDate() - 30);
        this.filtro = {
            numeroseguimientorfq: '',
            estado: '',
            fechacreacioninicio: fechacreacioni,
            fechacreacionfin: new Date(),
            tienerespuestas:'',
        }
    }


    ngOnInit() {
        oRequerimientoProveedorBuscarComponent = this;
        // PARA COLOCAR EL TIPO DE ESTADO TEGP QUE BUSCAR
        this.util.listEstadoRFQ(function (data: ComboItem[]) {
          oRequerimientoProveedorBuscarComponent.listEstadoCombo = data;
        });
        this.filtroDefecto();
    }

    ngAfterViewInit() {
        cargarDataTable();
        // this.obtenerBotones();
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

  }

  function filtrarResultados(item) {
      if (oRequerimientoProveedorBuscarComponent.filtro.numeroseguimientorfq) {
        return item.numeroseguimientorfq.indexOf(oRequerimientoProveedorBuscarComponent.filtro.numeroseguimientorfq) >= 0;
      } else {
        return true;
      }
  }
  
  
  function  cargarDataTable() {
            datatable = $('#dtResultados').DataTable({
              order: [[1, 'desc']],
              searching: false,
              serverSide: true,
              ajax: {
                beforeSend: function (request) {
                  request.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('access_token'));
                  request.setRequestHeader("origen_datos", 'PEB2M');
                  request.setRequestHeader("tipo_empresa", 'P');
                  request.setRequestHeader("org_id", localStorage.getItem('org_id'));
                  request.setRequestHeader("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
                  // console.log("HOLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA555555555555555555");
                },
                url: URL_PRUEBA_RFQ,
                dataSrc: "data",
                data: function (d) {    
                  // alert("aquihayalgo");
                    // alert(oRfqCompBuscarComponent.filtro.fechadespues);
                  let omitirOtrosCampos=false;
                  if (oRequerimientoProveedorBuscarComponent.filtro.numeroseguimientorfq != "") {
                    d.numeroseguimientorfq = oRequerimientoProveedorBuscarComponent.filtro.numeroseguimientorfq;
                    omitirOtrosCampos=true;
                  }

                  if(! omitirOtrosCampos){
                  if (oRequerimientoProveedorBuscarComponent.filtro.estado != "") {
                    d.estado = oRequerimientoProveedorBuscarComponent.filtro.estado;
                  }

                  if (oRequerimientoProveedorBuscarComponent.filtro.fechacreacioninicio) {
                    let fechacreacioninicio = DatatableFunctions.ConvertStringToDatetime(oRequerimientoProveedorBuscarComponent.filtro.fechacreacioninicio);
                    d.fechacreacioninicio = DatatableFunctions.FormatDatetimeForMicroService(fechacreacioninicio);
                  }

                  if (oRequerimientoProveedorBuscarComponent.filtro.fechacreacionfin) {
                    let fechacreacionfin = DatatableFunctions.ConvertStringToDatetime(oRequerimientoProveedorBuscarComponent.filtro.fechacreacionfin);
                    d.fechacreacionfin = DatatableFunctions.FormatDatetimeForMicroService(fechacreacionfin);
                  }
                }
  
                  //d.column_names = 'NumeroConstancia,RazonSocialComprador,RucComprador,FechaHoraPago,Moneda,TotalMontoDetraccion,Estado';
                  //d.column_names = 'idrfq,numeroseguimientorfq,descripcion,estado,fechacreacion,nombreusuario,version,cotizaciones';
                  d.column_names = 'idrfq,numeroseguimientorfq,descripcion,estado,fechacreacion,nombreusuario,organizacion,version,cotizaciones';
                                    
                }
              },
  
              columns: [
                { data: 'idrfq', name: 'idrfq'},
                { data: 'numeroseguimientorfq', name: 'numeroseguimientorfq'},
                { data: 'descripcion', name: 'descripcion'},
                { data: 'estado', name: 'estado'},
                { data: 'fechacreacion', name: 'fechacreacion'},
                { data: 'organizacion', name: 'organizacion'},
                { data: 'version', name: 'version'},
                { data: 'cotizaciones', name: 'cotizaciones'},
                { data: 'idrfq', name: 'idrfq'},

              ],

              columnDefs: [
                { "className": "text-center", "targets": [1, 2, 3, 4, 5, 6, 7] },
                {
                    render: function (data, type, row) {
                        return '<div class="text-right" height="100%"><div class="checkbox text-right"><label>'+
                              '<input class="checkboxGuia" value="' + row.idrfq + '"  type="checkbox" name="optionsCheckboxes">'+
                              '</label></div></div>';
                    },
                    targets: 0,
                    orderable: false
                },
                /*
                {
                  render: function (data, type, row) {
                    return '<div class="text-center"><a  numeroseguimientorfq ="' + row.numeroseguimientorfq + '">' +
                  },
                  targets: 1
                },
                */

                {
                    render: function (data, type, row) {
                        let disabled = '';
                        let href = 'href="/sm-requerimiento/proveedor/formulario/' + row.idrfq + '"';

                        return '<div class="text-center"><a '+ href +' idrfq ="' + row.idrfq + '">' +
                               '<button class="btn btn-simple btn-info btn-icon edit" rel="tooltip" title="Ver/Editar" data-placement="left">' +
                               '<i class="material-icons">visibility</i></button></a></div>';
                    },
                    targets: 8,
                    orderable: false,
                }
              ]
            });

            datatable.on('click', '.edit', function (event) {
                var $tr = $(this).closest('tr');
                var data = datatable.row($tr).data();
                let idrfq = $tr.find("a").attr('idrfq');
                let nav = ['/sm-requerimiento/proveedor/formulario', idrfq];
                oRequerimientoProveedorBuscarComponent.navigate(nav);
                event.preventDefault();
            });

      }



