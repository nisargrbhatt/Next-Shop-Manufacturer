import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateKycApprovalComponent } from './create-kyc-approval.component';

describe('CreateKycApprovalComponent', () => {
  let component: CreateKycApprovalComponent;
  let fixture: ComponentFixture<CreateKycApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateKycApprovalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateKycApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
