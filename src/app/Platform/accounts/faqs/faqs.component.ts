import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PaginationComponent } from '../../../Core/common/pagination/pagination.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FaqService } from '../../dashboard/Services/faq.service';
import { Faq } from '../../../Core/common/CommonModels/FaqModel';

@Component({
  selector: 'app-faqs',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.css'
})
export class FaqsComponent {
  faqs: any[] = [];
  searchTerm = '';
  filteredFaqs: any[] = [];   // filtered list for UI

  showForm = false;
  selectedFaq: Faq | null = null;
  faqForm!: FormGroup;

  constructor(private fb: FormBuilder, private faqService: FaqService) { }

  ngOnInit(): void {
    this.createForm();
    this.loadFaqs();
  }

  createForm(): void {
    this.faqForm = this.fb.group({
      id: [0],
      question: ['', Validators.required],
      answer: ['', Validators.required],
      // category: [''],
      isActive: [true]
    });
    this.faqForm.setValue({
      id: 0,
      question: '',
      answer: '',
      isActive: true
    });
  }

  loadFaqs(): void {
    this.faqService.getAllFaqs().subscribe((res: any) => {
      this.faqs = res as Faq[];
      this.filteredFaqs = [...this.faqs];
    });
  }
  toggleForm(): void {
    this.showForm = !this.showForm;

    if (this.showForm) {
      // Opening form for Add → reset form and clear selectedFaq
      this.selectedFaq = null;
      this.faqForm.reset({ isActive: true }); // set default values
    } else {
      // Closing form → clear selectedFaq
      this.selectedFaq = null;
    }
  }


  cancelForm(): void {
    this.showForm = false;
    this.selectedFaq = null;
    this.faqForm.reset({
      id: 0,
      question: '',
      answer: '',
      isActive: true
    });
  }


  editFaq(faq: any): void {
    this.selectedFaq = faq;
    this.showForm = true;

    // Patch the form with the FAQ values
    this.faqForm.patchValue({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      isActive: faq.isActive
    });
  }


  deleteFaq(faqId: any): void {
   this.faqService.deleteFaq(faqId).subscribe((res:any)=>{
    this.loadFaqs();
   })
  }

  onSubmit(): void {
    
    if (this.faqForm.invalid) {
      this.faqForm.markAllAsTouched();
      return;
    }
    if(this.faqForm.get('id')?.value == null){
      this.faqForm.setValue({...this.faqForm.value,id : 0})
    }
    const faqData = { ...this.faqForm.value };
    if (this.selectedFaq) {
      this.faqService.updateFaq(faqData.id, faqData).subscribe(() => {
        this.cancelForm();
        this.loadFaqs();
      });
    } else {
      this.faqService.addFaqs(faqData).subscribe(() => {
        this.cancelForm();
        this.loadFaqs();
      });
    }
  }

  onSearchChange(): void {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      // If search box empty → reset to full list
      this.filteredFaqs = [...this.faqs];
    } else {
      this.filteredFaqs = this.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(term) ||
          faq.answer.toLowerCase().includes(term)
      );
    }
  }
}
