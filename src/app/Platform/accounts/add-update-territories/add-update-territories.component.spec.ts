import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateTerritoriesComponent } from './add-update-territories.component';

describe('AddUpdateTerritoriesComponent', () => {
  let component: AddUpdateTerritoriesComponent;
  let fixture: ComponentFixture<AddUpdateTerritoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateTerritoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateTerritoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
