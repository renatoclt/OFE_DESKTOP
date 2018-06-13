import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';
import { Cotizacion, Atributo, Producto, Archivo } from 'app/model/cotizacion';


declare var $: any;
var oCotizacionCompradorFormularioComponent, dtAtributos;
@Component({
  moduleId: module.id,
  selector: 'cotizacioncompradorformulario-cmp',
  templateUrl: 'cotizacioncompradorformulario.component.html',
})

export class CotizacionCompradorFormularioComponent implements OnInit, OnChanges, AfterViewInit {

  public item: Cotizacion;
  public atributos?: Atributo[];


  public toggleButton: boolean = true;
  public classDisabled: string = 'disabled';


  ngOnInit() {

    // Code for the Validator
oCotizacionCompradorFormularioComponent=this;

    this.item = {
      nrocotizacion: "00000000001121",
      proveedor:"Juguetes Educativos Arbolito",
      atenciona: "Usuario Ministerio",
      preparadopor: "Usuario Proveedor",      
      nroreq: 1002,
      fechacreacion:'10/07/2017',
      estado: "Activa",
    
    
     
      moneda: "PEN",
      mensaje: "El presupuesto de construcción se puede extender en páginas debido a lo variado de materiales y procesos. Y por lo general tienen una vigencia que se deriva de la fluctuación de los precios del material en los mercados.",
      productos: [
        {
           codigoproducto: '000001',
          posicion: 1,
          nombreproducto: "Grupo Electrógeno",
          cantidadbase: 20,
          unidad: 'UND',
          cantidad: 20,
          precio: 1000,
          adjuntos: 'imagenGrupoElectrógeno.png',
          fechaentrega: '03/07/2016',
          objetocontrato:'BIEN',
          atributos: [
            {
              nombre: 'F. Entrega',
              operador: '=',
              valor: '',
              unidad: 'Fecha',
              obligatorio: 'SI',
            },
            {
              nombre: 'Equivalencia',
              operador: '>',
              valor: '',
              unidad: 'Texto',
              obligatorio: 'NO',
            },
            {
              nombre: 'Garantia',
              operador: '<',
              valor: '',
              unidad: 'Año',
              obligatorio: 'SI',
            }]
        },
        {
          codigoproducto: '000002',
          posicion: 2,
          nombreproducto: "Camioneta Rural",
          cantidadbase: 2,
          unidad: 'UND',
          cantidad: 2,
          precio: 1000,
          adjuntos: 'imagenCamionetaRural.png',
          fechaentrega: '03/07/2016',
          objetocontrato:'BIEN',
          atributos: [

            {
              nombre: 'Equivalencia',
              operador: '>',
              valor: '',
              unidad: 'Texto',
              obligatorio: 'NO',
            },
            {
              nombre: 'Garantia',
              operador: '<',
              valor: '',
              unidad: 'Año',
              obligatorio: 'SI',
            }]
        },
        {
           codigoproducto: '000003',
          posicion: 3,
          nombreproducto: "Grupo Electrógeno",
          cantidadbase: 20,
          unidad: 'UND',
          cantidad: 20,
          precio: 1000,
          adjuntos: 'imagenGrupoElectrógeno.png',
          fechaentrega: '03/07/2016',
           objetocontrato:'BIEN',
          atributos: [
            {
              nombre: 'F. Entrega',
              operador: '=',
              valor: '',
              unidad: 'Fecha',
              obligatorio: 'SI',
            },
            {
              nombre: 'Equivalencia',
              operador: '>',
              valor: '',
              unidad: 'Texto',
              obligatorio: 'NO',
            },
            {
              nombre: 'Garantia',
              operador: '<',
              valor: '',
              unidad: 'Año',
              obligatorio: 'SI',
            }]
        }
      ],
      docadjuntos: [
        {
          id: 1,
          descripcion: "Descripción archivo numero 1"
        },
        {
          id: 2,
          descripcion: "Descripción archivo numero 2"
        }
      ]
    };

    this.atributos = [];



    

  }

