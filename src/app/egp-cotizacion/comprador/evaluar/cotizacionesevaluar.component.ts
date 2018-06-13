import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';





import { AppUtils } from "../../../utils/app.utils";
import { MasterService } from '../../../service/masterservice';

declare var DatatableFunctions: any;

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];

}
declare var $: any;
var oCotizacionesEvaluarComponent;
var datatable;
@Component({
  moduleId: module.id,
  selector: 'cotizacionesevaluar-cmp',
  templateUrl: 'cotizacionesevaluar.component.html',
  providers: [MasterService]
})

export class CotizacionesEvaluarComponent implements OnInit, AfterViewInit {
  util: AppUtils;
  

  public navigate(nav) {

    this.router.navigate(nav, { relativeTo: this.route });
  }
  constructor(private router: Router, private route: ActivatedRoute, private _masterService: MasterService) {
    this.util = new AppUtils(this.router, this._masterService);
  }
  



  ngOnInit() {

    oCotizacionesEvaluarComponent = this;

   
  }

  ngAfterViewInit() {


   
  }


}





