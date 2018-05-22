import { Injectable } from '@angular/core';


@Injectable()
export class RefreshService {
  public CargarPersistencia: boolean;

  constructor() {
    this.CargarPersistencia = false;
  }

}
