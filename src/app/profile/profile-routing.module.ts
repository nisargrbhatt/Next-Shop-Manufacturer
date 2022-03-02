import { AddAddressComponent } from './add-address/add-address.component';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';

const routes: Routes = [
  {
    path: 'profile-view',
    component: ProfileViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-address',
    component: AddAddressComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class ProfileRoutingModule {}
