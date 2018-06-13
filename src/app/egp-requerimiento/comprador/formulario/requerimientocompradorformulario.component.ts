import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';


import { Articulo } from 'app/model/egp-articulo';

import { RFQCompradorService } from 'app/service/egp-rfqcompradorservice';
import { CorreoElectronicoService } from 'app/service/correoelectronico.service';
import { MensajeTextoService } from 'app/service/mensajetexto.service';
import { RFQCompradorInsert, Archivo, ProveedorInvitado, Proveedor, Producto } from 'app/model/egp-rfqcomprador';


import { ResponseError } from 'app/model/responseerror';
import { AppUtils } from "app/utils/app.utils";
import { MasterService } from 'app/service/masterservice';
import { ComboItem } from "app/model/comboitem";

declare var moment: any;
declare var swal: any;
declare var DatatableFunctions: any;

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}
declare var $: any;
var oRequerimientoCompradorFormularioComponent;
var dtArchivos, dtProveedoresInvitados, dtProveedores, dtArticulos;
var row_id;
@Component({
  moduleId: module.id,
  selector: 'requerimientocompradorformulario-cmp',
  templateUrl: 'requerimientocompradorformulario.component.html',
  providers: [RFQCompradorService, MasterService, CorreoElectronicoService, MensajeTextoService]
})

export class RequerimientoCompradorFormularioComponent implements OnInit, OnChanges, AfterViewInit {

  //public dtArticulos: DataTable;
  public dtDetalleAtributos: DataTable;
  public toggleButton: boolean = true;


  public listArticuloModel: Articulo[];
  public iArticulo: number = 0;


  public id: number = 0;
  public item: RFQCompradorInsert;
  public producto: Producto;
  public proveedores: Proveedor[];

