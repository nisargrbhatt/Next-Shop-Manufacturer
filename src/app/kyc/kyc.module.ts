import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KycRoutingModule } from './kyc-routing.module';
import { CreateKycApprovalComponent } from './create-kyc-approval/create-kyc-approval.component';
import { KycApprovalsComponent } from './kyc-approvals/kyc-approvals.component';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from '../angular-material.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [CreateKycApprovalComponent, KycApprovalsComponent],
  imports: [
    CommonModule,
    KycRoutingModule,
    AngularMaterialModule,
    SharedModule,
    RouterModule,
  ],
})
export class KycModule {}
