import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateStoreComponent } from './add-update-store.component';

describe('AddUpdateStoreComponent', () => {
  let component: AddUpdateStoreComponent;
  let fixture: ComponentFixture<AddUpdateStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateStoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