  public proveedorInvitado: ProveedorInvitado;
  public archivo: Archivo;
  errorMessage: string = '';
  messagePost: string = '';
  isLoading: boolean = true;
  util: AppUtils;
  public listPrioridadCombo: ComboItem[];
  public listMonedaCombo: ComboItem[];
  public listUnidadCombo: ComboItem[];

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private _dataService: RFQCompradorService, private _emailService: CorreoElectronicoService, private _smsService: MensajeTextoService, private _masterService: MasterService, ) {

    this.listArticuloModel = [];

    this.item = new RFQCompradorInsert();
    this.item.fechainiciod = moment().format("MM/DD/YYYY");
    this.item.fechainiciot = moment().format("hh:mm a");
    this.item.fechafind = moment().format("MM/DD/YYYY");
    this.item.fechafint = moment().format("hh:mm a");
    this.item.productos = [];
    this.item.proveedoresinvitados = [];
    this.item.proveedores = [
      {
        id: 1,
        razonsocial: 'PROVIAS',
        ruc: '123456789',
        usuario: 'Juan Mendez',
      },
    ];
    this.proveedores = [
      {
        id: 4,
        razonsocial: 'Pintado de Edificio S.A',
        ruc: '123456789',
        usuario: 'Juan Mendez',
      },
  
    ];


    this.producto = new Producto();

    this.proveedorInvitado = new ProveedorInvitado();
    this.util = new AppUtils(this.router, this._masterService);
    this.archivo = new Archivo();

  }
  grabarAgregarProveedor(event) {
    for (var xI = 0; xI < this.proveedores.length; xI++) {
      this.item.proveedores.push(this.proveedores[xI]);
    }
    setTimeout(function () {
      dtProveedores.ajax.reload();

    }, 500);
    $("#mdlProveedor").modal('toggle');
    event.preventDefault();

  }
  agregarArchivo(event) {
    this.archivo = new Archivo();
    event.preventDefault();
  }
  agregarProveedorInvitado(event) {
    this.proveedorInvitado = new ProveedorInvitado();
    event.preventDefault();
  }
  obtener(id: number) {

    this._dataService
      .obtener(id)
      .subscribe(
      p => {
        this.item = p.data[0];
        console.log(this.item.productos);

        if(!this.item.proveedores)          this.item.proveedores=[];
        if(!this.item.docadjuntos)          this.item.docadjuntos=[];
        if(!this.item.proveedoresinvitados)          this.item.proveedoresinvitados=[];
        if(!this.item.productos)          this.item.productos=[];
        

  
        /*for (var xI = 0; xI < this.item.productos.length; xI++) {
          this.dtArticulos.dataRows.push([this.item.productos[xI].codigoproducto + "", this.item.productos[xI].nombreproducto,
          this.item.productos[xI].description, this.item.productos[xI].cantidad, this.item.productos[xI].unidad, '']);
        }*/


        setTimeout(function () {
          $("input").each(function () {
            $(this).keydown();
          });

          $("textarea").each(function () {
            $(this).keydown();
          });
        }, 100);

        setTimeout(function () {
          dtArticulos.ajax.reload();
        }, 100);
      },
      e => this.errorMessage = e,
      () => this.isLoading = false);
  }

  validar() {
    if (this.item.nroreq == null || this.item.nroreq == 0) {
      swal({
        text: "N° Req. es un campo requerido. Por favor completar y volver a intentar!",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });

      return false;
    }

    if (this.item.prioridad == null || this.item.prioridad == "") {
      swal({
        text: "Prioridad es un campo requerido. Por favor completar y volver a intentar!",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });

      return false;
    }

    return true;
  }

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

  validarDetalleArticulo() {
    if (this.producto.codigoproducto == null || this.producto.codigoproducto == 0) {
      swal({
        text: "Código del Bien o Servicio es un campo requerido. Por favor completar y volver a intentar!",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });

      return false;
    }

    if (this.producto.nombreproducto == null || this.producto.nombreproducto == "") {
      swal({
        text: "Nombre del Bien o Servicio es un campo requerido. Por favor completar y volver a intentar!",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });

      return false;
    }

    if (this.producto.cantidad == null || this.producto.cantidad == "") {
      swal({
        text: "Cantidad es un campo requerido. Por favor completar y volver a intentar!",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });

      return false;
    }

    if (this.producto.unidad == null || this.producto.unidad == "") {
      swal({
        text: "Unidad es un campo requerido. Por favor completar y volver a intentar!",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });

      return false;
    }

    return true;
  }


  obtenerCodPaisDeNumero(numero, codDefault) {
    
    let numSinEspacios = numero.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
   // let pos = numSinEspacios.indexOf(' ');
    let pos = '';

    if(numSinEspacios.indexOf(' ')<0){
      pos=codDefault;
    }
    else{
      pos = numSinEspacios.substr(0,numSinEspacios.indexOf(' '));
    }

    //alert(pos);
    return pos;
  }

  obtenerNumeroSinCodPais(numero) {
    let numSinEspacios = numero.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
    let pos = numSinEspacios.substr(numSinEspacios.indexOf(' ')+1,numSinEspacios.length-numSinEspacios.indexOf(' ')-1);
   // alert(pos);
    return pos;
  }

  grabar(event) {
    //let mensaje=JSON.stringify({ direccion:"rvillaverde@ebizlatin.com",mensaje:"mensaje de prueba - contenido",asunto:"correo de prueba - asunto"});
      //alert();


    let codDefault = '+51';      

    let emails = [];
    let numeros = [];
    let codigos = [];

    for (let i = 0; i < this.item.proveedoresinvitados.length; i++) {
        let correo = this.item.proveedoresinvitados[i].email.trim();
        let numero = this.obtenerNumeroSinCodPais(this.item.proveedoresinvitados[i].movil);
        let codigo = this.obtenerCodPaisDeNumero(this.item.proveedoresinvitados[i].movil,codDefault);
        if (correo.length>0){ emails.push(correo); };
        if (numero.length>0){ numeros.push(numero); };
        if (codigo.length>0){ codigos.push(codigo); };        
    }

    //let emailAsunto = "correo de prueba - asunto";
    let emailAsunto = `Nuevo requerimiento de PROVIAS NACIONAL`;

    //let emailContenido = "mensaje de prueba - contenido";
    let emailContenido = `Estimados Sres. Proveedores
    
    De nuestra mayor consideración:
    
    Por medio del presente nos es grato dirigirnos a usted y hacerle de vuestro conocimiento que PROVIAS NACIONAL tiene previsto la contratación del “SERVICIO DE PINTADO DEL LOCAL INSTITUCIONAL”.
    
    Motivo por el cual su representada deberá ingresar a la siguiente ruta: www.proviasnac.gob.pe donde encontrará toda la información de los Términos de Referencia en la que se detallan las actividades y características que comprende dicho servicio, y a la vez le solicitamos a Ud. se sirva remitirnos vuestra Cotización, indicándonos el presupuesto que les demandaría efectuar dichas labores, ya que consideramos a su representada como proveedor potencial para el servicio requerido.

    Así mismo mucho apreciaremos indicarnos en su cotización:

    •	El Costo Total del servicio en Soles, Incluyendo Impuestos de Ley (IGV 18%) así como cualquier otro concepto que le sea aplicable y que pueda incidir sobre el costo del servicio.
    •	El cumplimiento de los requerimientos técnicos mínimos solicitados en los Términos de Referencia.
    •	Número de RUC
    
    Para cualquier consulta que estime pertinente efectuar, lo atenderemos al teléfono: 317-43515 o al ENTEL 946-037194
    
    Hago propicia la oportunidad para manifestarle mi estima y reiterarle mi agradecimiento por la atención que le brinde a la presente.
    
    Esperando contar con su valiosa colaboración, me despido no sin antes mencionarle que la remisión de vuestra cotización sea a más tardar el día 16.02.2018
    
    Saludos cordiales.
    
    Atentamente,`;

    //let smsContenido = "mensaje de prueba - contenido";
    let smsContenido = `Estimado Proveedor

Usted ha recibido un requerimiento de PROVIAS NACIONAL para presentar su cotización.

Sirvase a ingresar a la siguiente ruta: www.proviasnac.gob.pe

Atentamente,

Oficina de Logística – PROVIAS NACIONAL`;




    if(emails.length>0){ this._emailService.enviar(emails,emailAsunto,emailContenido); };
    if(numeros.length>0){ this._smsService.enviar(numeros,codigos,smsContenido); };

    swal({
      text: "El Requerimiento fue creado correctamente!",
      type: 'success',
      buttonsStyling: false,
      confirmButtonClass: "btn btn-success"
    }).then(function () {
      this.router.navigate(['/egp-requerimiento/comprador/buscar']);
      //this.router.navigate(["/egp-requerimiento/comprador/buscar"], { relativeTo: this.activatedRoute });
    });


    /*
    if (!this.validar()) {
      return false;
    }

    if (this.id == 0) {
      this.create();
    } else {
      let $this = this;
      swal({
        text: "Editado!",
        type: 'success',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-success"
      }).then(function () {
        $this.router.navigate(["/egp-requerimiento/comprador/buscar"], { relativeTo: $this.activatedRoute });
      });
    }
    */


  }

  private create(): void {
    this.item.fechainicio = moment(moment(this.item.fechainiciod + " " + this.item.fechainiciot, "MM/DD/YYYY hh:mm a").toDate()).format("MM-DD-YYYY H:mm:ss");
    this.item.fechafin = moment(moment(this.item.fechafind + " " + this.item.fechafint, "MM/DD/YYYY hh:mm a").toDate()).format("MM-DD-YYYY H:mm:ss");
    let $this = this;

    this._dataService.add(this.item).subscribe(resp => {
      console.log("resp", resp);
      if (resp.status == 200) {
        swal({
          text: "Registro satisfactorio!",
          type: 'success',
          buttonsStyling: false,
          confirmButtonClass: "btn btn-warning"
        }).then(function () {
          $this.router.navigate(["/egp-requerimiento/comprador/buscar"], { relativeTo: $this.activatedRoute });
        });
      } else {
        swal({
          text: "Ocurrió un error!",
          type: 'error',
          buttonsStyling: false,
          confirmButtonClass: "btn btn-error"
        }).then(function () {
          $this.router.navigate(["/egp-requerimiento/comprador/buscar"], { relativeTo: $this.activatedRoute });
        });
      }

    },
      error => {
        swal({
          text: "Ocurrió un error!",
          type: 'error',
          buttonsStyling: false,
          confirmButtonClass: "btn btn-error"
        }).then(function () {
          $this.router.navigate(["/egp-requerimiento/comprador/buscar"], { relativeTo: $this.activatedRoute });
        });
      });
  }

  validarProveedorInvitado() {
    if (this.proveedorInvitado.razonsocial == null || this.proveedorInvitado.razonsocial == "") {
      swal({
        text: "Razón social es un campo requerido. Por favor completar y volver a intentar!",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });

      return false;
    }

    return true;
  }

  grabarProveedorInvitado() {

    if (!this.validarProveedorInvitado()) {
      return false;
    }


    let lista_ordenado = this.item.proveedoresinvitados.sort((n, n1): number => {
      if (n.id < n1.id) return -1;
      if (n.id > n1.id) return 1;
      return 0;
    });
    if (lista_ordenado.length > 0)
      this.proveedorInvitado.id = lista_ordenado[lista_ordenado.length - 1].id + 1;
    else
      this.proveedorInvitado.id = 1;
    this.item.proveedoresinvitados.push(this.proveedorInvitado);


    setTimeout(function () {
      dtProveedoresInvitados.ajax.reload();

    }, 500);

    $("#mdlProveedorInvitado").modal('toggle');
  }

  grabarArchivoAdjunto() {
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



  grabarArticulo() {
    if (!this.validarDetalleArticulo()) {
      return false;
    }

    this.iArticulo++;

    this.item.productos.push(<Producto>{
      in_codigoproductoxrfq: this.iArticulo, in_idrfq: this.item.nroreq, id_rfq: this.item.nroreq, cantidad: this.producto.cantidad,
      nombreproducto: this.producto.nombreproducto, codigoproducto: this.producto.codigoproducto, description: "", descripcionproducto: "", nroparte: "", unidad: this.producto.unidad
    });

    /*this.dtArticulos.dataRows = [];

    for (var xI = 0; xI < this.item.productos.length; xI++) {
      this.dtArticulos.dataRows.push([this.item.productos[xI].codigoproducto + "", this.item.productos[xI].nombreproducto,
      this.item.productos[xI].description, this.item.productos[xI].cantidad, this.item.productos[xI].unidad, '']);
    }*/

    $("#mdlArticulo").modal('toggle');
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
    });

    if (this.id > 0) {
      this.toggleButton = true;

    } else {
      this.toggleButton = false;
    }

    this.dtDetalleAtributos = {
      headerRow: ['Nombre', 'Operador', 'Valor', 'Unidad', 'Obligatorio', 'Acciones'],
      footerRow: ['Nombre', 'Operador', 'Valor', 'Unidad', 'Obligatorio', 'Acciones'],

      dataRows: [
        ['F. Entrega', '=', '', '', 'Si', ''],
        ['Equivalencia', '=', '', '', 'No', ''],
      ]
    };

    oRequerimientoCompradorFormularioComponent = this;

    this.util.listPrioridades(function (data: ComboItem[]) {
      oRequerimientoCompradorFormularioComponent.listPrioridadCombo = data;
    });

    this.util.listMonedas(function (data: ComboItem[]) {
      oRequerimientoCompradorFormularioComponent.listMonedaCombo = data;
    });

    this.util.listUnidades(function (data: ComboItem[]) {
      oRequerimientoCompradorFormularioComponent.listUnidadCombo = data;
    });

  }


  ngOnChanges(changes: SimpleChanges) {

  }

  ngAfterViewInit() {
    $('#mdlProveedorInvitado').on('shown.bs.modal', function () {
      oRequerimientoCompradorFormularioComponent.proveedoresInvitado = new ProveedorInvitado();
    });

    $('#mdlArticulo').on('shown.bs.modal', function () {
      oRequerimientoCompradorFormularioComponent.producto = new Producto();
      $("#cmbObjetoContratacion").val("");
    });

    $('#mdlArchivosAdjuntos').on('shown.bs.modal', function () {
      $('#btnEliminarAA').click();

    });

    dtArchivos = $('#dtArchivos').on('init.dt', function (e, settings, json) {
      DatatableFunctions.initDatatable(e, settings, json, dtArchivos);
    }).DataTable({
      ajax: function (data, callback, settings) {

        let result = {
          data: oRequerimientoCompradorFormularioComponent.item.docadjuntos

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


    // Edit record
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
        var lista = oRequerimientoCompradorFormularioComponent.item.docadjuntos as Archivo[];
        var listafiltrada = lista.filter(a => a.id != row_id);
        oRequerimientoCompradorFormularioComponent.item.docadjuntos = JSON.parse(JSON.stringify(listafiltrada));
        setTimeout(function () {
          dtArchivos.ajax.reload();

        }, 500);
      }, function (dismiss) {
      // dismiss can be 'cancel', 'overlay',
      // 'close', and 'timer'

    });



      e.preventDefault();
    });




    /* var dtArticulos = $('#dtArticulos').DataTable({
       columnDefs: [
         { targets: 'disabled-sorting', orderable: false }
       ],
 
 
     });*/


    dtArticulos = $('#dtArticulos').on('init.dt', function (e, settings, json) {
      DatatableFunctions.initDatatable(e, settings, json, dtArticulos);
    }).DataTable({
      ajax: function (data, callback, settings) {

        let result = {
          data: oRequerimientoCompradorFormularioComponent.item.productos

        };
        callback(
          result
        );
      },
      columns: [
        { data: 'codigoproducto' },
        { data: 'codigoproducto' },
        { data: 'nombreproducto' },
        { data: 'descripcionproducto' },
        { data: 'cantidad' },
        { data: 'unidad' },
        { data: 'codigoproducto' },
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


            return '<div class="text-center"><a href="javascript:void(0);" row-id="' + row.id + '">' +
              '<button class="btn btn-simple btn-info btn-icon edit" data-toggle="modal" data-target="#mdlArticulo" rel="tooltip" title="Atributos" data-placement="left">' +
              ' <i class="material-icons">visibility</i></button></a>' +
              ' <button class="btn btn-simple btn-danger btn-icon remove" rel="tooltip" title="Eliminar" data-placement="left">' +
              '<i class="material-icons">delete</i></button>' +
              '</div>';
          },
          targets: 6
        }
      ]

    });






    dtArticulos.on('click', '.edit', function (event) {
      var $tr = $(this).closest('tr');
      let id = $tr.find("a").attr('row-id');

      event.preventDefault();
    });
    dtArticulos.on('click', '.remove', function (e) {

      var $tr = $(this).closest('tr');
      row_id = $tr.find("a").attr('row-id') as number;

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
        var lista = oRequerimientoCompradorFormularioComponent.item.productos as ProveedorInvitado[];
        var listafiltrada = lista.filter(a => a.id != row_id);
        oRequerimientoCompradorFormularioComponent.item.proveedores = JSON.parse(JSON.stringify(listafiltrada));
        setTimeout(function () {
          dtProveedores.ajax.reload();

        }, 500);
      }, function (dismiss) {
      // dismiss can be 'cancel', 'overlay',
      // 'close', and 'timer'

    }
    
    );


      e.preventDefault();
    });


    var 
    esBuscar = $('#dtProveedoresBuscar').DataTable({

      ajax: function (data, callback, settings) {

        let result = {
          data: oRequerimientoCompradorFormularioComponent.proveedores

        };
        callback(
          result
        );
      },
      columns: [
        { data: 'usuario' },

        { data: 'id' },
      ],
      columnDefs: [

        {

          render: function (data, type, row) {


            return '<div class="text-center"><a class="editar" href="javascript:void(0);" row-id="' + row.id + '">' +
              '<button class="btn btn-simple btn-info btn-icon add" rel="tooltip" title="Agregar" data-placement="left">' +
              '<label><input type="checkbox" name="optionsCheckboxes" ></label>' +
              '</button></a></div>';
          },
          targets: 1
        }
      ]

    });





    dtProveedores = $('#dtProveedores').on('init.dt', function (e, settings, json) {
      DatatableFunctions.initDatatable(e, settings, json, dtProveedores);
    }).DataTable({

      ajax: function (data, callback, settings) {

        let result = {
          data: oRequerimientoCompradorFormularioComponent.item.proveedores

        };
        callback(
          result
        );
      },
      columns: [
        { data: 'id' },
        { data: 'usuario' },
        { data: 'razonsocial' },
        { data: 'ruc' },
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
              '<button class="btn btn-simple btn-danger btn-icon remove" rel="tooltip" title="Eliminar" data-placement="left">' +
              '<i class="material-icons">delete</i>' +
              '</button></a></div>';
          },
          targets: 4
        }
      ]

    });

    dtProveedores.on('click', '.remove', function (e) {

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
        var lista = oRequerimientoCompradorFormularioComponent.item.proveedores as ProveedorInvitado[];
        var listafiltrada = lista.filter(a => a.id != row_id);
        oRequerimientoCompradorFormularioComponent.item.proveedores = JSON.parse(JSON.stringify(listafiltrada));
        setTimeout(function () {
          dtProveedores.ajax.reload();

        }, 500);
      }, function (dismiss) {
      // dismiss can be 'cancel', 'overlay',
      // 'close', and 'timer'

    });


      e.preventDefault();
    });

    dtProveedoresInvitados = $('#dtProveedoresInvitados').on('init.dt', function (e, settings, json) {
      DatatableFunctions.initDatatable(e, settings, json, dtProveedoresInvitados);
    }).DataTable({

      ajax: function (data, callback, settings) {

        let result = {
          data: oRequerimientoCompradorFormularioComponent.item.proveedoresinvitados

        };
        callback(
          result
        );
      },
      columns: [
        { data: 'razonsocial' },
        { data: 'ruc' },
        { data: 'email' },
        { data: 'movil' },
      ],
      columnDefs: [
        /*
        {

          render: function (data, type, row) {
            return '<div class="text-right" height="100%"><div class="checkbox text-right"><label><input type="checkbox" name="optionsCheckboxes"></label></div></div>';
          },

          targets: 0
        },
        */
        {

          render: function (data, type, row) {

            return '<div class="text-center"><a class="editar" href="javascript:void(0);" row-id="' + row.id + '">' +
              '<button class="btn btn-simple btn-danger btn-icon remove" rel="tooltip" title="Eliminar" data-placement="left">' +
              '<i class="material-icons">delete</i>' +
              '</button></a></div>';
          },
          targets: 4
        }
      ]
    });

    dtProveedoresInvitados.on('click', '.remove', function (e) {

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
        var lista = oRequerimientoCompradorFormularioComponent.item.proveedoresinvitados as ProveedorInvitado[];
        var listafiltrada = lista.filter(a => a.id != row_id);
        oRequerimientoCompradorFormularioComponent.item.proveedoresinvitados = JSON.parse(JSON.stringify(listafiltrada));
        setTimeout(function () {
          dtProveedoresInvitados.ajax.reload();

        }, 500);
      }, function (dismiss) {
      // dismiss can be 'cancel', 'overlay',
      // 'close', and 'timer'

    });


      e.preventDefault();
    });


    var tblDetalleAtributos = $('#dtDetalleAtributos').on('init.dt', function (e, settings, json) {
      DatatableFunctions.initDatatable(e, settings, json, tblDetalleAtributos);
    }).DataTable({
      columnDefs: [
        { targets: 'disabled-sorting', orderable: false }
      ],

    });



    if (this.id > 0) {
      this.obtener(this.id);
    }

    //  Activate the tooltips
    $('[rel="tooltip"]').tooltip();

    DatatableFunctions.registerCheckAll();


  }

  eliminarDetArticulo() {
    alert("borrarlo");
  }
}
