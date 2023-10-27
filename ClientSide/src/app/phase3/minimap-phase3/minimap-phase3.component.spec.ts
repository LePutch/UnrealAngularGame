import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinimapPhase3Component } from './minimap-phase3.component';

describe('MinimapPhase3Component', () => {
  let component: MinimapPhase3Component;
  let fixture: ComponentFixture<MinimapPhase3Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MinimapPhase3Component]
    });
    fixture = TestBed.createComponent(MinimapPhase3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
