import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderConfirmModalComponent } from './order-confirm-modal.component';

describe('OrderConfirmModalComponent', () => {
  let component: OrderConfirmModalComponent;
  let fixture: ComponentFixture<OrderConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderConfirmModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
