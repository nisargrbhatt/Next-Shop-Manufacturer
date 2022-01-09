import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductOpenComponent } from './product-open.component';

describe('ProductOpenComponent', () => {
  let component: ProductOpenComponent;
  let fixture: ComponentFixture<ProductOpenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductOpenComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductOpenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
