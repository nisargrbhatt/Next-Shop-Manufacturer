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

const BACKEND_URL = environment.production
  ? environment.backend_url_secure
  : environment.backend_url;

@Injectable({
  providedIn: 'root',
})
export class KycService {
  constructor(private httpService: HttpClient) {}

  async createKycApproval(
    createKycApprovalData: CreateKycApprovalData | any,
  ): Promise<CreateKycApprovalResponse> {
    return await this.httpService
      .post<CreateKycApprovalResponse>(
        BACKEND_URL + secureAPIURIs.createKycApproval,
        createKycApprovalData,
      )
      .toPromise();
  }

  async findAllKYCApprovals(): Promise<FindAllKYCApprovalsResponse> {
    return await this.httpService
      .get<FindAllKYCApprovalsResponse>(
        BACKEND_URL + secureAPIURIs.getKYCApprovalByMerchantManufacturerId,
      )
      .toPromise();
  }

  async findKYCApproval(id: string): Promise<FindKYCApprovalResponse> {
    const httpParams = new HttpParams();
    httpParams.append('kycId', id);
    return await this.httpService
      .get<FindKYCApprovalResponse>(
        BACKEND_URL + secureAPIURIs.getKycApproval,
        {
          params: httpParams,
        },
      )
      .toPromise();
  }
}
