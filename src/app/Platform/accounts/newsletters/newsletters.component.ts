import {  Component, HostListener, inject, OnInit } from '@angular/core';
import { ConfirmationModalComponent } from '../../../Core/common/confirmation-modal/confirmation-modal.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, JwtPayload } from '../../../Auth/auth/auth.service';
import { FaqsService } from '../Services/faqs.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import { PaginationComponent } from '../../../Core/common/pagination/pagination.component';
import { MatTooltipModule } from '@angular/material/tooltip';

export class FilterNewsLetter {
  pageNumber:number=1;
  pageSize:number = 5;
  searchTerm:string='';
  
}
@Component({
  selector: 'app-newsletters',
  imports: [MatTooltipModule,ConfirmationModalComponent, CommonModule, FormsModule, ReactiveFormsModule,PaginationComponent],
  templateUrl: './newsletters.component.html',
  styleUrl: './newsletters.component.css'
})
export class NewslettersComponent implements OnInit {

  pdfTouched = false;
totalRecords: number = 0;
pageSize: number = 10;
page: number = 1;
  newsLetters: any[] = [];
  selectedNewsletter: any;
  user: JwtPayload | null = null;
  searchTerm: string = '';
  newsletterForm!: FormGroup;
  selectedFile: File | null = null;
  pdfPreviewUrl: any = null;
  existingFileName: string = '';
  filterModel:FilterNewsLetter = new FilterNewsLetter();
  private sanitizer = inject(DomSanitizer);
  private toasterService = inject(ToastrService);

  private authService = inject(AuthService);
  private faqService = inject(FaqsService);


  constructor(
    private fb: FormBuilder,
  ) { }
  ngOnInit(): void {
    const modalEl = document.getElementById('addNewsletterModal');
  if (modalEl) {
    modalEl.addEventListener('hidden.bs.modal', () => {
      this.resetNewsletterForm();
    });
  }
    this.newsletterForm = this.fb.group({
      newsletterId: [0],
      title: ['', Validators.required],
      pdfBase64: ['', Validators.required],
      pdfName: ['', Validators.required],
      publishedDate: [''],

    });
    this.authService.user$.subscribe((user) => {
      if (user?.role) {
        this.user = user;

      }
    });
    this.getNewsletters(this.filterModel);
  }
  resetNewsletterForm() {
  this.newsletterForm.reset({ newsletterId: 0 });
  this.selectedFile = null;
  this.pdfPreviewUrl = null;
  this.existingFileName = '';
  this.pdfTouched = false;
}
  getNewsletters(filterModel:any): void {
    this.faqService.getNewLetters(filterModel).subscribe((response: any) => {
        if ( response.statusCode === 200) {
          this.totalRecords = response.data[0]?.totalRecords || 0;
          this.newsLetters = response.data.map((n: any) => ({
            ...n,
            safePdfUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
              'data:application/pdf;base64,' + n.pdfBase64
            )
          }));
        } else {
          
          this.newsLetters = [];
          // this.toasterService.error(response.message || 'Failed to fetch newsletters');
        }
      },
     );
  }

 
  toggleActive(newsLetter: any) {
    const newsLetterObject = newsLetter;
    newsLetterObject.isActive = !newsLetterObject.isActive;
    this.faqService.activeOrInActiveNewsLetter(newsLetterObject.newsletterId,newsLetterObject.isActive).subscribe((res: any) => {
      if (res && res.statusCode === 200) {
        this.toasterService.success(res.message);
        this.getNewsletters(this.filterModel); // Refresh list
      }
      else {
        this.toasterService.error(res.message || 'Failed to update newsletter status');
      }
    });

  }
