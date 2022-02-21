import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { AngularMaterialModule } from '../angular-material.module';
import { HomeBannerComponent } from './home-banner/home-banner.component';

@NgModule({
  declarations: [HomeComponent, HomeBannerComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    AngularMaterialModule,
    SharedModule,
    RouterModule,
  ],
})
export class DashboardModule {}
