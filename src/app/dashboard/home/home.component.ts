import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { SubSink } from 'subsink';
import { GetAcceptedOrderOfMerchantByMonthResponseData } from '../dashboard.interface';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  pendingChartData: GetAcceptedOrderOfMerchantByMonthResponseData;
  acceptedChartData: GetAcceptedOrderOfMerchantByMonthResponseData;
  canceledChartData: GetAcceptedOrderOfMerchantByMonthResponseData;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.subs.sink = forkJoin([
      this.dashboardService.getPendingOrdersOfManufacturerByMonth(),
      this.dashboardService.getAcceptedOrdersOfManufacturerByMonth(),
      this.dashboardService.getCanceledOrdersOfManufacturerByMonth(),
    ]).subscribe((results) => {
      this.pendingChartData = results[0];
      this.acceptedChartData = results[1];
      this.canceledChartData = results[2];
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
