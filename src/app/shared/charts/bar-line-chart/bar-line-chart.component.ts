import { Component, Input, OnInit } from '@angular/core';

import { Chart, registerables } from 'chart.js';
import { GetAcceptedOrderOfMerchantByMonthResponseData } from 'src/app/dashboard/dashboard.interface';
Chart.register(...registerables);

@Component({
  selector: 'app-bar-line-chart',
  templateUrl: './bar-line-chart.component.html',
  styleUrls: ['./bar-line-chart.component.scss'],
})
export class BarLineChartComponent implements OnInit {
  @Input() pendingChartData: GetAcceptedOrderOfMerchantByMonthResponseData;
  @Input() acceptedChartData: GetAcceptedOrderOfMerchantByMonthResponseData;
  @Input() canceledChartData: GetAcceptedOrderOfMerchantByMonthResponseData;

  private pendingChartObj: Chart;
  private acceptedChartObj: Chart;
  private canceledChartObj: Chart;

  private pendingChartEle: any;
  private acceptedChartEle: any;
  private canceledChartEle: any;

  constructor() {}

  ngOnInit(): void {
    this.pendingChartEle = document.getElementById('pending-chart');
    this.acceptedChartEle = document.getElementById('accepted-chart');
    this.canceledChartEle = document.getElementById('canceled-chart');

    this.pendingChartObj = new Chart(this.pendingChartEle, {
      type: 'line',
      data: {
        labels: this.pendingChartData.barLabels,
        datasets: [
          {
            label: this.pendingChartData.label,
            data: this.pendingChartData.data,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            // borderWidth: 1,
            tension: 0.1,
          },
        ],
      },
      // options: {
      //   scales: {
      //     y: {
      //       beginAtZero: true,
      //     },
      //   },
      // },
    });
    this.acceptedChartObj = new Chart(this.acceptedChartEle, {
      type: 'line',
      data: {
        labels: this.acceptedChartData.barLabels,
        datasets: [
          {
            label: this.acceptedChartData.label,
            data: this.acceptedChartData.data,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            // borderWidth: 1,
            tension: 0.1,
          },
        ],
      },
      // options: {
      //   scales: {
      //     y: {
      //       beginAtZero: true,
      //     },
      //   },
      // },
    });
    this.canceledChartObj = new Chart(this.canceledChartEle, {
      type: 'line',
      data: {
        labels: this.canceledChartData.barLabels,
        datasets: [
          {
            label: this.canceledChartData.label,
            data: this.canceledChartData.data,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            // borderWidth: 1,
            tension: 0.1,
          },
        ],
      },
      // options: {
      //   scales: {
      //     y: {
      //       beginAtZero: true,
      //     },
      //   },
      // },
    });
  }
}
