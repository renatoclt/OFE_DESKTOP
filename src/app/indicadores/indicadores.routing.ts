import { Routes } from '@angular/router';

import { IndicadoresComponent } from './indicadores.component';

import { HasCompradorBuscarComponent } from "./comprador/has/comprador/buscar/hascompradorbuscar.component";
import { GuiaCompradorBuscarComponent } from "./comprador/guia/comprador/buscar/guiacompradorbuscar.component";
import { OcCompradorBuscarComponent } from "./comprador/ordendecompra/comprador/buscar/occompradorbuscar.component";
import { FacturaCompradorBuscarComponent } from "./comprador/facturas/comprador/buscar/facturacompradorbuscar.component";
import { PreGuiaCompradorBuscarComponent } from "./comprador/preregistroguias/comprador/buscar/prgcompradorbuscar.component";
import { RfqCompradorBuscarComponent } from "./comprador/rfq/comprador/buscar/rfqcompradorbuscar.component";

import { HasProveedorBuscarComponent } from "./proveedor/has/proveedor/buscar/hasproveedorbuscar.component";
import { GuiaProveedorBuscarComponent } from "./proveedor/guia/proveedor/buscar/guiaproveedorbuscar.component";
import { OCProveedorBuscarComponent } from "./proveedor/ordendecompra/proveedor/buscar/ocproveedorbuscar.component";
import { FacturaProveedorBuscarComponent } from "./proveedor/facturas/proveedor/buscar/facturaproveedorbuscar.component";
import { PreGuiaProveedorBuscarComponent } from "./proveedor/preregistroguias/proveedor/buscar/prgproveedorbuscar.component";
import { RfqProveedorBuscarComponent } from "./proveedor/rfq/proveedor/buscar/rfqproveedorbuscar.component";

import { IndicadoresComponent as IndicadoresComponent2 } from './comprador/indicadores.component';
import { IndicadoresComponent as IndicadoresComponent3 } from './proveedor/indicadores.component';


export const IndicadoresRoutes: Routes = [
  {
    path: '',
    component: IndicadoresComponent,
    children: [
      {
        path: 'comprador/mostrar',
        component: IndicadoresComponent2,
        children:
        [
          {
            path: 'has/buscar',
            component: HasCompradorBuscarComponent
          },
          {
            path: 'oc/buscar',
            component: OcCompradorBuscarComponent
          },
          {
            path: 'guias/buscar',
            component: GuiaCompradorBuscarComponent
          },
          {
            path: 'factura/buscar',
            component: FacturaCompradorBuscarComponent
          },
          {
            path: 'preguias/buscar',
            component: PreGuiaCompradorBuscarComponent
          },
          {
            path: 'rfqs/buscar',
            component: RfqCompradorBuscarComponent
          }
        ]
      },
      {
        path: 'proveedor/mostrar',
        component: IndicadoresComponent3,
        children:
          [
            {
              path: 'has/buscar',
              component: HasProveedorBuscarComponent
            },
            {
              path: 'oc/buscar',
              component: OCProveedorBuscarComponent
            },
            {
              path: 'guias/buscar',
              component: GuiaProveedorBuscarComponent
            },
            {
              path: 'factura/buscar',
              component: FacturaProveedorBuscarComponent
            },
            {
              path: 'preguias/buscar',
              component: PreGuiaProveedorBuscarComponent
            },
            {
              path: 'rfqs/buscar',
              component: RfqProveedorBuscarComponent
            }
          ]
      }
    ]
  }
];
