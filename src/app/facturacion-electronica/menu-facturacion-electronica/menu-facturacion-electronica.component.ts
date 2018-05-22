import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-facturacion-electronica',
  templateUrl: './menu-facturacion-electronica.component.html',
  styleUrls: ['./menu-facturacion-electronica.component.css']
})
export class MenuFacturacionElectronicaComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public cambioMenu(): void {
    console.log('Cambio Menu');
    alert('Cambio Menu');
  }
}
