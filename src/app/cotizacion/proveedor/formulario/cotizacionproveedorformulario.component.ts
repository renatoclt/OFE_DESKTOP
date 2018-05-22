
import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';


import { Cotizacion, Atributo, Producto, Archivo } from 'app/model/cotizacion';




declare var $: any;
declare var swal: any;
declare var DatatableFunctions: any;
var propuestaCotizacionFormularioComponent, row_id, dtArchivos;
@Component({
  moduleId: module.id,
  selector: 'cotizacionproveedorformulario-cmp',
  templateUrl: 'cotizacionproveedorformulario.component.html',
})

export class CotizacionProveedorFormularioComponent implements OnInit, OnChanges, AfterViewInit {

  public item: Cotizacion;
  public atributos?: Atributo[];
  public archivo?: Archivo;

  public toggleButton: boolean = true;
  public classDisabled: string = 'disabled';
  public posicionactual: number = 0;
  public idarchivo: number = 3;
  public id: number = 0;

  private activatedRoute: ActivatedRoute;
  constructor(activatedRoute: ActivatedRoute) {
    this.activatedRoute = activatedRoute;

  }
  habilitarEdicion(e) {

    this.toggleButton = false;
    $("input[name='cantidad']").prop('disabled', false);
    $("input[name='precio']").prop('disabled', false);
    $("input[name='fechaentrega']").prop('disabled', false);
    $("#btnAgregarArchivo").removeClass('disabled');
    if (e)
      e.preventDefault();
  }


  agregarArchivo(e) {

    $('#btnEliminarAA').click();

    if (this.toggleButton === false) {
      this.archivo = new Archivo();
      $('#mdlArchivosAdjuntos').modal('show');
    }
    e.preventDefault();
  }
  /*grabarArchivo() {

    var archivo = JSON.parse(JSON.stringify(this.archivo)) as Archivo;
    this.item.docadjuntos.push(archivo);
    this.idarchivo = this.idarchivo + 1;
    RebindArchivos();

  }*/
  validarDocumentos() {
    if ($("#txtArchivo").get(0).files.length == 0) {
      swal({
        text: "Un archivo es requerido. Por favor completar y volver a intentar!",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });

      return false;
    }

    return true;
  }