extractDatePart(isoString: string): string {
  if (!isoString) return '';
  return isoString.split('T')[0]; // Take only "yyyy-MM-dd"
}
  onUpdateNewsLetter(newsLetterId: any) {
    const newsletter = this.newsLetters.find(n => n.newsletterId === newsLetterId);
    if (newsletter) {
      // Convert publishedDate to yyyy-MM-dd
     

      this.newsletterForm.patchValue({
        newsletterId: newsletter.newsletterId,
        title: newsletter.title,
        pdfBase64: newsletter.pdfBase64,
        pdfName: newsletter.pdfName,
        publishedDate: this.extractDatePart(newsletter.publishedDate)
      });

      // PDF preview
      this.pdfPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        'data:application/pdf;base64,' + newsletter.pdfBase64
      );
this.existingFileName = newsletter.pdfName; 
      // this.faqService.updateNewsLetter(this.newsletterForm.value).subscribe((res: any) => {
      //   if (res && res.statusCode === 200) {
      //     this.toasterService.success(res.message);
      //     const modalElement = document.getElementById('addNewsletterModal');
      //     if (modalElement) {
      //       const modalInstance = bootstrap.Modal.getInstance(modalElement)
      //         || new bootstrap.Modal(modalElement);
      //       modalInstance.hide(); 
      //       // Optional: manually remove backdrop if stuck
      //       const backdrops = document.getElementsByClassName('modal-backdrop');
      //       while (backdrops.length > 0) {
      //         backdrops[0].parentNode?.removeChild(backdrops[0]);
      //       }
      //       this.newsletterForm.reset();
      //       this.pdfPreviewUrl = null;
      //       this.selectedFile = null;
      //       this.getNewsletters();
      //     } 
      //     else {
      //       this.toasterService.error(res.message || 'Failed to update newsletter');
      //     }
      
      //   };

      //   // Close modal manually 
      // });
    }
  }

  onCancel(){
    this.newsletterForm.reset();
    this.pdfPreviewUrl = null;
    this.selectedFile = null;
  }

  setSelectedNewsLetter(newsletter: any) {
    
    this.selectedNewsletter = newsletter;
  }
  handleDelete($event: any) {
    this.faqService.deleteNewsletter(this.selectedNewsletter.newsletterId).subscribe((res: any) => {
        if (res && res.statusCode === 200) {
          this.toasterService.success('Newsletter deleted successfully');
          this.getNewsletters(this.filterModel); // Refresh list
        }
        else {
          this.toasterService.error(res.message || 'Failed to delete newsletter');
        }
      })
    
  }
  onSearchChange() {
    this.filterModel.searchTerm = this.searchTerm.trim();
    this.getNewsletters(this.filterModel);
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1]; // remove prefix
        this.pdfPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          'data:application/pdf;base64,' + base64String
        );
        // Save pure base64 in the form for backend
        this.newsletterForm.patchValue({
          pdfBase64: base64String,
          pdfName: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  }




  addNewsletter() {
    
    // if (!this.selectedFile) return;


    if (this.newsletterForm.invalid) {
      this.newsletterForm.markAllAsTouched();
      return;
    }

    const payload = this.newsletterForm.value;
    // const newNewsletter = {
    //   title: this.newsletterForm.value.title,
    //   safePdfUrl: this.sanitizer.bypassSecurityTrustResourceUrl(base64)
    // };


    

    if( payload.newsletterId > 0){
      this.faqService.updateNewsLetter(this.newsletterForm.value).subscribe((res: any) => {
        if (res && res.statusCode === 200) {
          this.toasterService.success(res.message);
          const modalElement = document.getElementById('addNewsletterModal');
          if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement)
              || new bootstrap.Modal(modalElement);
            modalInstance.hide();
            // Optional: manually remove backdrop if stuck
            const backdrops = document.getElementsByClassName('modal-backdrop');
            while (backdrops.length > 0) {
              backdrops[0].parentNode?.removeChild(backdrops[0]);
            }
            this.newsletterForm.reset();
            this.pdfPreviewUrl = null;
            this.selectedFile = null;
            this.getNewsletters(this.filterModel);
          }
          else {
            this.toasterService.error(res.message || 'Failed to update newsletter');
          }
        };
      });
    }
    else{

      this.faqService.addNewsLetter(this.newsletterForm.value).subscribe((res: any) => {
        if (res && res.statusCode === 200) {
          
          this.toasterService.success(res.message);
          const modalElement = document.getElementById('addNewsletterModal');
          if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement)
              || new bootstrap.Modal(modalElement);
            modalInstance.hide();
  
            // Optional: manually remove backdrop if stuck
            const backdrops = document.getElementsByClassName('modal-backdrop');
            while (backdrops.length > 0) {
              backdrops[0].parentNode?.removeChild(backdrops[0]);
            }
            this.newsletterForm.reset();
            this.pdfPreviewUrl = null;
            this.selectedFile = null;
            this.getNewsletters(this.filterModel);
          }
          else {
            this.toasterService.error(res.message || 'Failed to add newsletter');
          }
        };
  
        // Close modal manually
  
  
      });
    }

  }
  onPageChanged(event:any){
    
    this.page = event;
    this.filterModel.pageNumber=this.page;
    this.getNewsletters(this.filterModel)
  }
  onPageSizeChange(event:any){
     this.pageSize = event;
  this.filterModel.pageNumber = 1; // reset to first page
  this.filterModel.pageSize = this.pageSize;
    this.getNewsletters(this.filterModel)
  }

 @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (target?.classList?.contains('modal-backdrop')) {
      this.resetForm();
    }
  }

 

  resetForm() {
    this.newsletterForm.reset();
    this.selectedFile = null;
    this.pdfPreviewUrl = null;
    this.pdfTouched = false;
    this.existingFileName = '';
  }
}
