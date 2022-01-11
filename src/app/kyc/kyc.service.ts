import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  CreateKycApprovalResponse,
  CreateKycApprovalData,
  FindAllKYCApprovalsResponse,
  FindKYCApprovalResponse,
} from './kyc.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  environment,
  secureAPIURIs,
  basicAPIURIs,
} from 'src/environments/environment';
import { map } from 'rxjs/operators';

const BACKEND_URL = environment.production
  ? environment.backend_url_secure
  : environment.backend_url;

@Injectable({
  providedIn: 'root',
})
export class KycService {
  constructor(
    private httpService: HttpClient,
    private snackbarService: MatSnackBar,
    private router: Router,
  ) {}

  createKycApproval(createKycApprovalData: CreateKycApprovalData | any): void {
    this.httpService
      .post<CreateKycApprovalResponse>(
        BACKEND_URL + secureAPIURIs.createKycApproval.url,
        createKycApprovalData,
      )
      .subscribe((response) => {
        this.snackbarService.open(response.message, 'Ok', {
          duration: 2 * 1000,
        });
        this.router.navigate(['/kyc']);
      });
  }

  findAllKYCApprovals(currentPage: number, pageSize: number): Observable<any> {
    return this.httpService
      .get<FindAllKYCApprovalsResponse>(
        BACKEND_URL +
          secureAPIURIs.getKYCApprovalByMerchantManufacturerId.url +
          `/?currentPage=${currentPage}&pageSize=${pageSize}`,
      )
      .pipe(map((response) => response.data));
  }

  findKYCApproval(id: string): Observable<any> {
    return this.httpService
      .get<FindKYCApprovalResponse>(
        BACKEND_URL + secureAPIURIs.getKycApproval.url + `/?kycId=${id}`,
      )
      .pipe(map((response) => response.data));
  }
}
