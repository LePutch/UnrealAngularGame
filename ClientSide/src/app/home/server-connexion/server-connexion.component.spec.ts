import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerConnexionComponent } from './server-connexion.component';

describe('ServerConnexionComponent', () => {
  let component: ServerConnexionComponent;
  let fixture: ComponentFixture<ServerConnexionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServerConnexionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerConnexionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
