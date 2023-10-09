import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelInfosComponent } from './level-infos.component';

describe('LevelInfosComponent', () => {
  let component: LevelInfosComponent;
  let fixture: ComponentFixture<LevelInfosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LevelInfosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LevelInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
