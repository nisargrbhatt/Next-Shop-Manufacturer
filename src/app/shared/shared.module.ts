import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from './../angular-material.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { ErrorComponent } from './dialog/error/error.component';
import { ResMesComponent } from './dialog/res-mes/res-mes.component';
import { LoaderComponent } from './loader/loader.component';
// import { ProductCardSmallComponent } from './product/product-card-small/product-card-small.component';
// import { ProductImageUpdateComponent } from './product/product-image-update/product-image-update.component';
// import { BarLineChartComponent } from './charts/bar-line-chart/bar-line-chart.component';

@NgModule({
  imports: [CommonModule, AngularMaterialModule, RouterModule],
  declarations: [
    HeaderComponent,
    ErrorComponent,
    ResMesComponent,
    LoaderComponent,
    // ProductCardSmallComponent,
    // ProductImageUpdateComponent,
    // BarLineChartComponent,
  ],
  providers: [],
  exports: [
    HeaderComponent,
    ErrorComponent,
    ResMesComponent,
    LoaderComponent,
    // ProductCardSmallComponent,
    // ProductImageUpdateComponent,
    // BarLineChartComponent,
  ],
})
export class SharedModule {}
