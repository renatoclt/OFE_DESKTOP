import {Injectable} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MasterService} from '../service/masterservice';
import {ComboItem} from '../model/comboitem';


declare var jQuery: any;
declare var pleaseWait: any;
declare var loadingScreen: any;
@Injectable()
export class AppUtils {

  errorMessage: string = '';
  messagePost: string = '';
  isLoading: boolean = true;
  constructor(private router: Router, private _dataService: MasterService) {
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
    var expires = new Date(Number(localStorage.getItem('expires')));
    var currentDate = new Date();
    return (currentDate <= expires);
  }

  public newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
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
    let listComboItem: ComboItem[] = [];
    this._dataService
      .listar("1", "10000")
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
        localStorage.setItem('listUnidadMedida', JSON.stringify(p.data));
        callbackfn(listComboItem);
      },
      e => this.errorMessage = e,
      () => this.isLoading = false);
  }

  private listUnidadMedidaConTipo(callbackfn: Function, tipo: string) {

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
          /*
          if(p.data[xI].vc_TIPO===tipo)*/
             listComboItem.push(ci);
        }
        localStorage.setItem('listUnidadMedidaConTipo_'+tipo, JSON.stringify(p.data));
        callbackfn(listComboItem);
      },
      e => this.errorMessage = e,
      () => this.isLoading = false);
  }
  public listUnidadMedidaMasa(callbackfn: Function){

    this.listUnidadMedidaConTipo(callbackfn,"m");
  }

  public listUnidadMedidaVolumen(callbackfn: Function){

        this.listUnidadMedidaConTipo(callbackfn,"V");
      }
  public listMonedas(callbackfn: Function) {
    let listComboItem: ComboItem[] = [];
    this._dataService
      .listar("1", "10001")
      .subscribe(
      p => {

        for (var xI = 0; xI < p.data.length; xI++) {
          if (p.data[xI].vc_IDREGISTRO == "0000000") {
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
    let listComboItem: ComboItem[] = [];
    this._dataService
      .listar("0", "10002")
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
        for (var xI = 0; xI < p.data.length; xI++) {
          if (p.data[xI].vc_IDREGISTRO == "0000000") {
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
      .listar("0", "10004")
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
        localStorage.setItem('listTipoDoc', JSON.stringify(p.data));
        callbackfn(listComboItem);
      },
      e => this.errorMessage = e,
      () => this.isLoading = false);
  }

public listTipoComprobante(callbackfn: Function) {
    let listComboItem: ComboItem[] = [];
    this._dataService
      .listar("0", "10007")
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
        localStorage.setItem('listTipoComprobante', JSON.stringify(p.data));
        callbackfn(listComboItem);
      },
      e => this.errorMessage = e,
      () => this.isLoading = false);
  }

  public listBanco(callbackfn: Function) {
    let listComboItem: ComboItem[] = [];
    this._dataService
      .listar("0", "10006")
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
        localStorage.setItem('listBanco', JSON.stringify(p.data));
        callbackfn(listComboItem);
      },
      e => this.errorMessage = e,
      () => this.isLoading = false);
  }

  public listTipoComprobantePago(callbackfn: Function) {
    let listComboItem: ComboItem[] = [];
    this._dataService
      .listar("0", "10007")
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
        localStorage.setItem('listTipoComprobantePago', JSON.stringify(p.data));
        callbackfn(listComboItem);
      },
      e => this.errorMessage = e,
      () => this.isLoading = false);
  }


  public listTratamiento(callbackfn: Function) {
    let listComboItem: ComboItem[] = [];
    this._dataService
      .listar("0", "10008")
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
        localStorage.setItem('listTratamiento', JSON.stringify(p.data));
        callbackfn(listComboItem);
      },
      e => this.errorMessage = e,
      () => this.isLoading = false);
  }

  public listTipoOC(callbackfn: Function) {
    let listComboItem: ComboItem[] = [];
    this._dataService
      .listar("0", "10009")
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
        localStorage.setItem('listTipoOC', JSON.stringify(p.data));
        callbackfn(listComboItem);
      },
      e => this.errorMessage = e,
      () => this.isLoading = false);
  }
  public listMotivoGuia(callbackfn: Function) {
    let listComboItem: ComboItem[] = [];
    this._dataService
      .listar("0", "10010")
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
        localStorage.setItem('listMotivoGuia', JSON.stringify(p.data));
        callbackfn(listComboItem);
      },
      e => this.errorMessage = e,
      () => this.isLoading = false);
  }

  public listTransporteGuia(callbackfn: Function) {
    let listComboItem: ComboItem[] = [];
    this._dataService
      .listar("0", "10011")
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
        localStorage.setItem('listTransporteGuia', JSON.stringify(p.data));
        callbackfn(listComboItem);
      },
      e => this.errorMessage = e,
      () => this.isLoading = false);
  }

  public listBienServicio(callbackfn: Function) {
    let listComboItem: ComboItem[] = [];
    this._dataService
      .listar("0", "10012")
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
        localStorage.setItem('listBienServicio', JSON.stringify(p.data));
        callbackfn(listComboItem);
      },
      e => this.errorMessage = e,
      () => this.isLoading = false);
  }

  public listTipoOperacion(callbackfn: Function) {
    let listComboItem: ComboItem[] = [];
    this._dataService
      .listar("0", "10013")
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
          if (p.data[xI].vc_IDREGISTRO == "0000000") {
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
          if (p.data[xI].vc_IDREGISTRO == "0000000") {
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
}
