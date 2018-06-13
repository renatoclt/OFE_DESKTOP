import { Routes } from '@angular/router';


import { SolpagoProveedorBuscarComponent } from './proveedor/buscar/solpagoproveedorbuscarcomponent';



export const Solpago: Routes = [
  {

    path: '',
    children: [


      {
        path: 'proveedor/buscar',
        component: SolpagoProveedorBuscarComponent
      }

    ]
  }
];
