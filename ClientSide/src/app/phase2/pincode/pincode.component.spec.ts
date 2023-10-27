import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PincodeComponent } from './pincode.component';

describe('PincodeComponent', () => {
  let component: PincodeComponent;
  let fixture: ComponentFixture<PincodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PincodeComponent]
    });
    fixture = TestBed.createComponent(PincodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
