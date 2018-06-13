import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';

import { MomentModule } from 'angular2-moment/moment.module';
import { AppUtils } from "app/utils/app.utils";
import { MasterService } from 'app/service/masterservice';
import { ComboItem } from "app/model/comboitem";
import { RFQCompradorInsert, ProductoAux, AtributoxProducto, CambioEstado } from "app/model/sm-rfqcomprador";

import 'app/../assets/js/plugins/jquery.PrintArea.js';

import { RfqService} from "app/service/sm-rfqservice";
import { LoginService } from 'app/service/login.service';
//import { Boton } from 'app/model/menu';
import { ChangeDetectorRef } from '@angular/core';
//import { Caracteristicas } from 'app/model/retenciones';

declare var moment: any;
declare var swal: any;

declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}
declare var $,DatatableFunctions: any;
var oRequerimientoProveedorFormularioComponent: RequerimientoProveedorFormularioComponent, dtArticulos, dtArticulos2, dtProveedores, dtProveedoresInvitados, dtDetalleProductos;

@Component({
    moduleId: module.id,
    selector: 'requerimientoproveedorformulario-cmp',
    templateUrl: './requerimientoproveedorformulario.component.html',
    providers: [ RfqService, MasterService, LoginService]
})

export class RequerimientoProveedorFormularioComponent implements OnInit, AfterViewInit {

      public toggleButton: boolean = true;
      public id: string = '0';

      util: AppUtils;
      public listPrioridadCombo: ComboItem[];
      public listMonedaCombo: ComboItem[];
      public listUnidadMedidaCombo: ComboItem[];
      public listEstadoCombo: ComboItem[];
      public item: RFQCompradorInsert;
      public prodAux: ProductoAux[];
      public atributosxProdAux: AtributoxProducto[];

      public navigate(nav) {
          this.router.navigate(nav, { relativeTo: this.activatedRoute });
      }

      public url_main_module_page = '/sm-requerimiento/proveedor/buscar';

      constructor(private activatedRoute: ActivatedRoute, private router: Router,
          private _masterService: MasterService, private _dataService:  RfqService, private_securityService: LoginService) {
          this.util = new AppUtils(this.router, this._masterService);
          this.item = new RFQCompradorInsert();
          this.prodAux = [];
          this.atributosxProdAux = [];
      }

      Rechazar(event) {
          swal({
              text: "¿Desea rechazar la Solicitud de Cotización?",
              type: "warning",
              showCancelButton: true,
              confirmButtonText: "Si",
              cancelButtonText: "No",
              buttonsStyling: false,
              confirmButtonClass: "btn btn-default",
              cancelButtonClass: "btn btn-warning",
          }).then(function () {
              let nav = ['/sm-requerimiento/proveedor/buscar'];
              oRequerimientoProveedorFormularioComponent .navigate(nav);
          }, function (dismiss) {
              // dismiss can be 'cancel', 'overlay',
              // 'close', and 'timer'
          })
          event.preventDefault();
      }

      print(event): void {
          //alert(this.item.logoOrgCompradora        )

          //oDetraccionCompradorFormularioComponent.item.moneda_txt = $("#moneda option:selected").text();
          //oRequerimientoCompradorFormularioComponent.item.estado = $("#estadoComprador option:selected").text();
          setTimeout(function () {
              $("div#print-section-material").printArea({ popTitle: 'SOLICITUD DE COTIZACIÓN', mode: "iframe", popClose: false });
          }, 100);
          //hay que chequear en donde imprime esta parte en conformidaad de servicio
      }

      ngOnInit() {

          //oDetraccionCompradorFormularioComponent = this;
          this.activatedRoute.params.subscribe((params: Params) => {
            this.id = params['id'];
          });

          if (this.id != '0') {
            this.toggleButton = true;

          } else {
            this.toggleButton = false;
          }
          
          this.util.listEstadoHAS(function (data: ComboItem[]) {

            oRequerimientoProveedorFormularioComponent.listEstadoCombo = data;
          });

          oRequerimientoProveedorFormularioComponent = this;
      }


