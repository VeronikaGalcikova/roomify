import { TestBed } from '@angular/core/testing';

import { RoomReaderService } from './room-reader.service';

describe('RoomReaderService', () => {
  let service: RoomReaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomReaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
