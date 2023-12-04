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

});
