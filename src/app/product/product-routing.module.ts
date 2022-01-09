import { ProductOpenComponent } from './product-open/product-open.component';
import { ProductUpdateComponent } from './product-update/product-update.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductListComponent } from './product-list/product-list.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ProductListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create',
    component: ProductCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'update/:id',
    component: ProductUpdateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ':id',
    component: ProductOpenComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class ProductRoutingModule {}
