import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Phase4Component } from './phase4.component';

describe('Phase4Component', () => {
  let component: Phase4Component;
  let fixture: ComponentFixture<Phase4Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Phase4Component]
    });
    fixture = TestBed.createComponent(Phase4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
