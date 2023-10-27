import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GhostpowerComponent } from './ghostpower.component';

describe('GhostpowerComponent', () => {
  let component: GhostpowerComponent;
  let fixture: ComponentFixture<GhostpowerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GhostpowerComponent]
    });
    fixture = TestBed.createComponent(GhostpowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
