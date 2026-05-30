import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoOrderHistoryComponent } from './promo-order-history.component';

describe('PromoOrderHistoryComponent', () => {
  let component: PromoOrderHistoryComponent;
  let fixture: ComponentFixture<PromoOrderHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoOrderHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromoOrderHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
