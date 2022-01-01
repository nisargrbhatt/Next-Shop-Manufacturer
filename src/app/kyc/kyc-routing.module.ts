import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { CreateKycApprovalComponent } from './create-kyc-approval/create-kyc-approval.component';
import { KycApprovalsComponent } from './kyc-approvals/kyc-approvals.component';

const routes: Routes = [
  {
    path: '',
    component: KycApprovalsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create-approval',
    component: CreateKycApprovalComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class KycRoutingModule {}
