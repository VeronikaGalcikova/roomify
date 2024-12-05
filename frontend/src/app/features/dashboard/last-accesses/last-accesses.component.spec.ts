import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastAccessesComponent } from './last-accesses.component';

describe('LastAccessesComponent', () => {
  let component: LastAccessesComponent;
  let fixture: ComponentFixture<LastAccessesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LastAccessesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LastAccessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
