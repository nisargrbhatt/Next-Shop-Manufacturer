import { FindAllKYCApprovalsResponseData } from './../kyc.interface';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Auth0Service } from 'src/app/auth/auth0.service';
import { KycService } from '../kyc.service';

import { Auth0ProfileData } from 'src/app/auth/auth.interface';
import { SubSink } from 'subsink';
import { Subject, BehaviorSubject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-kyc-approvals',
  templateUrl: './kyc-approvals.component.html',
  styleUrls: ['./kyc-approvals.component.scss'],
})
export class KycApprovalsComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  refresh = new Subject<any>();

  totalApprovals = 0;
  approvalsPerPage = 10;
  currentPage = new BehaviorSubject<number>(1);

  kycApprovals: FindAllKYCApprovalsResponseData;
  profileClaims: Auth0ProfileData;
  merchantVerified: boolean;

  constructor(
    private kycService: KycService,
    private authService: Auth0Service,
  ) {}

  ngOnInit(): void {
    this.profileClaims = this.authService.ProfileClaims;
    this.merchantVerified = this.profileClaims.merchantVerified;

    this.subs.sink = this.kycService
      .findAllKYCApprovals(this.currentPage.getValue(), this.approvalsPerPage)
      .subscribe((data) => {
        this.kycApprovals = data;
        this.totalApprovals = data.count;
      });

    this.subs.sink = this.currentPage
      .asObservable()
      .pipe(
        distinctUntilChanged(),
        switchMap((search) =>
          this.kycService.findAllKYCApprovals(
            this.currentPage.getValue(),
            this.approvalsPerPage,
          ),
        ),
      )
      .subscribe((data) => {
        this.kycApprovals = data;
        this.totalApprovals = data.count;
      });

    this.subs.sink = this.refresh
      .asObservable()
      .pipe(
        switchMap(() =>
          this.kycService.findAllKYCApprovals(
            this.currentPage.getValue(),
            this.approvalsPerPage,
          ),
        ),
      )
      .subscribe((data) => {
        this.kycApprovals = data;
        this.totalApprovals = data.count;
      });
  }

  onPageChange(pageData: PageEvent): void {
    this.currentPage.next(pageData.pageIndex + 1);
  }

  onRefresh(): void {
    this.refresh.next(2);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
