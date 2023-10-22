import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinimapPhase2Component } from './minimap-phase2.component';

describe('MinimapPhase2Component', () => {
  let component: MinimapPhase2Component;
  let fixture: ComponentFixture<MinimapPhase2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MinimapPhase2Component]
    });
    fixture = TestBed.createComponent(MinimapPhase2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
