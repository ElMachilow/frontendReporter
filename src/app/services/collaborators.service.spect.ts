import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CollaboratorsService } from './collaborators.service'; 

describe('CollaboratorsService', () => {
  let service: CollaboratorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CollaboratorsService],
    });

    service = TestBed.inject(CollaboratorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Agrega más pruebas según sea necesario.
});