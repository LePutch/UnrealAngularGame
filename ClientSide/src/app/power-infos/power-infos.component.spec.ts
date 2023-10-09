import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerInfosComponent } from './power-infos.component';

describe('PowerInfosComponent', () => {
  let component: PowerInfosComponent;
  let fixture: ComponentFixture<PowerInfosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PowerInfosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PowerInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
