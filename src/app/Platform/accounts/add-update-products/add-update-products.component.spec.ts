import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateProductsComponent } from './add-update-products.component';

describe('AddUpdateProductsComponent', () => {
  let component: AddUpdateProductsComponent;
  let fixture: ComponentFixture<AddUpdateProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
