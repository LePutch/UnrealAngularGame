import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavypopupComponent } from './navypopup.component';

describe('NavypopupComponent', () => {
  let component: NavypopupComponent;
  let fixture: ComponentFixture<NavypopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavypopupComponent]
    });
    fixture = TestBed.createComponent(NavypopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
