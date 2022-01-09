import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductImageUpdateComponent } from './product-image-update.component';

describe('ProductImageUpdateComponent', () => {
  let component: ProductImageUpdateComponent;
  let fixture: ComponentFixture<ProductImageUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductImageUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductImageUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
