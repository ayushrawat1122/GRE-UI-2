import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoProductsComponent } from './promo-products.component';

describe('PromoProductsComponent', () => {
  let component: PromoProductsComponent;
  let fixture: ComponentFixture<PromoProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromoProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
