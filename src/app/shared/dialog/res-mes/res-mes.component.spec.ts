import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResMesComponent } from './res-mes.component';

describe('ResMesComponent', () => {
  let component: ResMesComponent;
  let fixture: ComponentFixture<ResMesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResMesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResMesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
