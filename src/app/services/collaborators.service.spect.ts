import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CollaboratorsService } from './collaborators.service';
import { environment } from 'environments/environment';
import { Collaborator } from 'app/Models/collaborator.model';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { of } from 'rxjs';


describe('CollaboratorsService', () => {
  let service: CollaboratorsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CollaboratorsService]
    });
    service = TestBed.inject(CollaboratorsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });
  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Agrega más pruebas según sea necesario.
});