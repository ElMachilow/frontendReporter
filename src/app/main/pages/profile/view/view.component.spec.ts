import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewComponent } from './view.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { CollaboratorsService } from 'app/services/collaborators.service';
import { of } from 'rxjs';

describe('ViewComponent', () => {
  let component: ViewComponent;
  let fixture: ComponentFixture<ViewComponent>;
  let modalService: NgbModal;
  let activatedRoute: ActivatedRoute;
  let collaboratorsService: CollaboratorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewComponent],
      providers: [
        NgbModal,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } },
            params: of({ id: '1' }), // Puedes ajustar esto según tus necesidades
          },
        },
        CollaboratorsService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(NgbModal);
    activatedRoute = TestBed.inject(ActivatedRoute);
    collaboratorsService = TestBed.inject(CollaboratorsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
 

});
