import { TestBed, inject,ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CollaboratorsService } from './collaborators.service';
import { environment } from 'environments/environment';
import { Collaborator } from 'app/Models/collaborator.model';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { of } from 'rxjs';
import { TrackPosition } from 'app/Models/trackPosition.model';
import { ManagementArea } from 'app/Models/managementArea.model';
import { NivelNeoris } from 'app/Models/nivelNeoris.model';
import { PlataformaBBVA } from 'app/Models/plataformaBBVA.model';
import { EstadoRecruiting } from 'app/Models/estadoRecruiting.model';


 describe('CollaboratorsService', () => {
  let service: CollaboratorsService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

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

 it('should list users',() =>{
  //const apiUrl = environment.apiUrl;
  // Definimos un array de usuarios simulados que esperamos recibir del servicio
    const mockUsers = [
      { id: 1, name: 'User1' },
      { id: 2, name: 'User2' },
    ];
  // Llamamos al método listUsers del servicio. Al ser una operación 
  //asíncrona, usamos subscribe para esperar la respuesta del observable.
    service.listUsers().subscribe((users) =>{
      expect(users).toEqual(mockUsers);
    });
  // Utilizamos httpMock.expectOne para interceptar la solicitud HTTP
  // realizada por el servicio y proporcionar una respuesta simulada.
    const req = httpMock.expectOne(`${apiUrl}/colaborador`);

  // Verificamos que la solicitud sea de tipo GET 
    expect(req.request.method).toBe('GET');
  // Usamos req.flush para simular la respuesta del servidor con nuestros usuarios simulados
    req.flush(mockUsers);
  });

  it('should get profile by XP',() =>{
    const mockUsers = { id: 1, name: 'User1' }   
    const xpColaborador = 'XP000001'
    service.getProfileByXp(xpColaborador).subscribe((profile) =>{
      expect(profile).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(`${apiUrl}/colaborador/profile/`+xpColaborador);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers); 
  });

  it('should create a collaborator',() =>{
    const mockCollaborator: Collaborator = 
    {
      id: 1,
      nombres: 'John Doe',
      apellidos: 'nieva',
      codigoEmpleado: 'asasd',
      codigoXp: 'asd',
      pais: 'as',
      dni: 'asd',
      estadoNeoris: 'asd',
      fechaNacimiento: 'asd',
      celular: 'asd',
      fechaIngresoNeoris: 'asd',
      fechaSalidaNeoris: 'asd',
      correoNeoris: 'asd',
      estadoPmoBbva: 'asd',
      correoContractor: 'asd',
      fechaAltaContractor: 'asd',
      vdiPmo: 'asd',
      fechaAltaVDI: 'asd',
      accesoServiceNow: 'asd',
      fechaAltaAccesoServiceNow: 'asd',
      timeReport: 'asd',
      accesoRacf: 'asd',
      fechaAccesoRacf: 'asd',
      ipVdiPmo: 'asd',
      trackPosition: new TrackPosition,
      managementArea: new ManagementArea,
      nivelNeoris: new NivelNeoris,
      plataformaBBVA: new PlataformaBBVA,
      estadoRecruiting: new EstadoRecruiting
    };

    service.createCollaboratos(mockCollaborator).subscribe((collaborator) => {
      expect(collaborator).toEqual(mockCollaborator);
    });

    const req = httpMock.expectOne(`${apiUrl}/colaborador`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCollaborator);
    req.flush(mockCollaborator);
    
  });

  
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