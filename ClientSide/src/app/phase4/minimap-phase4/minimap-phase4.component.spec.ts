import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinimapPhase4Component } from './minimap-phase4.component';

describe('MinimapPhase4Component', () => {
  let component: MinimapPhase4Component;
  let fixture: ComponentFixture<MinimapPhase4Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MinimapPhase4Component]
    });
    fixture = TestBed.createComponent(MinimapPhase4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
