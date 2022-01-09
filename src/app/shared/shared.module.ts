import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from './../angular-material.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SidenavComponent } from './sidenav/sidenav.component';
import { HeaderComponent } from './header/header.component';
import { ErrorComponent } from './dialog/error/error.component';
import { ResMesComponent } from './dialog/res-mes/res-mes.component';
import { EmailVerificationComponent } from './dialog/email-verification/email-verification.component';
import { LoaderComponent } from './loader/loader.component';
import { ProductCardSmallComponent } from './product/product-card-small/product-card-small.component';
import { ProductCardLongComponent } from './product/product-card-long/product-card-long.component';
import { ProductImageUpdateComponent } from './product/product-image-update/product-image-update.component';

@NgModule({
  imports: [CommonModule, AngularMaterialModule, RouterModule],
  declarations: [
    SidenavComponent,
    HeaderComponent,
    ErrorComponent,
    ResMesComponent,
    EmailVerificationComponent,
    LoaderComponent,
    ProductCardSmallComponent,
    ProductCardLongComponent,
    ProductImageUpdateComponent,
  ],
  providers: [],
  exports: [
    SidenavComponent,
    HeaderComponent,
    ErrorComponent,
    ResMesComponent,
    EmailVerificationComponent,
    LoaderComponent,
    ProductCardSmallComponent,
    ProductCardLongComponent,
    ProductImageUpdateComponent,
  ],
})
export class SharedModule {}
