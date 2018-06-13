// URLs
import { Component } from '@angular/core';
import { environment } from 'app/../environments/environment';

// URL Local compilado
// export const BASE_URL = "https://ebiz-api-dev-001.azure-api.net/";
export const BASE_URL = environment.BASE_URL;
export const BASE_URL_WS = environment.BASE_URL_WS;
export const TIME_INACTIVE = environment.TIME_INACTIVE;
export const ATTACHED_FILES = environment.ATTACHED_FILES;

// URL Local
// export const BASE_URL = "http://localhost/";
// URL produccion compilado
// export const BASE_URL = "http://b2miningdata.com/ui/";
// export const URL_OAUTH: string = BASE_URL + "ms-security/api/oauth";

// export const URL_PRODUCER: string = BASE_URL_WS + 'api/msproductor/v1/envio_kafka';
export const URL_CONSUMER: string = BASE_URL_WS + 'api/msconsumidor/v1/respuestas';


export const URL_OAUTH: string = BASE_URL + 'security/v1/oauth';
export const URL_OAUTH_KILL: string = BASE_URL + 'security/v1/token';
export const URL_OAUTH_REFRESH: string = URL_OAUTH + '/token';

export const URL_PARAMS: string = BASE_URL + 'ms-param/api';
export const URL_ORDER_WORK: string = BASE_URL + 'ms-ot/api';
// export const URL_GET_USER: string = BASE_URL + 'ms-security/api/user';
export const URL_GET_USER: string = BASE_URL + 'security/v1/user';
export const URL_CUSTOMER: string = BASE_URL + 'ms-customer/api';

// Constantes
export const URL_OAUTH_CLIENT_ID: string = 'clientapp';
export const OAUTH_CLIENT_SECRET: string = '123456';
export const OAUTH_GRANT_TYPE: string = 'password';
export const OAUTH_GRANT_TYPE_REFRESH_TOKEN: string = 'refresh_token';

export const OCP_APIM_SUBSCRIPTION_KEY: string = environment.OCP_APIM_SUBSCRIPTION_KEY;

// MENU
export const URL_MENU =  BASE_URL + 'utils/msutils/v1/menu/modulos';

export const GOOGLE_MAPS_KEY = 'AIzaSyAFIiIp7i0ocwO_1sgkO7Sn7NKaqUgBFNo';

// parametros table id
export const PARAMS_DIRIGIDO_TABLE_ID = '0000000006';
export const PARAMS_TIPO_OT_TABLE_ID = '0000000002';
export const PARAMS_SUB_TIPO_OT_TABLE_ID = '0000000003';
export const PARAMS_PRIORIDAD_TABLE_ID = '0000000005';




// USO GENERAL
export const URL_ENVIAR_CORREO_ELECTRONICO = BASE_URL + 'mensajes/msgestmsg/v1/mail';
export const URL_ENVIAR_MENSAJE_TEXTO = BASE_URL + 'mensajes/msgestmsg/v1/sms';

/******************************************************************************************************************/
/*************** SUPER MIX ****************************************************************************************/

export const BASE_SUPERMIX = BASE_URL; //"https://dev.ebizlatindata.com/";

// REQUERIMIENTO
export const URL_PRUEBA_RFQ= BASE_SUPERMIX + "rfq/msrfqbusqueda/v1/rfqs/";
// DETALLE-RFQ   
export const URL_DETALLE_RFQ= BASE_SUPERMIX + "rfq/msrfqbusqueda/v1/rfqs/";

export const URL_CAMBIO_ESTADO_RFQ = BASE_SUPERMIX + 'rfq/msproductor/v1/comandos/rfq?accion=cambioestado';

// COTIZACIÓN
export const URL_CREAR_QT = BASE_SUPERMIX + "qt/msproductor/v1/comandos/qt";
export const URL_GENERAR_NUMSEG_QT = BASE_SUPERMIX + "rfq/msrfqbusqueda/v1/rfqs/qtnum/qt";
export const URL_BUSCAR_QT= BASE_SUPERMIX + "qt/msqtbusqueda/v1/cotizaciones/"; 
export const URL_BUSCAR_QT_BORRADOR= BASE_SUPERMIX + "borrador/msbrl/v1/borradores/qt/";
export const URL_DETALLE_QT= BASE_SUPERMIX + "qt/msqtbusqueda/v1/cotizaciones/";
export const URL_AGREGAR_QT_BORRADOR= BASE_SUPERMIX + "borrador/msproductor/v1/borradores/qt/";
// FALTA URI DE DETALLE 
export const URL_DETALLE_QT_BORRADOR = BASE_SUPERMIX + "borrador/msbrl/v1/borradores/qt/";

