import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoOrderConfirmationComponent } from './promo-order-confirmation.component';

describe('PromoOrderConfirmationComponent', () => {
  let component: PromoOrderConfirmationComponent;
  let fixture: ComponentFixture<PromoOrderConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoOrderConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromoOrderConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
