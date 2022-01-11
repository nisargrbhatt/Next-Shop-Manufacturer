import { ErrorResponse } from './shared.interface';
import { environment } from './../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ErrorComponent } from './dialog/error/error.component';
import { ResMesComponent } from './dialog/res-mes/res-mes.component';
import { of, Observable, EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor(private router: Router, private dialogService: MatDialog) {}

  handleError(error: any): Observable<any> {
    let errorResponse: ErrorResponse;
    if (error.error instanceof ErrorEvent) {
      console.log(error);
      return EMPTY;
    } else {
      errorResponse = { ...error.error };
    }

    if ('dialog' in errorResponse) {
      this.dialogService.open(ResMesComponent, {
        data: errorResponse.dialog,
        autoFocus: true,
        hasBackdrop: true,
      });
      // resMesDialogRef.afterClosed().subscribe();
    }

    if ('error' in errorResponse) {
      if (environment.debug) {
        this.dialogService.open(ErrorComponent, {
          data: errorResponse.error,
          autoFocus: true,
          hasBackdrop: true,
        });
        // errorDialogRef.afterClosed().subscribe();
      }
    }
    this.router.navigate(['/']);
    return EMPTY;
  }
}
