import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  moduleId: module.id,
  selector: 'indicadores-cmp',
  templateUrl: './indicadores.component.html'
})
export class IndicadoresComponent implements OnInit {

  public tipo:any

  constructor(
    private router:Router
  ){

  }
  ngOnInit(){
    let item = localStorage.getItem('tipo_empresa')
    this.tipo = item
    console.log(item)

  }
}