// DETRACCION
export const URL_BUSCAR_DETRACCION= BASE_SUPERMIX + "detraccion/msdetbusqueda/v1/detracciones/";
/*URL DETALLE DETRACCION*/
export const URL_DETALLE_DETRACCION= BASE_SUPERMIX + "detraccion/msdetbusqueda/v1/detracciones/";

// RETENCION
export const URL_BUSCAR_RETENCIONES=  BASE_SUPERMIX + "retencion/msretbusqueda/v1/retenciones/" ;
/*URL DETALLE RETENCION*/
export const URL_DETALLE_RETENCIONES=  BASE_SUPERMIX + "retencion/msretbusqueda/v1/retenciones/";

/******************************************************************************************************************/
/******************************************************************************************************************/


// ORDEN DECOMPRA 
export const URL_BUSCAR_OC =  BASE_URL + "oc/msoclistar/v1/ordenes/";
// export const URL_BUSCAR_OC =  BASE_URL + "api/msoclistar/v1/ordenes/";
export const URL_DETALLE_OC =  BASE_URL + "oc/msocd/v1/ocs/";
// export const URL_DETALLE_OC =  BASE_URL + "api/msocd/v1/ocs/";
export const URL_CAMBIO_ESTADO_OC =  BASE_URL + "oc/msproductor/v1/comandos/oc?accion=cambioestado";
// 'api/msproductor/v1/comandos/oc?accion=cambioestado'
// https://ebiz-api-dev-001.azure-api.net/oc/msproductor/v1/comandos/oc?accion=cambioestado

// GUIA
export const URL_EXISTE_GUIA =  BASE_URL + "guia/msguialistar/v1/guias/existe/";
export const URL_BUSCAR_GUIA =  BASE_URL + "guia/msguialistar/v1/guias/";
export const URL_BUSCAR_GUIA_BORRADOR =  BASE_URL + "borrador/msbrl/v1/borradores/guia/";


// export const URL_BUSCAR_GUIA =  BASE_URL + "api/msguialistar/v1/guias/";
export const URL_DETALLE_GUIA =  BASE_URL + "guia/msguiasdetalle/v1/guias/";


export const URL_AGREGAR_GUIA =  BASE_URL + "guia/msproductor/v1/comandos/guia/";

export const URL_DETALLE_GUIA_BORRADOR =  BASE_URL + "borrador/msbrd/v1/borradores/guia/";

export const URL_AGREGAR_GUIA_BORRADOR= BASE_URL + 'borrador/msproductor/v1/borradores/guia';

export const URL_DESCARTAR_GUIA_BORRADOR= BASE_URL + 'borrador/msproductor/v1/borradores/guia';


// CONFORMIDAD SERVICIO HAS 
export const URL_BUSCAR_HAS =  BASE_URL + "hoja/mshaslistar/v1/has/";
// export const URL_BUSCAR_HAS =  BASE_URL + "api/mshaslistar/v1/has/";
export const URL_DETALLE_HAS =  BASE_URL + "hoja/mshasdetalle/v1/has/";

// https://ebiz-api-dev-001.azure-api.net/hoja/mshaslistar/v1/has/[?draw][&start][&length][&NroConformidadServicio][&CodigoHASERP][&Estado][&FechaAprobacion_inicio][&FechaAprobacion_fin][&column_names][&order_colum][&order_direc]
// COMPROBANTE PAGO 
export const URL_BUSCAR_CP =  BASE_URL + "cp/mscplistar/v1/comprobantes/";
export const URL_BUSCAR_CP_BORRADOR =  BASE_URL + "borrador/msbrl/v1/borradores/cp/";
// export const  =  BASE_URL + "api/mscplistar/v1/comprobantes/";
export const URL_DETALLE_CP =  BASE_URL + "cp/mscpdetalle/v1/comprobantesdepago/";

export const URL_AGREGAR_CP =  BASE_URL + "cp/msproductor/v1/comandos/comprobante/";

