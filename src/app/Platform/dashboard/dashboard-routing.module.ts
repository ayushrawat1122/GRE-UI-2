import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ProductsComponent } from './products/products.component';
import { FaqComponent } from './faq/faq.component';
import { HomeComponent } from './home/home.component';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { TermsAndConditionComponent } from './terms-and-condition/terms-and-condition.component';
import { PrivacyAndCookiesComponent } from './privacy-and-cookies/privacy-and-cookies.component';
import { PromoProductsComponent } from './promo-products/promo-products.component';
import { PromoOrderConfirmationComponent } from './promo-order-confirmation/promo-order-confirmation.component';
import { PromoOrderHistoryComponent } from './promo-order-history/promo-order-history.component';
import {  authGuard, canHaveOrderHistoryScreenPermission, canHaveOrderScreenPermission, canHavePromoOrderHistoryScreenPermission, canHavePromoOrderScreenPermission } from '../../Auth/auth/auth.guard';
import { UnAuthorizeComponent } from '../../Core/common/un-authorize/un-authorize.component';
import { SalesReportComponent } from './sales-report/sales-report.component';

const routes: Routes = [
  {
    path:'',
    component:DashboardComponent,
    // canActivate:[authGuard],
    children:[
      {
        path:'products',
        component:ProductsComponent,
        canActivate:[canHaveOrderScreenPermission]
      },  
      {
        path:'promo-products',
        component:PromoProductsComponent,
        canActivate:[canHavePromoOrderScreenPermission]
      },
      {
        path:'faq',
        component:FaqComponent
      },
      {
        path:'home',
        component:HomeComponent,
        canActivate:[authGuard]

      },
      {
        path:'newsletter',
        component:NewsletterComponent
      },
      {
        path:'order-confirmation',
        component:OrderConfirmationComponent, 
        canActivate:[canHaveOrderScreenPermission]
      },
      {
        path: 'account',
        loadChildren: () => import('../accounts/accounts.module').then(m => m.AccountsModule)
      },
      {
        path: 'order-history',
        component:OrderHistoryComponent,
        canActivate:[canHaveOrderHistoryScreenPermission]
      },
      {
        path: 'promo-order-history',
        component:PromoOrderHistoryComponent,
        canActivate:[canHavePromoOrderHistoryScreenPermission]
      },
      {
        path:'T&C',
        component:TermsAndConditionComponent
        
      },
      {
        path:'cookies&policy',
        component:PrivacyAndCookiesComponent
      },
      {
        
        path:'promo-order-confirmation',
        component:PromoOrderConfirmationComponent,
        canActivate:[canHavePromoOrderScreenPermission]
       
      },
      {
        
        path:'sales-report',
        component:SalesReportComponent
       
       
      },
      {
        path:'unauthorize',
        component:UnAuthorizeComponent,
      }
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
