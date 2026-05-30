import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FaqsService {
  private http = inject(HttpClient);

  private apiUrl: string = environment.baseUrl;
  private getAllNewsLetterAdminUrl: string = 'Newsletter/GetAllNewsLettersAdmin';
  private addNewsLetterAdminUrl: string = 'Newsletter/AddNewsLetter';
  private updateNewsLetterAdminUrl: string = 'Newsletter/UpdateNewsLetter';
  private deleteNewsLetterAdminUrl: string = 'Newsletter/DeleteNewsLetter';
  private activeInActiveNewsLettersUrl: string = 'Newsletter/ActiveInActiveNewsLetters';
  constructor() { }

  getFaqs(data: any) {

  }
  getNewLetters(filterModel: any): Observable<any> {
    
    return this.http.post<any>(`${this.apiUrl + this.getAllNewsLetterAdminUrl}`, filterModel);
  }
  addNewsLetter(newsletterObj: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl + this.addNewsLetterAdminUrl}`, newsletterObj);
  }

  updateNewsLetter(newsletterObj: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl + this.updateNewsLetterAdminUrl}`, newsletterObj);
  }
  deleteNewsletter(newsletterId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl + this.deleteNewsLetterAdminUrl}`, newsletterId);
  }
  activeOrInActiveNewsLetter(newsLetterId: number, isActive: boolean): Observable<any> {
    const obj = {
      newsLetterId: newsLetterId,
      isActive: isActive
    };
    return this.http.post<any>(`${this.apiUrl + this.activeInActiveNewsLettersUrl}`, obj);
  }
}
