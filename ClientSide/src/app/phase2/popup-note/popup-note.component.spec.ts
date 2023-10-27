import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupNoteComponent } from './popup-note.component';

describe('PopupNoteComponent', () => {
  let component: PopupNoteComponent;
  let fixture: ComponentFixture<PopupNoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupNoteComponent]
    });
    fixture = TestBed.createComponent(PopupNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
