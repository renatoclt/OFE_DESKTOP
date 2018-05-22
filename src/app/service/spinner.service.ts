import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class SpinnerService  {

  //public loading = false;
  public loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  set(value:boolean):BehaviorSubject<boolean>{
    this.loading.next(value);
    return this.loading;
  }
  /*
  get(){
    this.loading;
  }
*/
}