  ngAfterViewInit() {

      this._dataService
        .obtener(this.id)
        .subscribe(
        p => {
          this.item = p;
          console.log(this.item);
          setTimeout(function () {
                $("input").each(function () {
                  $(this).keydown();
                  if (!$(this).val() && $(this).val() == '')
                    $(this.parentElement).addClass("is-empty");
                });
                $("select").each(function () {
                  $(this).keydown();
                  if (!$(this).val() && $(this).val() == '')
                    $(this.parentElement).addClass("is-empty");
                });
                $("textarea").each(function () {
                  $(this).keydown();
                  if (!$(this).val() && $(this).val() == '')
                    $(this.parentElement).addClass("is-empty");
                });

                if (p.proveedorDirigido[0].codestado === "RNVIS") {
                    swal({
                      text: "La solicitud de cotización cambió de estado a visualizada.",
                      type: 'warning',
                      buttonsStyling: false,
                      confirmButtonClass: "btn btn-warning",
                      confirmButtonText: "Aceptar",
                    }).then(function () {
                        let _cambioEstado: CambioEstado;
                        _cambioEstado = new CambioEstado();
                        _cambioEstado.iddoc = p.idrfq;
                        _cambioEstado.idorg = localStorage.getItem('org_id');
                        _cambioEstado.accion = "VISUALIZAR";
            
                        oRequerimientoProveedorFormularioComponent._dataService
                        .cambioEstado( _cambioEstado)
                        .subscribe(
                        p => {
                        // oRequerimientoProveedorFormularioComponent.item.estado='Abierta';
                          //console.log('response', p);
                        // oOrdenCompraProveedorFormularioComponent.item.estadoproveedor = "OVISU";
                        });
                    }, function (dismiss) { // dismiss can be 'cancel', 'overlay',
                        // 'close', and 'timer'
                        let _cambioEstado: CambioEstado;
                        _cambioEstado = new CambioEstado();
                        _cambioEstado.iddoc = p.idrfq;
                        _cambioEstado.idorg = localStorage.getItem('org_id');
                        _cambioEstado.accion = "VISUALIZAR";
            
                        oRequerimientoProveedorFormularioComponent._dataService
                        .cambioEstado( _cambioEstado)
                        .subscribe(
                        p => {
                        // oRequerimientoProveedorFormularioComponent.item.estado='Abierta';
                          //console.log('response', p);
                        // oOrdenCompraProveedorFormularioComponent.item.estadoproveedor = "OVISU";
                        });
                    });
                }

                //oOrdenCompraProveedorFormularioComponent.item.estadoproveedor = "OVISU";
                /*oOrdenCompraProveedorFormularioComponent._dataService
                .cambioEstado2(oOrdenCompraProveedorFormularioComponent.item.id, oOrdenCompraProveedorFormularioComponent.org_id, _cambioEstado);*/

                console.log(dtArticulos);
                console.log( dtProveedores);

                dtArticulos.ajax.reload();
                dtArticulos2.ajax.reload();
                dtProveedores.ajax.reload();
                dtProveedoresInvitados.ajax.reload();
          }, 100);
        },
        e => console.log(e),
        () => { });

        
    dtArticulos = $('#dtArticulos').DataTable({
      footerCallback: function (row, data, start, end, display) {
        console.log(data);
        /*var total = 0;
        data.forEach(element => {
          if (element.es_subitem == false)
            total = total + parseFloat(element.valorrecibido.replace(',', ''));
        });
        var api = this.api(), data;
        //oRfqCompradorFormularioComponent.item.total = DatatableFunctions.FormatNumber(total);

        /*$(api.column(7).footer()).html(
          oDetraccionCompradorFormularioComponent.item.total
        );*/
      },
      "order": [[1, "asc"]],
      "ajax": function (data, callback, settings) {
        let result = {
          data: oRequerimientoProveedorFormularioComponent.item.atributos

        };
        callback(
          result
        );
      },

      "createdRow": function (row, data, index) {


        if (data.es_subitem == false && data.tienesubitem) {
          $(row).addClass('highlight text-center');
          $(row).attr('identificador', data.id);
        }
        else {
          //$(row).attr('parentid', data.parentid);
          $('td', row).eq(0).addClass('text-center');
        }

      },
      columns: [
        { data: 'nombreatributo' },
        { data: 'valor' },
        { data: 'unidad' },
        { data: 'modificable' },
        { data: 'mandatorio' },
      ],
      columnDefs: [
        { "className": "text-center", "targets": [0, 1, 2, 3, 4] },
        /*
        {
          render: function (data, type, row) {
            if (row.es_subitem)
              return '<a href="javascript:void(0);" row-id="' + row.id + '" class="atributos" title="Ver Atributos">' + row.tipodocumento + '</a>';
            else
              return row.tipodocumento;
          },
          targets: 0
        },
        */
      ]
    });

    
    dtArticulos.on('click', '.atributos', function (event) {
        var $tr = $(this).closest('tr');
        let id = $tr.find("a").attr('row-id');

        setTimeout(function () {
          //dtAtributos.ajax.reload();
          $("#mdlAtributosLista").modal('show');

        }, 500);
        event.preventDefault();
    });




    /**********Detalle de Productos********** *****************/
    dtArticulos2 = $('#dtArticulos2').DataTable({
      footerCallback: function (row, data, start, end, display) {
        console.log(data);
      },
      "order": [[1, "asc"]],
      "ajax": function (data, callback, settings) {
            oRequerimientoProveedorFormularioComponent.prodAux=new Array();
            let productos=oRequerimientoProveedorFormularioComponent.item.productos;

            if (productos != null){
                let i = 0;
                for (let objP of productos) {
                    let newProdAux:ProductoAux= new ProductoAux();
                    newProdAux.idproducto=objP.idproducto;
                    newProdAux.codigoproducto=objP.codigoproducto;
                    newProdAux.nombreproducto=objP.nombreproducto;            
                    newProdAux.descripcionproducto=objP.descripcionproducto;
                    let j = 0;              
                    for (let objAxP of productos[i].atributos) {
                        if(productos[i].atributos[j].nombreatributo.toUpperCase()=='CANTIDAD'){
                            newProdAux.cantidad=productos[i].atributos[j].valorenviado;
                        } else if(productos[i].atributos[j].nombreatributo.toUpperCase()=='NUMERO DE PARTE' || productos[i].atributos[j].nombreatributo.toUpperCase()=='NÚMERO DE PARTE' ){
                            newProdAux.nroparte=productos[i].atributos[j].valorenviado;
                        } else if(productos[i].atributos[j].nombreatributo.toUpperCase()=='UNIDAD DE MEDIDA'){
                            newProdAux.unidad=productos[i].atributos[j].valorenviado;
                        } else if(productos[i].atributos[j].nombreatributo.toUpperCase()=='POSICION' || productos[i].atributos[j].nombreatributo.toUpperCase()=='POSICIÓN' ){
                            newProdAux.posicion=productos[i].atributos[j].valorenviado;
                        }
                        j++;
                    }
                    oRequerimientoProveedorFormularioComponent.prodAux.push(newProdAux);
                    i++;
                }
            }

            let result = {
                data: oRequerimientoProveedorFormularioComponent.prodAux
            };
            callback(
                result
            );
      },

      "createdRow": function (row, data, index) {
          if (data.es_subitem == false && data.tienesubitem) {
              $(row).addClass('highlight');
              $(row).attr('identificador', data.id);
          }
          else {
            //$(row).attr('parentid', data.parentid);
              $('td', row).eq(0).addClass('text-center');
          }
      },
      columns: [
          { data: 'posicion' },
          { data: 'codigoproducto' },
          { data: 'nombreproducto' },
          { data: 'descripcionproducto' },
          { data: 'nroparte' },          
          { data: 'cantidad' },
          { data: 'unidad' }
      ],
      
      columnDefs: [
          { "className": "text-center", "targets": [0, 1, 2, 3] },
          {
            render: function (data, type, row) {      
                return '<a href="javascript:void(0);" row-id="' + row.idproducto + '" class="atributos" title="Ver Atributos">' + row.codigoproducto + '</a>';
            },
            targets: 1
          },
      ]
      
    });

    dtArticulos2.on('click', '.atributos', function (event) {
        var $tr = $(this).closest('tr');
        let id = $tr.find("a.atributos").attr('row-id');

        oRequerimientoProveedorFormularioComponent.atributosxProdAux=oRequerimientoProveedorFormularioComponent.item.productos.find(a => a.idproducto == id).atributos,        
        dtDetalleProductos.ajax.reload();
        $("#mdlAtributosLista").modal('show');
          
        event.preventDefault();
    });
   

    /********************Detalle de Atributos por Producto*************************/ 
    dtDetalleProductos = $('#dtDetalleAtributosxProducto').DataTable({
      footerCallback: function (row, data, start, end, display) {
          console.log(data);
      },
      "order": [[1, "asc"]],
      "ajax": function (data, callback, settings) {
          let result = {
              data : oRequerimientoProveedorFormularioComponent.atributosxProdAux,
          };                  
          callback(
              result
          );
      },

      "createdRow": function (row, data, index) {
        if (data.es_subitem == false && data.tienesubitem) {
            $(row).addClass('highlight');
            $(row).attr('identificador', data.id);
        }
        else {
            $('td', row).eq(0).addClass('text-center');
        }
      },
      columns: [
          { data: 'nombreatributo' },
          { data: 'valorenviado' },
          { data: 'nombreunidad' },
          { data: 'modificable' },
          { data: 'mandatorio' },
      ],
      
      columnDefs: [
        { "className": "text-center", "targets": [0, 1, 2, 3, 4] },
        {
            render: function (data, type, row) {
                return row.valorenviado;
            },
            targets: 1
        },       
      ]      
    });



  /********************PROVEEDORES************************* */
  dtProveedores = $('#dtProveedores').DataTable({
    footerCallback: function (row, data, start, end, display) {
      console.log(data);
    },
    "order": [[1, "asc"]],
    "ajax": function (data, callback, settings) {
        let result = {
          data: oRequerimientoProveedorFormularioComponent.item.proveedores
        };
        callback(
          result
        );
    },
    
    "createdRow": function (row, data, index) {
        if (data.es_subitem == false && data.tienesubitem) {
          $(row).addClass('highlight');
          $(row).attr('identificador', data.id);
        }
        else {
          //$(row).attr('parentid', data.parentid);
          $('td', row).eq(0).addClass('text-center');
        }
    },
    
    columns: [
      { data: 'razonsocial' },
      { data: 'rucproveedordirigido' },
      { data: 'usuario' },
    ],
    columnDefs: [
      { "className": "text-center", "targets": [0, 1, 2] },
    ]
  });


  /********************PROVEEDORES************************* */
  dtProveedoresInvitados = $('#dtProveedoresInvitados').DataTable({
    footerCallback: function (row, data, start, end, display) {
      console.log(data);
    },
    "order": [[1, "asc"]],
    "ajax": function (data, callback, settings) {
      let result = {
        data: oRequerimientoProveedorFormularioComponent.item.proveedoresinvitados

      };
      callback(
        result
      );
    },

    "createdRow": function (row, data, index) {


      if (data.es_subitem == false && data.tienesubitem) {
        $(row).addClass('highlight');
        $(row).attr('identificador', data.id);
      }
      else {
        //$(row).attr('parentid', data.parentid);
        $('td', row).eq(0).addClass('text-center');
      }

    },
    columns: [
      { data: 'razonsocial' },
      { data: 'ruc' },
      { data: 'email' },
    ],
    columnDefs: [
      { "className": "text-center", "targets": [0, 1, 2] },
    ]
  });
 
  }

 
  ngAfterViewChecked() {
    //this.cdRef.detectChanges();
  }

}