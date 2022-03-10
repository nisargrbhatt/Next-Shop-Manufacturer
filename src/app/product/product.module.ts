// import { SharedModule } from './../shared/shared.module';
import { AngularMaterialModule } from './../angular-material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule } from './product-routing.module';
import { RouterModule } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductUpdateComponent } from './product-update/product-update.component';
import { ProductOpenComponent } from './product-open/product-open.component';
import { ProductCardSmallComponent } from '../shared/product/product-card-small/product-card-small.component';
import { ProductImageUpdateComponent } from '../shared/product/product-image-update/product-image-update.component';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductCreateComponent,
    ProductUpdateComponent,
    ProductOpenComponent,
    ProductCardSmallComponent,
    ProductImageUpdateComponent,
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    AngularMaterialModule,
    // SharedModule,
    RouterModule,
  ],
})
export class ProductModule {}
