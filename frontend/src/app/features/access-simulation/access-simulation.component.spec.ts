import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessSimulationComponent } from './access-simulation.component';

describe('AccessSimulationComponent', () => {
  let component: AccessSimulationComponent;
  let fixture: ComponentFixture<AccessSimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessSimulationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