export const URL_DETALLE_CP_BORRADOR =  BASE_URL + "borrador/msbrd/v1/borradores/cp/";
// export const URL_DETALLE_CP_BORRADOR =  BASE_URL + "http://b2miningdata.com/api/msbrd/v1/borradores/guia/;

export const URL_AGREGAR_CP_BORRADOR= BASE_URL + 'borrador/msproductor/v1/borradores/cp';

export const URL_DESCARTAR_CP_BORRADOR= BASE_URL + 'borrador/msproductor/v1/borradores/cp';
// http://40.76.86.5:8080/api/msproductor/v1/comandos/comprobante/


/***********************************************************************************************************************/
/*************** ADMINISTRACIÓN ****************************************************************************************/
// Temporal <<<<<<<<=======
let IP_GATEWAY:string = 'http://52.170.84.241/';
// Parametros de tabla
export const PAGINA_INICIAL:number = 0;
export const MOSTRAR_RESULTADOS:any = [10, 20, 50, 100];
export const MOSTRAR:number = 10;
// Administracion
export const URI_ADMIN_LISTA =  BASE_URL + 'administracion/msadmlistar/v1/';
export const URI_ADMIN_CREAR =  BASE_URL + 'administracion/msproductor/v1/comandos/admcrear';
// export const URI_ADMIN_LISTA = 'http://52.170.84.241/api/msadmlistar/v1/';
// Master
export const URI_MASTER_LISTA =  BASE_URL + 'maestro/msmaestro/v1/params/';
// ORGANIZACION 
export const URL_BUSCAR_ORGANIZACION =  BASE_URL + 'organizacion/msorganizacion/v1/orgs/';
//https://ebiz-api-dev-001.azure-api.net/organizacion/msorganizacion/v1/orgs


// USUARIO
export const URL_BUSCAR_USUARIO =  BASE_URL + 'organizacion/msorganizacion/v1/orgs/';

// MÓDULO
export const URL_AGREGAR_MODULO =  BASE_URL + 'api/msutil/v1/inser/mod/';
export const URL_BUSCAR_MODULO =  BASE_URL + 'api/msutils/v1/modulo/lista/';



// CONTRATO
export const URL_BUSCAR_CONTRATO =  BASE_URL + 'organizacion/msorganizacion/v1/orgs/';

// PERMISOS USUARIO
export const URL_BUSCAR_PERMISOS_USUARIO =  BASE_URL + 'organizacion/msorganizacion/v1/orgs/';

/***********************************************************************************************************************/
/***********************************************************************************************************************/

// TRANSPORTE
export const URL_BUSCAR_TRANSPORTE = BASE_URL + 'transporte/mstranslistar/v1/transportes/';
export const URL_DETALLE_TRANSPORTE =  BASE_URL + 'transporte/mstranslistar/v1/transportes/';


// REPORTE
// -----HAS------
export const URL_BUSCAR_HASREPORTE = BASE_URL + 'reporte/mshaslistar/v1/has/reporte/';
// ------GUIA------
export const URL_BUSCAR_GUIAREPORTE = BASE_URL + 'reporte/msguialistar/v1/guias/reporte/';
// ------OC--------
export const URL_BUSCAR_OCREPORTE = BASE_URL + 'reporte/msoclistar/v1/ordenes/reporte/';
// ------- PRE REGISTRO FACTURA-----
export const URL_BUSCAR_FACTURA = BASE_URL + 'reporte/mscplistar/v1/comprobantes/reporte/';
// ------- PRE REGISTRO GUIA-----
export const URL_BUSCAR_PREGUIA = BASE_URL + 'reporte/msguialistar/v1/guias/reportepreguia/';
// ------- RFQS-----
export const URL_BUSCAR_RFQS = BASE_URL + 'reporte/msrfqbusqueda/v1/rfqs/reporte/';


// FACTORING
// PARAMETROS

export const URL_PARAMETROS_FACTORING = BASE_URL + 'administracion/msparambusqueda/v1/parametro/paramxregla/?draw=10&start=0&length=100&Reglanegocio=FACTORING&column_names=NombreParametro,Idreglaxparametro';

// LISTAR PARAMETROS
export const URL_BUSCAR_PARAMETROS = BASE_URL + 'administracion/msparambusqueda/v1/parametro/paramxorg/';

// EDITAR PARAMETROS
export const URL_EDITAR_PARAMETROS = BASE_URL + 'administracion/msproductor/v1/comandos/parametro/';