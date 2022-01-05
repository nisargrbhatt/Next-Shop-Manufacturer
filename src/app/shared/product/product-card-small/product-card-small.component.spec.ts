import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardSmallComponent } from './product-card-small.component';

describe('ProductCardSmallComponent', () => {
  let component: ProductCardSmallComponent;
  let fixture: ComponentFixture<ProductCardSmallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductCardSmallComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCardSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
