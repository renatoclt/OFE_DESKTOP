import {BehaviorSubject} from 'rxjs/BehaviorSubject';

export class BasePaginacion {
  public pagina: BehaviorSubject<number>;
  public totalItems: BehaviorSubject<number>;
  public totalPaginas: BehaviorSubject<number>;

  public next: BehaviorSubject<string>;
  public previous: BehaviorSubject<string>;
  public first: BehaviorSubject<string>;
  public last: BehaviorSubject<string>;

  public tamanio: BehaviorSubject<number>;
  public orden: BehaviorSubject<string>;

  constructor() {
    this.pagina = new BehaviorSubject<number>(0);
    this.totalItems = new BehaviorSubject<number>(0);
    this.totalPaginas = new BehaviorSubject<number>(0);

    this.next = new BehaviorSubject<string>('');
    this.previous = new BehaviorSubject<string>('');
    this.first = new BehaviorSubject<string>('');
    this.last = new BehaviorSubject<string>('');

    this.tamanio = new BehaviorSubject<number>(10);
    this.orden = new BehaviorSubject<string>('');
  }
}
