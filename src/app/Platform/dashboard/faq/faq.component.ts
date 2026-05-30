import { Component } from '@angular/core';
import { Faq } from '../../../Core/common/CommonModels/FaqModel';
import { FaqService } from '../Services/faq.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq',
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {

  faqs:Faq[]= [];

  

  constructor(private faqService:FaqService) {
     this.getAllFaqs();
  }
  getAllFaqs(){
    this.faqService.getAllFaqs().subscribe((res:any)=>{
        this.faqs = res as Faq[];
    })
  }
}
