import { TestBed, inject,ComponentFixture } from '@angular/core/testing';
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

 /* it('should list users',() =>{
    const mockUsers = [
      { id: 1, name: 'User1' },
      { id: 2, name: 'User2' },
    ];

    service.listUsers().subscribe((users) =>{
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(`demo/colaborador`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
*/
  describe('test for getValue', () =>{
    //AAA
    it('should return "my value"', () =>{
      expect(service.getValue()).toBe( 'my value');
    })
  })
  
  describe('test for setValue', () =>{
    //AAA
    it('should change the value', () =>{
      expect(service.getValue()).toBe( 'my value');
      service.setValue('change');
      expect(service.getValue()).toBe( 'change');

    })
  })
  
  describe('test for getPromiseValue', () =>{
    //AAA
    it('should return promise value from promise', (doneFn) =>{
      service.getPromiseValue()
      .then((value) =>{
        // ejecutamos el assert
        expect(value).toBe('promise value');
        doneFn();
      });
    });

    it('should return promise value from promise using async',async () =>{
      const rta = await service.getPromiseValue();
      expect(rta).toBe('promise value');
    })

  })
  // Agrega más pruebas según sea necesario.
});