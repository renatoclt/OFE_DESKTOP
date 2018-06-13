import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {  RFQCompradoBuscar, RFQFiltros } from 'app/model/sm-rfqcomprador';
import { AppUtils } from "app/utils/app.utils";
import { MasterService } from 'app/service/masterservice';
import { ComboItem } from "app/model/comboitem";
import { ChangeDetectorRef } from '@angular/core';
import { URL_PRUEBA_RFQ } from 'app/utils/app.constants';
import { LoginService } from 'app/service/login.service';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}

declare var $, DatatableFunctions, swal, moment: any;
var oRequerimientoCompradorBuscarComponent: RequerimientoCompradorBuscarComponent;
var  datatable;

@Component({
  moduleId: module.id,
  selector: 'requerimientocompradorbuscar-cmp',
  templateUrl: './requerimientocompradorbuscar.component.html',
  providers: [MasterService]
})

export class RequerimientoCompradorBuscarComponent implements OnInit, AfterViewInit {
      util: AppUtils;
      //public dtResultados: DataTable;
      public listEstadoCombo: ComboItem[];
      public resultados: RFQCompradoBuscar[];
      public filtro: RFQFiltros;
      location: Location;
      public url_main_module_page = '/sm-requerimiento/comprador/buscar';

      public navigate(nav) {
          this.router.navigate(nav, { relativeTo: this.route });
      }

      constructor(private router: Router, private route: ActivatedRoute, private _masterService: MasterService, private _securityService: LoginService,  private cdRef: ChangeDetectorRef) {
          this.util = new AppUtils(this.router, this._masterService);
      }


