import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { forkJoin, from, Observable, throwError } from "rxjs";
import { catchError, mergeMap, switchMap } from "rxjs/operators";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private translate: TranslateService,
    private toastController: ToastController,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('error with some backend request', error, req);
        return from(this.handleError(req, next, error));
      })
    )
  }

  async handleError(req: HttpRequest<any>, next: HttpHandler, error: HttpErrorResponse) {
    let message = await this.translate.get('Error.Generic').toPromise();

    if (error.error?.code) {
      message = await this.translate.get(`Error.${error.error.code}`).toPromise();
    }

    const toast = await this.toastController.create({
      header: 'Internet Error',
      message,
      icon: 'bug-outline',
      color: 'danger',
      duration: 4000,
    });
    toast.present();

    return next.handle(req).toPromise();
  }
}