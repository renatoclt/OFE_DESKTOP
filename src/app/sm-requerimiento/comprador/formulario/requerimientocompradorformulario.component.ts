import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';

import { MomentModule } from 'angular2-moment/moment.module';
import { AppUtils } from "app/utils/app.utils";
import { MasterService } from 'app/service/masterservice';
import { ComboItem } from "app/model/comboitem";
import { RFQCompradorInsert, ProductoAux, AtributoxProducto } from "app/model/sm-rfqcomprador";
import '../../../../assets/js/plugins/jquery.PrintArea.js';

import { RfqService} from "app/service/sm-rfqservice";
import { LoginService } from 'app/service/login.service';
//import { Boton } from 'app/model/menu';
import { ChangeDetectorRef } from '@angular/core';
import { observeOn } from 'rxjs/operator/observeOn';
//import { Caracteristicas } from 'app/model/retenciones';
declare var moment: any;
declare var swal: any;

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}
declare var $,DatatableFunctions: any;
var oRequerimientoCompradorFormularioComponent: RequerimientoCompradorFormularioComponent, dtArticulos, dtArticulos2, dtDetalleProductos, dtProveedores, dtProveedoresInvitados, dtDetalleAtributosxProducto;
@Component({
  moduleId: module.id,
  selector: 'requerimientocompradorformulario-cmp',
  templateUrl: './requerimientocompradorformulario.component.html',
  providers: [ RfqService, MasterService, LoginService]
})

export class RequerimientoCompradorFormularioComponent implements OnInit, AfterViewInit {

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

  public url_main_module_page = '/sm-requerimiento/comprador/buscar';

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
      private _masterService: MasterService, private _dataService:  RfqService, private_securityService: LoginService) {
      this.util = new AppUtils(this.router, this._masterService);
      this.item = new RFQCompradorInsert();
      this.prodAux = [];
      this.atributosxProdAux = [];
  }



  print(event): void {

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

      oRequerimientoCompradorFormularioComponent.listEstadoCombo = data;
    });

    oRequerimientoCompradorFormularioComponent = this;
  }

  listarRespuesta(event){
    console.log("holaaa")
    //let idrfq = oRequerimientoCompradorFormularioComponent.item.idrfq;
    //let nav = ['/sm-cotizacion/comprador/buscar', idrfq];  

  event.preventDefault();
  }

  ngAfterViewInit() {

    this._dataService
      .obtener(this.id)
      .subscribe(
      p => {
        this.item = p;
        console.log(this.item);

        localStorage.setItem("NroRFQ",this.item.nroreq.trim());

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
      },
      "order": [[1, "asc"]],
      "ajax": function (data, callback, settings) {
        let result = {
          data: oRequerimientoCompradorFormularioComponent.item.atributos
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




    /**********Detalle de Productos********** *****************/
    dtArticulos2 = $('#dtArticulos2').DataTable({
      footerCallback: function (row, data, start, end, display) {
          console.log(data);
      },
      "order": [[1, "asc"]],
      "ajax": function (data, callback, settings) {
            oRequerimientoCompradorFormularioComponent.prodAux=new Array();
            let productos=oRequerimientoCompradorFormularioComponent.item.productos;

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
                  oRequerimientoCompradorFormularioComponent.prodAux.push(newProdAux);
                  i++;
              }
            }

            let result = {
                data: oRequerimientoCompradorFormularioComponent.prodAux
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
          //{data: 'id'},
          { data: 'posicion' },
          { data: 'codigoproducto' },
          { data: 'nombreproducto' },
          { data: 'descripcionproducto' },
          { data: 'nroparte' },
          { data: 'cantidad' },          
          { data: 'unidad' },        
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

        oRequerimientoCompradorFormularioComponent.atributosxProdAux=oRequerimientoCompradorFormularioComponent.item.productos.find(a => a.idproducto == id).atributos,        
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
              data : oRequerimientoCompradorFormularioComponent.atributosxProdAux,
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
          //{data: 'id'},
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
                  /*
                  if (row.modificable.trim()=='S')
                    return '<input name="articuloItem" type="text" class="form-control"  value="'+row.valorenviado+'">';
                  else
                    return row.valorenviado;
                  */
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
          data: oRequerimientoCompradorFormularioComponent.item.proveedores
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
      { data: 'estado' },
      /*{ data: 'usuario' },*/
    ],
    columnDefs: [
      { "className": "text-center", "targets": [0, 1,] },
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
        data: oRequerimientoCompradorFormularioComponent.item.proveedoresinvitados

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

