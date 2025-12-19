import { TestBed } from '@angular/core/testing';

import { StripeNativeService } from './stripe-native.service';

describe('StripeNativeService', () => {
  let service: StripeNativeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StripeNativeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
