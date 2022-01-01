import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KycApprovalsComponent } from './kyc-approvals.component';

describe('KycApprovalsComponent', () => {
  let component: KycApprovalsComponent;
  let fixture: ComponentFixture<KycApprovalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KycApprovalsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
