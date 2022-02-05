import { Injectable } from '@angular/core';

import {
  GetAcceptedOrderOfMerchantByMonthResponseData,
  GetAcceptedOrderOfMerchantByMonthResponse,
} from './dashboard.interface';

import {
  environment,
  secureAPIURIs,
  basicAPIURIs,
} from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const BACKEND_URL = environment.production
  ? environment.backend_url_secure
  : environment.backend_url;

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private httpService: HttpClient) {}

  getPendingOrdersOfManufacturerByMonth(): Observable<GetAcceptedOrderOfMerchantByMonthResponseData> {
    return this.httpService
      .get<GetAcceptedOrderOfMerchantByMonthResponse>(
        BACKEND_URL + secureAPIURIs.getPendingOrdersOfManufacturerByMonth.url,
      )
      .pipe(map((response) => response.data));
  }

  getAcceptedOrdersOfManufacturerByMonth(): Observable<GetAcceptedOrderOfMerchantByMonthResponseData> {
    return this.httpService
      .get<GetAcceptedOrderOfMerchantByMonthResponse>(
        BACKEND_URL + secureAPIURIs.getAcceptedOrdersOfManufacturerByMonth.url,
      )
      .pipe(map((response) => response.data));
  }

  getCanceledOrdersOfManufacturerByMonth(): Observable<GetAcceptedOrderOfMerchantByMonthResponseData> {
    return this.httpService
      .get<GetAcceptedOrderOfMerchantByMonthResponse>(
        BACKEND_URL + secureAPIURIs.getCanceledOrdersOfManufacturerByMonth.url,
      )
      .pipe(map((response) => response.data));
  }
}
