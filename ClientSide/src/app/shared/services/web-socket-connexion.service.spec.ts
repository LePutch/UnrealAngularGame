import { TestBed } from '@angular/core/testing';

import { WebSocketConnexionService } from './web-socket-connexion.service';

describe('WebSocketConnexionService', () => {
  let service: WebSocketConnexionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketConnexionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
