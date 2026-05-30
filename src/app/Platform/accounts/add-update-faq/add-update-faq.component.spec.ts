import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateFaqComponent } from './add-update-faq.component';

describe('AddUpdateFaqComponent', () => {
  let component: AddUpdateFaqComponent;
  let fixture: ComponentFixture<AddUpdateFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateFaqComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
