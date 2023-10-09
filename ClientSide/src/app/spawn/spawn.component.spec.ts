import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpawnComponent } from './spawn.component';

describe('SpawnComponent', () => {
  let component: SpawnComponent;
  let fixture: ComponentFixture<SpawnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpawnComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SpawnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
