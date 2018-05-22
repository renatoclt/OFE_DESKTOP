//URLs
import {Component} from '@angular/core';
import {environment} from '../../environments/environment';

//URL Local compilado
//export const BASE_URL = "https://ebiz-api-dev-001.azure-api.net/";
export const BASE_URL = environment.BASE_URL;


//URL Local
//export const BASE_URL = "http://localhost/";
//URL produccion compilado
//export const BASE_URL = "http://b2miningdata.com/ui/";
//export const URL_OAUTH: string = BASE_URL + "ms-security/api/oauth";


export const URL_OAUTH: string = BASE_URL + "security/v1/oauth";
export const URL_OAUTH_KILL: string = BASE_URL + "security/v1/token";

export const URL_PARAMS: string = BASE_URL + "ms-param/api";
export const URL_ORDER_WORK: string = BASE_URL + "ms-ot/api";
//export const URL_GET_USER: string = BASE_URL + "ms-security/api/user";
export const URL_GET_USER: string = BASE_URL + "security/v1/user";
export const URL_CUSTOMER: string = BASE_URL + "ms-customer/api";

//Constantes
export const URL_OAUTH_CLIENT_ID: string = "clientapp";
export const OAUTH_CLIENT_SECRET: string = "123456";
export const OAUTH_GRANT_TYPE: string = "password";
export const OCP_APIM_SUBSCRIPTION_KEY: string = environment.OCP_APIM_SUBSCRIPTION_KEY;



export const GOOGLE_MAPS_KEY = "AIzaSyAFIiIp7i0ocwO_1sgkO7Sn7NKaqUgBFNo";

//parametros table id
export const PARAMS_DIRIGIDO_TABLE_ID = "0000000006";
export const PARAMS_TIPO_OT_TABLE_ID = "0000000002";
export const PARAMS_SUB_TIPO_OT_TABLE_ID = "0000000003";
export const PARAMS_PRIORIDAD_TABLE_ID = "0000000005";




//DETRACCION
export const URL_BUSCAR_DETRACCIONES=";"
//RETENCION
export const URL_BUSCAR_RETENCIONES=";"
//

// ORDEN DECOMPRA
export const URL_BUSCAR_OC =  BASE_URL + "oc/msoclistar/v1/ordenes/";
//export const URL_BUSCAR_OC =  BASE_URL + "api/msoclistar/v1/ordenes/";
export const URL_DETALLE_OC =  BASE_URL + "oc/msocd/v1/ocs/";
//export const URL_DETALLE_OC =  BASE_URL + "api/msocd/v1/ocs/";
export const URL_CAMBIO_ESTADO_OC =  BASE_URL + "oc/msproductor/v1/comandos/oc?accion=cambioestado";
//'api/msproductor/v1/comandos/oc?accion=cambioestado'
//https://ebiz-api-dev-001.azure-api.net/oc/msproductor/v1/comandos/oc?accion=cambioestado

// GUIA
export const URL_EXISTE_GUIA =  BASE_URL + "guia/msguialistar/v1/guias/existe/";
export const URL_BUSCAR_GUIA =  BASE_URL + "guia/msguialistar/v1/guias/";
export const URL_BUSCAR_GUIA_BORRADOR =  BASE_URL + "borrador/msbrl/v1/borradores/guia/";


//export const URL_BUSCAR_GUIA =  BASE_URL + "api/msguialistar/v1/guias/";
export const URL_DETALLE_GUIA =  BASE_URL + "guia/msguiasdetalle/v1/guias/";


export const URL_AGREGAR_GUIA =  BASE_URL + "guia/msproductor/v1/comandos/guia/";

export const URL_DETALLE_GUIA_BORRADOR =  BASE_URL + "borrador/msbrd/v1/borradores/guia/";

export const URL_AGREGAR_GUIA_BORRADOR= BASE_URL + 'borrador/msproductor/v1/borradores/guia';

export const URL_DESCARTAR_GUIA_BORRADOR= BASE_URL + 'borrador/msproductor/v1/borradores/guia';


// CONFORMIDAD SERVICIO HAS
export const URL_BUSCAR_HAS =  BASE_URL + "hoja/mshaslistar/v1/has/";
//export const URL_BUSCAR_HAS =  BASE_URL + "api/mshaslistar/v1/has/";
export const URL_DETALLE_HAS =  BASE_URL + "hoja/mshasdetalle/v1/has/";

//https://ebiz-api-dev-001.azure-api.net/hoja/mshaslistar/v1/has/[?draw][&start][&length][&NroConformidadServicio][&CodigoHASERP][&Estado][&FechaAprobacion_inicio][&FechaAprobacion_fin][&column_names][&order_colum][&order_direc]
// COMPROBANTE PAGO
export const URL_BUSCAR_CP =  BASE_URL + "cp/mscplistar/v1/comprobantes/";
export const URL_BUSCAR_CP_BORRADOR =  BASE_URL + "borrador/msbrl/v1/borradores/cp/";
//export const  =  BASE_URL + "api/mscplistar/v1/comprobantes/";
export const URL_DETALLE_CP =  BASE_URL + "cp/mscpdetalle/v1/comprobantesdepago/";

export const URL_AGREGAR_CP =  BASE_URL + "cp/msproductor/v1/comandos/comprobante/";

export const URL_DETALLE_CP_BORRADOR =  BASE_URL + "borrador/msbrd/v1/borradores/cp/";
//export const URL_DETALLE_CP_BORRADOR =  BASE_URL + "http://b2miningdata.com/api/msbrd/v1/borradores/guia/;

export const URL_AGREGAR_CP_BORRADOR= BASE_URL + 'borrador/msproductor/v1/borradores/cp';

export const URL_DESCARTAR_CP_BORRADOR= BASE_URL + 'borrador/msproductor/v1/borradores/cp';
//http://40.76.86.5:8080/api/msproductor/v1/comandos/comprobante/


// ORGANIZACION
export const URL_BUSCAR_ORGANIZACION =  BASE_URL + "organizacion/msorganizacion/v1/orgs/";

//https://ebiz-api-dev-001.azure-api.net/organizacion/msorganizacion/v1/orgs

// MENU
export const URL_MENU =  BASE_URL + "utils/msutils/v1/menu/modulos";
