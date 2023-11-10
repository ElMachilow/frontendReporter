import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CoreConfigService } from '@core/services/config.service';

import { AuthService } from 'app/services/auth.service';
import { UserService } from 'app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-auth-forgot-password',
  templateUrl: './auth-forgot-password.component.html',
  styleUrls: ['./auth-forgot-password.component.scss']
})
export class AuthForgotPasswordComponent implements OnInit {
  // Public
  public emailVar;
  public coreConfig: any;
  public forgotPasswordForm: UntypedFormGroup;
  public submitted = false;
  public error = '';
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   *
   */
  constructor(private _coreConfigService: CoreConfigService, private _formBuilder: UntypedFormBuilder,
    private _auth: AuthService, private _user: UserService, private toastr: ToastrService, private _router: Router) {
    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  /**
   * On Submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.forgotPasswordForm.invalid) {
      return;
    }
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.forgotPasswordForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      passwordNew: ['', [Validators.required, Validators.minLength(6)]],
    });

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }

  procesar() {
    if (this.forgotPasswordForm.invalid) {
      return this.forgotPasswordForm.markAllAsTouched();
    }
    this.error = '';
    this._auth.iniciarSesion(this.forgotPasswordForm.value).subscribe((data: any) => {
      this.updatePassword(data?.usuario.idUsuario, this.forgotPasswordForm.controls['passwordNew'].value)
    }, (err) => {
      console.log(err);
      if (err?.status === 401) {
        this.error = "El correo y su contraseña actual no son válidas.";
      }

      this.submitted = false;
    })
  }

  updatePassword(idUsuario, password) {
    this._user.updatePassword(idUsuario, password).subscribe((data: any) => {
      this.toastr.success('Ya puede iniciar sesión con tu nueva contraseña.'
        , 'En hora buena!', {
        toastClass: 'toast ngx-toastr',
        positionClass: 'toast-bottom-left',
        closeButton: true,
        progressBar: true,
      });
      this._router.navigate(['/main/authentication/login']);
    }, (err) => {
      console.log(err);
    })
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
