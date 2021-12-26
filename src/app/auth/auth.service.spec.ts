import { TestBed } from '@angular/core/testing';

import { Auth0Service } from './auth0.service';

describe('AuthService', () => {
  let service: Auth0Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Auth0Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