  grabarArchivo() {
    if (!this.validarDocumentos()) {
      return false;
    }


    let docs_ordenado = this.item.docadjuntos.sort((n, n1): number => {
      if (n.id < n1.id) return -1;
      if (n.id > n1.id) return 1;
      return 0;
    });
    if (docs_ordenado.length > 0)
      this.archivo.id = docs_ordenado[docs_ordenado.length - 1].id + 1;
    else
      this.archivo.id = 1;
    this.item.docadjuntos.push(this.archivo);


    setTimeout(function () {
      dtArchivos.ajax.reload();

    }, 500);

    $("#mdlArchivosAdjuntos").modal('toggle');
  }
  verAtributos(e, posicion) {
    this.posicionactual = posicion;

    let producto = this.item.productos.find(a => a.posicion == posicion);
    var atributos = JSON.parse(JSON.stringify(producto.atributos));//clone
    propuestaCotizacionFormularioComponent.atributos = atributos;
    RebindAtributos();
    e.preventDefault();

  }
  grabarAtributos() {
    let producto = this.item.productos.find(a => a.posicion == this.posicionactual);
    producto.atributos = this.atributos;

  }
  onChange(event: EventTarget, id) {


    let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;
    //this.file = files[0];
    //console.log(this.file);
    console.log(files);
    console.log(id);


  }
  deleteArchivo(e, id) {

    console.log(e);
    console.log(id);

    let archivos = this.item.docadjuntos;
    console.log("archivos", archivos);
    var archivosfiltrados = archivos.filter(a => a.id != id);

    this.item.docadjuntos = JSON.parse(JSON.stringify(archivosfiltrados));
    console.log("archivosfiltrados", this.item.docadjuntos);
    //dtArchivos.row($tr).remove().draw();

    RebindArchivos();
    e.preventDefault();

  }
  clicked() {


    console.log("clicked", this.item);
  }
  ngOnInit() {
    propuestaCotizacionFormularioComponent = this;
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
    });

    if (this.id > 0) {
      this.toggleButton = true;
    } else {
      this.toggleButton = false;
    }

    this.item = {
      nrocotizacion: "00000000001121",
      nroreq: 1002,
      organizacioncompradora: "Ministerio de Salud",
      atenciona: "Usuario Ministerio",
      preparadopor: "Usuario Proveedor",
      moneda: "USD",
      mensaje: "",
      productos: [
        {
          posicion: 1,
          nombreproducto: "Grupo Electrógeno",
          cantidadbase: 20,
          unidad: 'UND',
          cantidad: 0,
          precio: 1000,
          adjuntos: 'imagenGrupoElectrógeno.png',
          fechaentrega: '03/07/2016',
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
          posicion: 2,
          nombreproducto: "Camioneta Rural",
          cantidadbase: 2, unidad: 'UND',
          cantidad: 0,
          precio: 1000,
          adjuntos: 'imagenCamionetaRural.png',
          fechaentrega: '03/07/2016',
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
          posicion: 3,
          nombreproducto: "Grupo Electrógeno",
          cantidadbase: 20,
          unidad: 'UND',
          cantidad: 0,
          precio: 1000,
          adjuntos: 'imagenGrupoElectrógeno.png',
          fechaentrega: '03/07/2016',
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
    this.archivo = {
      id: 0,
      descripcion: ""
    };
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  ngAfterViewInit() {







    //  Activate the tooltips
    $('[rel="tooltip"]').tooltip();

    var tblArticulos = $('#dtArticulos').DataTable({
      columnDefs: [
        { targets: 'disabled-sorting', orderable: false }
      ],


    });




    CargarDataTableAtributos();
    CargarDataTableArchivos();

    if (this.id == 0) {
      setTimeout(
        function () {
          propuestaCotizacionFormularioComponent.habilitarEdicion(null);
        }, 500);

    }

    DatatableFunctions.registerCheckAll();

  }
}


function CargarDataTableArchivos() {

  dtArchivos = $('#dtArchivos').on('init.dt', function (e, settings, json) {
    DatatableFunctions.initDatatable(e, settings, json, dtArchivos);
  }).DataTable({
    ajax: function (data, callback, settings) {

      let result = {
        data: propuestaCotizacionFormularioComponent.item.docadjuntos

      };
      callback(
        result
      );
    },
    columns: [

      { data: 'id' },
      { data: 'descripcion' },
      { data: 'id' },
    ],
    columnDefs: [
      {

        render: function (data, type, row) {
          return '<div class="text-right" height="100%"><div class="checkbox text-right"><label><input type="checkbox" name="optionsCheckboxes"></label></div></div>';
        },
        targets: 0
      },
      {

        render: function (data, type, row) {


          return '<div class="text-center"><a class="editar" href="javascript:void(0);" row-id="' + row.id + '">' +
            '<button class="btn btn-simple btn-info btn-icon download" rel="tooltip" title="Bajar Archivo" data-placement="left">' +
            '<i class="material-icons">get_app</i></button></a>' +
            '<button class="btn btn-simple btn-danger btn-icon remove" rel="tooltip" title="Eliminar" data-placement="left">' +
            '<i class="material-icons">delete</i>' +
            '</button></div>';
        },
        targets: 2
      }
    ]

  });


  dtArchivos.on('click', '.download', function (event) {
    var $tr = $(this).closest('tr');

    let row_id = $tr.find("a.editar").attr('row-id');

    event.preventDefault();

  });

  // Delete a record
  dtArchivos.on('click', '.remove', function (e) {
    var $tr = $(this).closest('tr');
    row_id = $tr.find("a.editar").attr('row-id') as number;

    swal({
      text: "¿Desea eliminar el registro seleccionado?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-default",
      cancelButtonClass: "btn btn-warning",
    }).then(function () {
      var lista = propuestaCotizacionFormularioComponent.item.docadjuntos as Archivo[];
      var listafiltrada = lista.filter(a => a.id != row_id);
      propuestaCotizacionFormularioComponent.item.docadjuntos = JSON.parse(JSON.stringify(listafiltrada));
      setTimeout(function () {
        dtArchivos.ajax.reload();

      }, 500);
    }, function (dismiss) {
      // dismiss can be 'cancel', 'overlay',
      // 'close', and 'timer'

    })



    e.preventDefault();
  });


}

function RebindArchivos() {


  $('#dtArchivos').dataTable().fnDestroy();

  setTimeout(
    function () {
      CargarDataTableArchivos();
    }, 500);

}
function RebindAtributos() {


  $('#dtDetalleAtributos').dataTable().fnDestroy();

  setTimeout(
    function () {
      CargarDataTableAtributos();
    }, 500);

}

function CargarDataTableAtributos() {

  var tblDetalleAtributos = $('#dtDetalleAtributos').DataTable({
    columnDefs: [
      { targets: 'disabled-sorting', orderable: false }
    ],


  });



}