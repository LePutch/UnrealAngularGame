import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Phase1Component } from './phase1.component';

describe('Phase1Component', () => {
  let component: Phase1Component;
  let fixture: ComponentFixture<Phase1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Phase1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Phase1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
