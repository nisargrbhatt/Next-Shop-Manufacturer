import { SharedModule } from './../shared/shared.module';
import { AngularMaterialModule } from './../angular-material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { AddressesComponent } from './subs/addresses/addresses.component';
import { UserDetailsComponent } from './subs/user-details/user-details.component';
import { AddAddressComponent } from './add-address/add-address.component';

@NgModule({
  declarations: [
    ProfileViewComponent,
    AddressesComponent,
    UserDetailsComponent,
    AddAddressComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    AngularMaterialModule,
    SharedModule,
  ],
})
export class ProfileModule {}
