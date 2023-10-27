import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupPincodeComponent } from './popup-pincode.component';

describe('PopupPincodeComponent', () => {
  let component: PopupPincodeComponent;
  let fixture: ComponentFixture<PopupPincodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupPincodeComponent]
    });
    fixture = TestBed.createComponent(PopupPincodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