      validarfiltros() {

        oRequerimientoCompradorBuscarComponent.filtro.numeroseguimientorfq = oRequerimientoCompradorBuscarComponent.filtro.numeroseguimientorfq.trim();
    
        if (this.filtro.numeroseguimientorfq == "") {
          if (this.filtro.fechacreacioninicio == null || this.filtro.fechacreacioninicio.toString() == "") {
            swal({
              text: "Fecha de Aceptación inicio es un campo requerido.",
              type: 'warning',
              buttonsStyling: false,
              confirmButtonClass: "btn btn-warning"
            });
            return false;
          }
          if (this.filtro.fechacreacionfin == null || this.filtro.fechacreacionfin.toString() == "") {
            swal({
              text: "Fecha de Aceptación fin es un campo requerido.",
              type: 'warning',
              buttonsStyling: false,
              confirmButtonClass: "btn btn-warning"
            });
            return false;
    
          }
    
          if (this.filtro.fechacreacioninicio != null && this.filtro.fechacreacioninicio.toString() != "" && this.filtro.fechacreacionfin != null && this.filtro.fechacreacionfin.toString() != "") {
            let fechaemisioninicio = DatatableFunctions.ConvertStringToDatetime(oRequerimientoCompradorBuscarComponent.filtro.fechacreacioninicio);
            let fechaemisionfin = DatatableFunctions.ConvertStringToDatetime(oRequerimientoCompradorBuscarComponent.filtro.fechacreacionfin);
    
    
    
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
      /***************FUNCION CLICK - PARA VALIDAR FILTROS****************** */
    clicked(event) {
      //console.log("holasasasas")
      if (this.validarfiltros())
        datatable.ajax.reload();
      event.preventDefault();
    }

    /***********FUNCION LIMPIAR ********* */
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
          oRequerimientoCompradorBuscarComponent = this;
          //PARA COLOCAR EL TIPO DE ESTADO TEGP QUE BUSCAR
          this.util.listEstadoRFQ(function (data: ComboItem[]) {
            oRequerimientoCompradorBuscarComponent.listEstadoCombo = data;
          });
          this.filtroDefecto();
      }
  
      
      ngAfterViewInit() {

        cargarDataTable();
        
    
        //this.obtenerBotones();
      }

      ngAfterViewChecked() {

        this.cdRef.detectChanges();
      }
  
  }

  function filtrarResultados(item) {
    //
  
    if (oRequerimientoCompradorBuscarComponent.filtro.numeroseguimientorfq) {
  
      return item.numeroseguimientorfq.indexOf(oRequerimientoCompradorBuscarComponent.filtro.numeroseguimientorfq) >= 0;
    }
    else return true;
  }
  
  
  function  cargarDataTable() {
            datatable = $('#dtResultados').DataTable({
              order: [[1, "desc"]],
              searching: false,
              serverSide: true,    
              ajax: {
                beforeSend: function (request) {
                  request.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('access_token'));
                  request.setRequestHeader("origen_datos", 'PEB2M');
                  request.setRequestHeader("tipo_empresa", 'C');
                  request.setRequestHeader("org_id", localStorage.getItem('org_id'));
                  request.setRequestHeader("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
                  //console.log("HOLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA555555555555555555");
                },
                url: URL_PRUEBA_RFQ,
                dataSrc: "data",
                data: function (d) {    
                  //alert("aquihayalgo");
                    //alert(oRfqCompBuscarComponent.filtro.fechadespues);
                  let omitirOtrosCampos=false;
                  if (oRequerimientoCompradorBuscarComponent.filtro.numeroseguimientorfq != "") {
                    d.numeroseguimientorfq = oRequerimientoCompradorBuscarComponent.filtro.numeroseguimientorfq;
                    omitirOtrosCampos=true;
                  }
                  
                  if(! omitirOtrosCampos){
                  if (oRequerimientoCompradorBuscarComponent.filtro.estado != "") {
                    d.estado = oRequerimientoCompradorBuscarComponent.filtro.estado;
                  }
  
                  if (oRequerimientoCompradorBuscarComponent.filtro.fechacreacioninicio) {
                    let fechacreacioninicio = DatatableFunctions.ConvertStringToDatetime(oRequerimientoCompradorBuscarComponent.filtro.fechacreacioninicio);
                    d.fechacreacioninicio = DatatableFunctions.FormatDatetimeForMicroService(fechacreacioninicio);
                  }
  
                  if (oRequerimientoCompradorBuscarComponent.filtro.fechacreacionfin) {
                    let fechacreacionfin = DatatableFunctions.ConvertStringToDatetime(oRequerimientoCompradorBuscarComponent.filtro.fechacreacionfin);
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
             
              ],
  
              columnDefs: [
                { "className": "text-center", "targets": [1, 2, 3, 4, 5, 6, 7] },
                {
  
                  render: function (data, type, row) {
  
                    return '<div class="text-right" height="100%"><div class="checkbox text-right"><label><input class="checkboxGuia" value="' + row.idrfq+ '"  type="checkbox" name="optionsCheckboxes"></label></div></div>';
                  },
                  targets: 0
                },
                {
  
                  render: function (data, type, row) {
                    let href = 'href="/sm-cotizacion/comprador/buscar/"';
                    return '<div class="text-center cotizaciones"><a class="nrorfq"'+ href +' cotizacion ="' + row.numeroseguimientorfq + '">' + row.cotizaciones + '</a></div>';
                  },
                  targets: 7,
                },
                {
                  render: function (data, type, row) {
                    let disabled = '';
                    let href = 'href="/sm-requerimiento/comprador/formulario/' + row.idrfq + '"';
                    
                    return '<div class="text-center"><a class="editar"'+ href +' idrfq ="' + row.idrfq + '">' +
                      '<button class="btn btn-simple btn-info btn-icon edit" rel="tooltip" title="Ver/Editar" data-placement="left"><i class="material-icons">visibility</i></button></a></div>';
                  },
                  targets: 8,
                }    
              ]
            });
  
            datatable.on('click', '.edit', function (event) {
              var $tr = $(this).closest('tr');
              var data = datatable.row($tr).data();
              let id = $tr.find("a.editar").attr('idrfq');
              let nav = ['/sm-requerimiento/comprador/formulario', id];
              oRequerimientoCompradorBuscarComponent.navigate(nav);
              event.preventDefault();
            });

            datatable.on('click', '.nrorfq', function (event) {
              var $tr = $(this).closest('tr');
              var data = datatable.row($tr).data();
              let cotizacion = $tr.find("a.nrorfq").attr('cotizacion');
              console.log(cotizacion.trim());
              localStorage.setItem('NroRFQ', cotizacion.trim())
              let nav = ['/sm-cotizacion/comprador/buscar'];
              oRequerimientoCompradorBuscarComponent.navigate(nav);
              event.preventDefault();
            });

            
          //localStorage.setItem("NroRFQ",numeroseguimientorfq);
            
  
      }
  

      

    


