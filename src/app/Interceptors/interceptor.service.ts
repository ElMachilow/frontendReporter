import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SecurityService } from "app/services/security.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { Observable, throwError } from "rxjs";
import { catchError, finalize } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  private countRequest = 0;
  constructor(private _securityService: SecurityService,
    private toastr: ToastrService,private _router:Router,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    const token: string = this._securityService.getToken();

    let authReq = req;
    if (!this.countRequest) {
      this.spinner.show();
    }
    if (token) {
      authReq = authReq.clone({
        setHeaders : {authorization: `Bearer ${token}` }
      })
    }
    this.countRequest++;
    return next.handle(authReq).pipe(
      finalize(() => {
        this.countRequest--;
        if (!this.countRequest) {
          this.spinner.hide();
        }
      }),
      catchError((err: HttpErrorResponse) => {
        this.spinner.hide();
        if (err.status === 403) {
          this.modalService.dismissAll();
            var url = window.location.href;     
            this.toastr.error('Su tiempo de sesión ha concluido, ha sido redirgido al login.' 
            , '', {
            toastClass: 'toast ngx-toastr',
            positionClass: 'toast-bottom-left',
            closeButton: true,
            progressBar: true,
          });
         this._router.navigate(['/main/authentication/login']);    
        }

        return throwError( err );

      })
    );
  }

}