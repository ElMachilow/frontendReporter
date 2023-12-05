import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { ViewComponent } from './view.component';
import { CollaboratorsService } from 'app/services/collaborators.service';
import { InitialsPipe } from '@core/pipes/initials.pipe';

describe('ViewComponent', () => {
  let component: ViewComponent;
  let fixture: ComponentFixture<ViewComponent>;
  let mockModalService: jasmine.SpyObj<NgbModal>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockCollaboratorsService: jasmine.SpyObj<CollaboratorsService>;

  beforeEach(() => {
    mockModalService = jasmine.createSpyObj('NgbModal', ['open']);
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', [], { data: of({ isProfile: true }) });
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockCollaboratorsService = jasmine.createSpyObj('CollaboratorsService', ['getProfileByXp']);

    TestBed.configureTestingModule({
      declarations: [ViewComponent,InitialsPipe],
      //imports: [InitialsPipe], 
      providers: [
        { provide: NgbModal, useValue: mockModalService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: CollaboratorsService, useValue: mockCollaboratorsService },
      ],
    });

    fixture = TestBed.createComponent(ViewComponent);
    component = fixture.componentInstance;
  });
 
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open modal vertically centered for modalOpenLG', () => {
    const mockModal = {} as any;
    mockModalService.open.and.returnValue(mockModal);
    component.modalOpenLG('modalLG');
    expect(mockModalService.open).toHaveBeenCalledWith('modalLG', { centered: true, size: 'lg' });
  });

  it('should open modal vertically centered for modalOpenVC', () => {
    const mockModal = {} as any;
    mockModalService.open.and.returnValue(mockModal);
    component.modalOpenVC('modalVC');
    expect(mockModalService.open).toHaveBeenCalledWith('modalVC', { centered: true });
  });

  it('should call getProfileByXp on getUsuario', () => {
    // Configura el método getProfileByXp para devolver un observable
    const mockData = {name:'marcelo', edad:22, dni:75128779};
    mockCollaboratorsService.getProfileByXp.and.returnValue(of(mockData));
  
    // Llama a getUsuario
    component.xp = '123';
    component.getUsuario();
  
    // Verifica que se haya llamado a getProfileByXp con el valor correcto
    expect(mockCollaboratorsService.getProfileByXp).toHaveBeenCalledWith('123');
    
    // En este punto, el observable devuelto debería ser el observable simulado
    // y debería haber llamado a subscribe correctamente.
    expect(component.user).toEqual(mockData);
  });

});
