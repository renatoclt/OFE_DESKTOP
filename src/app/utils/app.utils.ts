import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MasterService } from '../service/masterservice';
import { ComboItem } from '../model/comboitem';

declare var jQuery: any;
declare var pleaseWait: any;
declare var loadingScreen: any;

@Injectable()
export class AppUtils {

  errorMessage: string;
  messagePost: string;
  isLoading: boolean;

  constructor(private router: Router, private _dataService: MasterService) {
      this.errorMessage = '';
      this.messagePost = '';
      this.isLoading = true;
  }

  public toHtmlEntities(value: string) {
    return value.replace(/&#(\d+);/g, function (match, dec) {
      return String.fromCharCode(dec);
    });
  }

  public tokenValid(){
    if (!this.checkExpiration()){
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

  public checkExpiration(){
    const expires = new Date(Number(localStorage.getItem('expires')));
    let currentDate = new Date();
    return (currentDate <= expires);
  }

  public newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  public redirect(path: string) {
    this.router.navigateByUrl(path);
  }

  public reditectWithParam(parameters: any[]) {
    this.router.navigate(parameters);
  }

  public obtenerParametro(activateRoute: ActivatedRoute, parameterName: string): string {
    let paramValue = "";

    activateRoute.params.forEach(
      (params: Params) => {
        paramValue = params[parameterName];
        console.log(params);
      }
    );

    return paramValue;
  }

  public listUnidadMedida(callbackfn: Function) {
    const listComboItem: ComboItem[] = [];
    this._dataService
      .listar('1b9a0ddb-1c6a-2687-a501-2885d082eba2', '10000')
      // .listar(localStorage.getItem('listUnidadMedida'), '10000')
      .subscribe(
      p => {
        for (let xI = 0; xI < p.data.length; xI++) {
          if (p.data[xI].vc_IDREGISTRO === '0000000') {
            continue;
          }

          let ci = new ComboItem();
          ci.valor = p.data[xI].vc_DESC_CORTA;
          ci.desc = p.data[xI].vc_DESC_LARGA_ES;
          listComboItem.push(ci);
        }
        localStorage.setItem('listUnidadMedida', JSON.stringify(p.data));
        callbackfn(listComboItem);
      },
      e => this.errorMessage = e,
      () => this.isLoading = false);
  }

  public listUnidadMedidaConTipo(callbackfn: Function) {
    let elid = localStorage.getItem('idorg');
    let listComboItem: ComboItem[] = [];
    this._dataService
      .listar(elid, '10000')
      .subscribe(
      p => {

        for (var xI = 0; xI < p.data.length; xI++) {
          if (p.data[xI].vc_IDREGISTRO === '0000000') {
            continue;
          }
          let ci = new ComboItem();
          ci.valor = p.data[xI].vc_DESC_CORTA;
          ci.desc = p.data[xI].vc_DESC_CORTA;
          listComboItem.push(ci);
        }
        localStorage.setItem('listMonedas', JSON.stringify(p.data));
        callbackfn(listComboItem);
      },
      e => this.errorMessage = e,
      () => this.isLoading = false);
  }

 /* private listUnidadMedidaConTipo(callbackfn: Function, tipo: string) {

    let listComboItem: ComboItem[] = [];
    this._dataService
      .listarConTipo("1", "10000", tipo)
      .subscribe(
      p => {

        for (var xI = 0; xI < p.data.length; xI++) {
          if (p.data[xI].vc_IDREGISTRO == "0000000") {
            continue;
          }

          let ci = new ComboItem();
          ci.valor = p.data[xI].vc_DESC_CORTA;
          ci.desc = p.data[xI].vc_DESC_LARGA_ES;
          // /*
          // if(p.data[xI].vc_TIPO===tipo)
             listComboItem.push(ci);
        }
        localStorage.setItem('listUnidadMedidaConTipo_'+tipo, JSON.stringify(p.data));
        callbackfn(listComboItem);
      },
      e => this.errorMessage = e,
      () => this.isLoading = false);
  }
*/

  public listUnidadMedidaMasa(callbackfn: Function){
    this.listUnidadMedidaConTipo(callbackfn);
  }

  public listUnidadMedidaVolumen(callbackfn: Function){
    this.listUnidadMedidaConTipo(callbackfn);
  }

  public listMonedas(callbackfn: Function) {
    const listComboItem: ComboItem[] = [];
    this._dataService
      .listar('1', '10001')
      .subscribe(
      p => {

        for (var xI = 0; xI < p.data.length; xI++) {
          if (p.data[xI].vc_IDREGISTRO === '0000000') {
            continue;
          }
          let ci = new ComboItem();
          ci.valor = p.data[xI].vc_DESC_CORTA;
          ci.desc = p.data[xI].vc_DESC_CORTA;
          listComboItem.push(ci);
        }
        localStorage.setItem('listMonedas', JSON.stringify(p.data));
        callbackfn(listComboItem);
      },
      e => this.errorMessage = e,
      () => this.isLoading = false);
  }

  public listPrioridades(callbackfn: Function) {
    const listComboItem: ComboItem[] = [];
    this._dataService
      .listar('0', '10002')
      .subscribe(
      p => {
        for (let xI = 0; xI < p.data.length; xI++) {
          if (p.data[xI].vc_IDREGISTRO === '0000000') {
            continue;
          }
          let ci = new ComboItem();
          ci.valor = p.data[xI].vc_DESC_CORTA;
          ci.desc = p.data[xI].vc_DESC_LARGA_ES;
          listComboItem.push(ci);
        }
        localStorage.setItem('listPrioridades', JSON.stringify(p.data));
        callbackfn(listComboItem);
      },
      e => this.errorMessage = e,
      () => this.isLoading = false);
  }

  public listPaises(callbackfn: Function) {
    let listComboItem: ComboItem[] = [];
    this._dataService
      .listar("0", "10003")
      .subscribe(
      p => {
        for (let xI = 0; xI < p.data.length; xI++) {
          if (p.data[xI].vc_IDREGISTRO === '0000000') {
            continue;
          }
          let ci = new ComboItem();

          ci.valor = p.data[xI].vc_ISO;
          ci.desc = p.data[xI].vc_ISO;
          listComboItem.push(ci);
        }
        localStorage.setItem('listPaises', JSON.stringify(p.data));
        callbackfn(listComboItem);
      },
      e => this.errorMessage = e,
      () => this.isLoading = false);
  }

  public listTipoDoc(callbackfn: Function) {
    let listComboItem: ComboItem[] = [];
    this._dataService
      .listar('0', '10004')
      .subscribe(
      p => {
        for (var xI = 0; xI < p.data.length; xI++) {
          if (p.data[xI].vc_IDREGISTRO === '0000000') {
            continue;
          }
          let ci = new ComboItem();
          ci.valor = p.data[xI].vc_DESC_CORTA;
          ci.desc = p.data[xI].vc_DESC_LARGA_ES;
          listComboItem.push(ci);
        }
        localStorage.setItem('listTipoDoc', JSON.stringify(p.data));
        callbackfn(listComboItem);
      },
      e => this.errorMessage = e,
      () => this.isLoading = false);
  }

  public listTipoComprobante(callbackfn: Function) {
      let listComboItem: ComboItem[] = [];
      this._dataService
        .listar('0', '10007')
        .subscribe(
        p => {
          for (var xI = 0; xI < p.data.length; xI++) {
            if (p.data[xI].vc_IDREGISTRO === '0000000') {
              continue;
            }
            let ci = new ComboItem();
            ci.valor = p.data[xI].vc_DESC_CORTA;
            ci.desc = p.data[xI].vc_DESC_LARGA_ES;
            listComboItem.push(ci);
          }
          localStorage.setItem('listTipoComprobante', JSON.stringify(p.data));
          callbackfn(listComboItem);
        },
        e => this.errorMessage = e,
        () => this.isLoading = false);
  }

  public listBanco(callbackfn: Function) {
      let listComboItem: ComboItem[] = [];
      this._dataService
        .listar('0', '10006')
        .subscribe(
        p => {
          for (let xI = 0; xI < p.data.length; xI++) {
            if (p.data[xI].vc_IDREGISTRO === '0000000') {
              continue;
            }
            let ci = new ComboItem();
            ci.valor = p.data[xI].vc_DESC_CORTA;
            ci.desc = p.data[xI].vc_DESC_LARGA_ES;
            listComboItem.push(ci);
          }
          localStorage.setItem('listBanco', JSON.stringify(p.data));
          callbackfn(listComboItem);
        },
        e => this.errorMessage = e,
        () => this.isLoading = false);
  }

  public listTipoComprobantePago(callbackfn: Function) {
      let listComboItem: ComboItem[] = [];
      this._dataService
        .listar('0', '10007')
        .subscribe(
        p => {
          for (var xI = 0; xI < p.data.length; xI++) {
            if (p.data[xI].vc_IDREGISTRO === '0000000') {
              continue;
            }
            let ci = new ComboItem();
            ci.valor = p.data[xI].vc_DESC_CORTA;
            ci.desc = p.data[xI].vc_DESC_LARGA_ES;
            listComboItem.push(ci);
          }
          localStorage.setItem('listTipoComprobantePago', JSON.stringify(p.data));
          callbackfn(listComboItem);
        },
        e => this.errorMessage = e,
        () => this.isLoading = false);
  }


  public listTratamiento(callbackfn: Function) {
      let listComboItem: ComboItem[] = [];
      this._dataService
        .listar('0', '10008')
        .subscribe(
        p => {
          for (var xI = 0; xI < p.data.length; xI++) {
            if (p.data[xI].vc_IDREGISTRO === '0000000') {
              continue;
            }
            let ci = new ComboItem();
            ci.valor = p.data[xI].vc_DESC_CORTA;
            ci.desc = p.data[xI].vc_DESC_LARGA_ES;
            listComboItem.push(ci);
          }
          localStorage.setItem('listTratamiento', JSON.stringify(p.data));
          callbackfn(listComboItem);
        },
        e => this.errorMessage = e,
        () => this.isLoading = false);
  }

  public listTipoOC(callbackfn: Function) {
      let listComboItem: ComboItem[] = [];
      this._dataService
        .listar('0', '10009')
        .subscribe(
        p => {
          for (var xI = 0; xI < p.data.length; xI++) {
            if (p.data[xI].vc_IDREGISTRO === '0000000') {
              continue;
            }
            let ci = new ComboItem();
            ci.valor = p.data[xI].vc_DESC_CORTA;
            ci.desc = p.data[xI].vc_DESC_LARGA_ES;
            listComboItem.push(ci);
          }
          localStorage.setItem('listTipoOC', JSON.stringify(p.data));
          callbackfn(listComboItem);
        },
        e => this.errorMessage = e,
        () => this.isLoading = false);
  }

  public listMotivoGuia(callbackfn: Function) {
      let listComboItem: ComboItem[] = [];
      this._dataService
        .listar('0', '10010')
        .subscribe(
        p => {
          for (let xI = 0; xI < p.data.length; xI++) {
            if (p.data[xI].vc_IDREGISTRO === '0000000') {
              continue;
            }
            let ci = new ComboItem();
            ci.valor = p.data[xI].vc_DESC_CORTA;
            ci.desc = p.data[xI].vc_DESC_LARGA_ES;
            listComboItem.push(ci);
          }
          localStorage.setItem('listMotivoGuia', JSON.stringify(p.data));
          callbackfn(listComboItem);
        },
        e => this.errorMessage = e,
        () => this.isLoading = false);
  }

  public listTransporteGuia(callbackfn: Function) {
      let listComboItem: ComboItem[] = [];
      this._dataService
        .listar('0', '10011')
        .subscribe(
        p => {
          for (var xI = 0; xI < p.data.length; xI++) {
            if (p.data[xI].vc_IDREGISTRO === '0000000') {
              continue;
            }
            let ci = new ComboItem();
            ci.valor = p.data[xI].vc_DESC_CORTA;
            ci.desc = p.data[xI].vc_DESC_LARGA_ES;
            listComboItem.push(ci);
          }
          localStorage.setItem('listTransporteGuia', JSON.stringify(p.data));
          callbackfn(listComboItem);
        },
        e => this.errorMessage = e,
        () => this.isLoading = false);
  }

  public listBienServicio(callbackfn: Function) {
      let listComboItem: ComboItem[] = [];
      this._dataService
        .listar('0', '10012')
        .subscribe(
        p => {
          for (var xI = 0; xI < p.data.length; xI++) {
            if (p.data[xI].vc_IDREGISTRO === '0000000') {
              continue;
            }
            let ci = new ComboItem();
            ci.valor = p.data[xI].vc_DESC_CORTA;
            ci.desc = p.data[xI].vc_DESC_LARGA_ES;
            listComboItem.push(ci);
          }
          localStorage.setItem('listBienServicio', JSON.stringify(p.data));
          callbackfn(listComboItem);
        },
        e => this.errorMessage = e,
        () => this.isLoading = false);
  }

  public listTipoOperacion(callbackfn: Function) {
      let listComboItem: ComboItem[] = [];
      this._dataService
        .listar('0', '10013')
        .subscribe(
        p => {
          for (var xI = 0; xI < p.data.length; xI++) {
            if (p.data[xI].vc_IDREGISTRO === '0000000') {
              continue;
            }
            let ci = new ComboItem();
            ci.valor = p.data[xI].vc_DESC_CORTA;
            ci.desc = p.data[xI].vc_DESC_LARGA_ES;
            listComboItem.push(ci);
          }
          localStorage.setItem('listTipoOperacion', JSON.stringify(p.data));
          callbackfn(listComboItem);
        },
        e => this.errorMessage = e,
        () => this.isLoading = false);
  }

  public listTipoDocIdentidad(callbackfn: Function) {
      let listComboItem: ComboItem[] = [];
      this._dataService
        .listar("0", "10015")
        .subscribe(
        p => {
          for (var xI = 0; xI < p.data.length; xI++) {
            if (p.data[xI].vc_IDREGISTRO == "0000000") {
              continue;
            }
            let ci = new ComboItem();
            ci.valor = p.data[xI].vc_DESC_CORTA;
            ci.desc = p.data[xI].vc_DESC_LARGA_ES;
            listComboItem.push(ci);
          }
          localStorage.setItem('listTipoDocIdentidad', JSON.stringify(p.data));
          callbackfn(listComboItem);
        },
        e => this.errorMessage = e,
        () => this.isLoading = false);
  }

  public listEstadoRFQ(callbackfn: Function) {
      let listComboItem: ComboItem[] = [];
      this._dataService
        .listar("0", "10005")
        .subscribe(
        p => {
          for (var xI = 0; xI < p.data.length; xI++) {
            if (p.data[xI].vc_IDREGISTRO == "0000000") {
              continue;
            }
            if (p.data[xI].vc_IDREGISTRO_PADRE == "01") {
              let ci = new ComboItem();
              ci.valor = p.data[xI].vc_DESC_CORTA;
              ci.desc = p.data[xI].vc_DESC_LARGA_ES;
              listComboItem.push(ci);
            }
          }
          localStorage.setItem('listEstadoRFQ', JSON.stringify(p.data));
          callbackfn(listComboItem);
        },
        e => this.errorMessage = e,
        () => this.isLoading = false);
  }

  public listEstadoOC(callbackfn: Function) {
    let listComboItem: ComboItem[] = [];
    this._dataService
      .listarConJerarquia("0", "10005", "10004", "03")
      .subscribe(
      p => {
        for (var xI = 0; xI < p.data.length; xI++) {
          if (p.data[xI].vc_IDREGISTRO == "0000000") {
            continue;
          }
          let ci = new ComboItem();
          ci.valor = p.data[xI].vc_DESC_CORTA;
          ci.desc = p.data[xI].vc_DESC_LARGA_ES;
          listComboItem.push(ci);
        }
        localStorage.setItem('listEstadoOC', JSON.stringify(p.data));
        callbackfn(listComboItem);
      },
      e => { this.errorMessage = e; console.log(e) },
      () => this.isLoading = false);
  }

  public listEstadoCP(callbackfn: Function) {
    let listComboItem: ComboItem[] = [];
    this._dataService
      .listarConJerarquia("0", "10005", "10004", "06")
      .subscribe(
      p => {
        for (var xI = 0; xI < p.data.length; xI++) {
          if (p.data[xI].vc_IDREGISTRO == "0000000") {
            continue;
          }
          let ci = new ComboItem();
          ci.valor = p.data[xI].vc_DESC_CORTA;
          ci.desc = p.data[xI].vc_DESC_LARGA_ES;
          listComboItem.push(ci);
        }
        localStorage.setItem('listEstadoCP', JSON.stringify(p.data));
        callbackfn(listComboItem);
      },
      e => { this.errorMessage = e; console.log(e) },
      () => this.isLoading = false);
  }

  public listEstadoGuia(callbackfn: Function) {
    let listComboItem: ComboItem[] = [];
    this._dataService
      .listarConJerarquia("0", "10005", "10004", "05")
      .subscribe(
      p => {

        for (var xI = 0; xI < p.data.length; xI++) {
          if (p.data[xI].vc_IDREGISTRO === "0000000") {
            continue;
          }
          let ci = new ComboItem();
          ci.valor = p.data[xI].vc_DESC_CORTA;
          ci.desc = p.data[xI].vc_DESC_LARGA_ES;
          listComboItem.push(ci);
        }
        localStorage.setItem('listEstadoGuia', JSON.stringify(p.data));
        callbackfn(listComboItem);
      },
      e => { this.errorMessage = e; console.log(e) },
      () => this.isLoading = false);
  }

  public listEstadoHAS(callbackfn: Function) {
    let listComboItem: ComboItem[] = [];
    this._dataService
      .listarConJerarquia("0", "10005", "10004", "13")
      .subscribe(
      p => {
        for (var xI = 0; xI < p.data.length; xI++) {
          if (p.data[xI].vc_IDREGISTRO === "0000000") {
            continue;
          }
          let ci = new ComboItem();
          ci.valor = p.data[xI].vc_DESC_CORTA;
          ci.desc = p.data[xI].vc_DESC_LARGA_ES;
          listComboItem.push(ci);
        }
        localStorage.setItem('listEstadoHAS', JSON.stringify(p.data));
        callbackfn(listComboItem);
      },
      e => { this.errorMessage = e; console.log(e) },
      () => this.isLoading = false);
  }

  public listDetraccion(callbackfn: Function) {
    let listComboItem: ComboItem[] = [];
    this._dataService
    .listarConJerarquia('67de129e-50e4-4413-b62d-9510a589cbbc', '10012', '10004', '08')
    .subscribe(
    p => {
      for (var xI = 0; xI < p.data.length; xI++) {
        if (p.data[xI].vc_IDREGISTRO === '0000000') {
          continue;
        }
        let ci = new ComboItem();
        ci.valor = p.data[xI].vc_DESC_CORTA;
        ci.desc = p.data[xI].vc_DESC_LARGA_ES;
        listComboItem.push(ci);
      }
      localStorage.setItem('listDetraccion', JSON.stringify(p.data));
      callbackfn(listComboItem);
    },
    e => { this.errorMessage = e; console.log(e) },
    () => this.isLoading = false);
  }

  public listEstadoDetraccion(callbackfn: Function) {
    let listComboItem: ComboItem[] = [];
    this._dataService
    .listarConJerarquia('0', '10005', '10004', '08')
    .subscribe(
    p => {
      for (var xI = 0; xI < p.data.length; xI++) {
        if (p.data[xI].vc_IDREGISTRO === '0000000') {
          continue;
        }
        let ci = new ComboItem();
        ci.valor = p.data[xI].vc_DESC_CORTA;
        ci.desc = p.data[xI].vc_DESC_LARGA_ES;
        listComboItem.push(ci);
      }
      localStorage.setItem('listEstadoDetraccion', JSON.stringify(p.data));
      callbackfn(listComboItem);
    },
    e => { this.errorMessage = e; console.log(e) },
    () => this.isLoading = false);
  }
  public listEstadoRetencion(callbackfn: Function) {
    let listComboItem: ComboItem[] = [];
    this._dataService
    .listarConJerarquia('0', '10005', '10004', '07')
    .subscribe(
    p => {
      for (var xI = 0; xI < p.data.length; xI++) {
        if (p.data[xI].vc_IDREGISTRO === '0000000') {
          continue;
        }
        let ci = new ComboItem();
        ci.valor = p.data[xI].vc_DESC_CORTA;
        ci.desc = p.data[xI].vc_DESC_LARGA_ES;
        listComboItem.push(ci);
      }
      localStorage.setItem('listEstadoRetencion', JSON.stringify(p.data));
      callbackfn(listComboItem);
    },
    e => { this.errorMessage = e; console.log(e) },
    () => this.isLoading = false);
  }

  public listEstadoTTransporte(callbackfn: Function) {
    let listComboItem: ComboItem[] = [];
    this._dataService
      .listarConJerarquia('0', '10005', '10004', '12')
      .subscribe(
      p => {
        for (var xI = 0; xI < p.data.length; xI++) {
          if (p.data[xI].vc_IDREGISTRO === '0000000') {
            continue;
          }
          let ci = new ComboItem();
          ci.valor = p.data[xI].vc_DESC_CORTA;
          ci.desc = p.data[xI].vc_DESC_LARGA_ES;
          listComboItem.push(ci);
        }
        localStorage.setItem('listEstadoTTransporte', JSON.stringify(p.data));
        callbackfn(listComboItem);
      },
      e => { this.errorMessage = e; console.log(e) },
      () => this.isLoading = false);
  }


  
  




  public convertStringToDate(strDate: string){
    return new Date(strDate);
  }
  

  public listUnidades(callbackfn: Function) {
    let listComboItem: ComboItem[] = [];
    this._dataService
      .listar('1', '10000')
      .subscribe(
      p => {
        for (var xI = 0; xI < p.data.length; xI++) {
          if (p.data[xI].vc_IDREGISTRO === '0000000') {
            continue;
          }
          let ci = new ComboItem();
          ci.valor = p.data[xI].vc_DESC_CORTA;
          ci.desc = p.data[xI].vc_DESC_LARGA_ES;
          listComboItem.push(ci);
        }
        callbackfn(listComboItem);
      },
      e => this.errorMessage = e,
      () => this.isLoading = false);
  }

  public listEstadosRFQ(callbackfn: Function) {
    let listComboItem: ComboItem[] = [];
    this._dataService
      .listar('0', '10005')
      .subscribe(
      p => {
        for (var xI = 0; xI < p.data.length; xI++) {
          if (p.data[xI].vc_IDREGISTRO === '0000000') {
            continue;
          }
          if (p.data[xI].vc_IDREGISTRO_PADRE === '01') {
            let ci = new ComboItem();
            ci.valor = p.data[xI].vc_DESC_CORTA;
            ci.desc = p.data[xI].vc_DESC_LARGA_ES;
            listComboItem.push(ci);
          }
        }
        callbackfn(listComboItem);
      },
      e => this.errorMessage = e,
      () => this.isLoading = false);
  }

  public listEstadosOC(callbackfn: Function) {
    let listComboItem: ComboItem[] = [];
    this._dataService
      .listarConJerarquia('0', '10005', '10004', '03')
      .subscribe(
      p => {
        for (var xI = 0; xI < p.data.length; xI++) {
          if (p.data[xI].vc_IDREGISTRO === '0000000') {
            continue;
          }
          let ci = new ComboItem();
          ci.valor = p.data[xI].vc_DESC_CORTA;
          ci.desc = p.data[xI].vc_DESC_LARGA_ES;
          listComboItem.push(ci);
        }
        callbackfn(listComboItem);
      },
      e => {this.errorMessage = e; console.log(e)},
      () => this.isLoading = false);
  }

  public reporteHas(callbackfn: Function) {
    let listComboItem: ComboItem[] = [];
    this._dataService
      .listar('0', '10005')
      .subscribe(
        p => {
          for (var xI = 0; xI < p.data.length; xI++) {
            if (p.data[xI].vc_IDREGISTRO === '0000000') {
              continue;
            }
            if (p.data[xI].vc_IDREGISTRO_PADRE === '01') {
              let ci = new ComboItem();
              ci.valor = p.data[xI].vc_DESC_CORTA;
              ci.desc = p.data[xI].vc_DESC_LARGA_ES;
              listComboItem.push(ci);
            }
          }
          callbackfn(listComboItem);
        },
        e => this.errorMessage = e,
        () => this.isLoading = false);
  }

  public listarParametros(callbackfn: Function) {
    let listComboItem: ComboItem[] = [];
    this._dataService
      .listarParametros('0', '10005')
      .subscribe(
        p => {
          for (var xI = 0; xI < p.data.data.length; xI++) {
            // if (p.data[xI].vc_IDREGISTRO === '0000000') {
            //   continue;
            // }
            //if (p.data.data[xI].vc_IDREGISTRO_PADRE === '01') {
              let ci = new ComboItem();
              ci.valor = p.data.data[xI].Idreglaxparametro;
              ci.desc = p.data.data[xI].NombreParametro;
              listComboItem.push(ci);
            //}
          }
          callbackfn(listComboItem);
        },
        e => this.errorMessage = e,
        () => this.isLoading = false);
  }


}























