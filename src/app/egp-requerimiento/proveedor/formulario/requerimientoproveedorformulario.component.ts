import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';
import { RequerimientoProveedor, Atributo } from 'app/model/egp-requerimiento';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}
declare var $: any;
var oRequerimientoProveedorFormularioComponent;
var dtAtributos;
@Component({
  moduleId: module.id,
  selector: 'requerimientoproveedorformulario-cmp',
  templateUrl: 'requerimientoproveedorformulario.component.html',
})

export class RequerimientoProveedorFormularioComponent implements OnInit, OnChanges, AfterViewInit {





  public toggleButton: boolean = true;
  public item: RequerimientoProveedor;
  public atributos: Atributo[];


  ngOnInit() {
    oRequerimientoProveedorFormularioComponent = this;
    this.atributos = [];
    // Code for the Validator
    this.item = {


      organizacioncompradora: "PROVIAS",
      nroreq: 10001,
      prioridad: 'Alta',

      fechainicio: '19/02/2018',
      fechafin: '26/02/2016',
      fechainiciod: '19/02/2018',
      fechafind: '26/02/2016',
      fechainiciot: '14:00',
      fechafint: '14:00',
      moneda: 'soles',
      estado: 'Activa',
      descripcion: 'Pintado de Edificio Institucional',
      unidadorganicas: 'LOGISTICA',
      notas: 'Nota 1',

      productos: [
        {
          posicion: 1,
          codigoproducto: '000001',
          nombreproducto: "Pintado",

          unidad: 'UND',
          cantidad: '1',
          objetocontrato: 'SERVICIO',
          atributos: [
            {
              nombre: 'F. Entrega',
           
              valor: '',
              unidad: 'Fecha',
              obligatorio: 'SI',
            },
            {
              nombre: 'Equivalencia',
         
              valor: '',
              unidad: 'Texto',
              obligatorio: 'NO',
            },
            {
              nombre: 'Garantia',
            
              valor: '',
              unidad: 'Año',
              obligatorio: 'SI',
            }]
        },
        {
          posicion: 2,
          codigoproducto: '000002',
          nombreproducto: "LIMPIEZA",
          //cantidadbase: 20,
          unidad: 'UND',
          cantidad: '1',
          objetocontrato: 'SERVICIO',
          atributos: [
            {
              nombre: 'F. Entrega',
             
              valor: '',
              unidad: 'Fecha',
              obligatorio: 'SI',
            },
            {
              nombre: 'Equivalencia',
             
              valor: '',
              unidad: 'Texto',
              obligatorio: 'NO',
            },
          ]
        },

      ],
      
          
      docadjuntos: [
        {
          id: 1,
          descripcion: 'TDRPintado de Edificio Institucional',
        },
        
      ],


    };











  }

  ngOnChanges(changes: SimpleChanges) {

  }

  ngAfterViewInit() {
    var dtArchivos = $('#dtArchivos').DataTable({
      ajax: function (data, callback, settings) {

        let result = {
          data: oRequerimientoProveedorFormularioComponent.item.docadjuntos

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

    //var table = $('#datatables').DataTable();

    // Edit record
    dtArchivos.on('click', '.download', function () {
      var $tr = $(this).closest('tr');
      let row_id = $tr.find("a.editar").attr('row-id');
      event.preventDefault();
    });

    // Delete a record


    //  Activate the tooltips
    $('[rel="tooltip"]').tooltip();

    var dtArticulos = $('#dtArticulos').DataTable({
      ajax: function (data, callback, settings) {

        let result = {
          data: oRequerimientoProveedorFormularioComponent.item.productos

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
        { data: 'posicion' },
      ],
      columnDefs: [

        {

          render: function (data, type, row) {


            return '<div class="text-center"><a href="javascript:void(0);" row-id="' + row.posicion + '">' +
              '<button class="btn btn-simple btn-info btn-icon atributos" rel="tooltip" title="Ver Atributos" data-placement="left">' +
              '<i class="material-icons">visibility</i></button></a>' +
              '</div>';
          },
          targets: 5
        }
      ]

    });
    dtArticulos.on('click', '.atributos', function (event) {
      var $tr = $(this).closest('tr');
      let posicion = $tr.find("a").attr('row-id');

      let producto = oRequerimientoProveedorFormularioComponent.item.productos.find(a => a.posicion == posicion);
      var atributos = JSON.parse(JSON.stringify(producto.atributos));//clone

      oRequerimientoProveedorFormularioComponent.atributos = atributos;


      setTimeout(function () {
        dtAtributos.ajax.reload();
        $("#mdlAtributos").modal('show');
      }, 500);
      event.preventDefault();
    });

    dtAtributos = $('#dtAtributos').DataTable({

      ajax: function (data, callback, settings) {

        let result = {
          data: oRequerimientoProveedorFormularioComponent.atributos

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


  }
}