  ngOnChanges(changes: SimpleChanges) {

  }

  ngAfterViewInit() {
    var dtArchivos = $('#dtArchivos').DataTable({
      ajax: function (data, callback, settings) {

        let result = {
          data: oCotizacionCompradorFormularioComponent.item.docadjuntos

        };
        callback(
          result
        );
      },
      columns: [


        { data: 'descripcion' },
        { data: 'id' },
      ],
      columnDefs: [

        {

          render: function (data, type, row) {


            return '<div class="text-center"><a class="editar" href="javascript:void(0);" row-id="' + row.id + '">' +
              '<button class="btn btn-simple btn-info btn-icon download" rel="tooltip" title="Bajar Archivo" data-placement="left">' +
              '<i class="material-icons">get_app</i></button></a>' +
              '</div>';
          },
          targets: 1
        }
      ]
    });



    dtArchivos.on('click', '.download', function (event) {
      var $tr = $(this).closest('tr');

      let row_id = $tr.find("a.editar").attr('row-id');

      event.preventDefault();

    });


     var dtArticulos = $('#dtArticulos').DataTable({
      ajax: function (data, callback, settings) {

        let result = {
          data: oCotizacionCompradorFormularioComponent.item.productos

        };
        callback(
          result
        );
      },
      columns: [


        { data: 'codigoproducto' },
        { data: 'nombreproducto' },
        { data: 'objetocontrato' },
        { data: 'cantidad' },
        { data: 'unidad' },
        { data: 'precio' },
        { data: 'fechaentrega' },
        { data: 'posicion' },
        { data: 'adjuntos' },
      ],
      columnDefs: [

        {

          render: function (data, type, row) {


            return '<div class="text-center"><a class="atributos" href="javascript:void(0);" row-id="' + row.posicion + '">' +
              '<button class="btn btn-simple btn-info btn-icon atributos" rel="tooltip" title="Ver Atributos" data-placement="left">' +
              '<i class="material-icons">visibility</i></button></a>' +
              '</div>';
          },
          targets: 7
        },

        {

          render: function (data, type, row) {


            return '<div class="text-center">'+row.adjuntos+'<a class="download" href="javascript:void(0);" row-id="' + row.posicion + '">' +
            '<button class="btn btn-simple btn-info btn-icon download" rel="tooltip" title="Bajar Archivo" data-placement="left">'+
                                   '<i class="material-icons">get_app</i>'+
                               '</button></a>' +
              '</div>';
          },
          targets: 8
        }

      ]

    });
    dtArticulos.on('click', '.atributos', function (event) {
      var $tr = $(this).closest('tr');
      let posicion = $tr.find("a.atributos").attr('row-id');

      let producto = oCotizacionCompradorFormularioComponent.item.productos.find(a => a.posicion == posicion);
      var atributos = JSON.parse(JSON.stringify(producto.atributos));//clone

      oCotizacionCompradorFormularioComponent.atributos = atributos;


      setTimeout(function () {
        dtAtributos.ajax.reload();
        $("#mdlAtributos").modal('show');
      }, 500);
      event.preventDefault();
    });

    dtArticulos.on('click', '.download', function (event) {
      var $tr = $(this).closest('tr');
      let posicion = $tr.find("a.download").attr('row-id');

      
      event.preventDefault();
    });
    dtAtributos = $('#dtAtributos').DataTable({

      ajax: function (data, callback, settings) {

        let result = {
          data: oCotizacionCompradorFormularioComponent.atributos

        };
        callback(
          result
        );
      },
      columns: [


        { data: 'nombre' },
        { data: 'operador' },
        { data: 'valor' },
        { data: 'unidad' },
        { data: 'obligatorio' },

      ],

    });

    //  Activate the tooltips
    $('[rel="tooltip"]').tooltip();


  }
}
