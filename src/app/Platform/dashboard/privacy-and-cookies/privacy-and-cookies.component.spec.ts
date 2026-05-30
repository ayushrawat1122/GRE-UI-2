import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyAndCookiesComponent } from './privacy-and-cookies.component';

describe('PrivacyAndCookiesComponent', () => {
  let component: PrivacyAndCookiesComponent;
  let fixture: ComponentFixture<PrivacyAndCookiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyAndCookiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivacyAndCookiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
