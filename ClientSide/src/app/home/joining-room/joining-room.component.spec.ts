import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoiningRoomComponent } from './joining-room.component';

describe('JoiningRoomComponent', () => {
  let component: JoiningRoomComponent;
  let fixture: ComponentFixture<JoiningRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JoiningRoomComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(JoiningRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
