import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FaqService {
 private http = inject(HttpClient);

  private apiUrl: string = environment.baseUrl;

  private getAllFaqUrl: string = 'Faq';
  constructor() { }
  
  getAllFaqs(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl + this.getAllFaqUrl}`);
    }
  addFaqs(data:any): Observable<any> {
      return this.http.post<any>(`${this.apiUrl + this.getAllFaqUrl}`,data);
    }
  updateFaq(faqid:any,data:any): Observable<any> {
      return this.http.put<any>(`${this.apiUrl + this.getAllFaqUrl}/${faqid}`,data);
    }
  deleteFaq(faqid:any): Observable<any> {
      return this.http.delete<any>(`${this.apiUrl + this.getAllFaqUrl}?id=${faqid}`);
    }

}
