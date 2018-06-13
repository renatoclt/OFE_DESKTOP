import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-mi-cuenta',
  templateUrl: './mi-cuenta.component.html',
  styleUrls: ['./mi-cuenta.component.css']
})
export class MiCuentaComponent implements OnInit {
  public micuentaFormGroup: FormGroup;
  public estadoIsc = true;
  public estadopass = true;
  public estadotel = true;
  public estadopersona = true;

  titulo= '';
  constructor( private router: Router,
               private route: ActivatedRoute
  ) {
    this.titulo = 'Mi Cuenta';
  }

  ngOnInit() {
    this.initform();
  }

  private initform() {
    this.micuentaFormGroup = new FormGroup({
      'txtemail': new FormControl({value: '', disabled: false}, [Validators.required]),
      'txtpass': new FormControl({value: '', disabled: true} , [Validators.required]),
      'txtpersonacontacto': new FormControl({value: '', disabled: true} , [Validators.required]),
      'txttelefono': new FormControl({value: '', disabled: true} , [Validators.required]),
      'txtruc': new FormControl({value: '', disabled: false}, [Validators.required])
    });
  }

  public bloquearpass() {
    if (this.estadopass) {
      this.estadopass = false;
      this.micuentaFormGroup.controls['txtpass'].enable();
    } else {
      this.estadopass = true;
      this.micuentaFormGroup.controls['txtpass'].disable();
    }
  }

  public bloqueartelefono() {
    if (this.estadotel) {
      this.estadotel = false;
      this.micuentaFormGroup.controls['txttelefono'].enable();
    } else {
      this.estadotel = true;
      this.micuentaFormGroup.controls['txttelefono'].disable();
    }
  }

  public bloquearpersonacontacto() {
    if (this.estadopersona) {
      this.estadopersona = false;
      this.micuentaFormGroup.controls['txtpersonacontacto'].enable();
    } else {
      this.estadopersona = true;
      this.micuentaFormGroup.controls['txtpersonacontacto'].disable();
    }
  }
}
