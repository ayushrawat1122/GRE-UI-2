import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountSettingsComponent } from './account-settings.component';
import { ManageProfileComponent } from './manage-profile/manage-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AddUserComponent } from './add-user/add-user.component';
import { UsersComponent } from './users/users.component';
import { TerritoriesComponent } from './territories/territories.component';
import { AddUpdateTerritoriesComponent } from './add-update-territories/add-update-territories.component';
import { StoresComponent } from './stores/stores.component';
import { AddUpdateStoreComponent } from './add-update-store/add-update-store.component';
import { AddUpdateProductsComponent } from './add-update-products/add-update-products.component';
import { FaqComponent } from '../dashboard/faq/faq.component';
import { FaqsComponent } from './faqs/faqs.component';
import { NewslettersComponent } from './newsletters/newsletters.component';
import { onlyApplicationAdmin } from '../../Auth/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AccountSettingsComponent,
    children:[
      {
        path: 'manage-profile',
        component:ManageProfileComponent
      },
      {
        path:'change-password',
        component:ChangePasswordComponent
      }
      ,
      {
        path:'add-user',
        component:AddUserComponent
      }
      ,
      {
        path:'update-user/:email',
        component:AddUserComponent
      }
      ,
      {
        path:'users',
        component:UsersComponent
      },
      {
        path:'add-territories',
        component:AddUpdateTerritoriesComponent,
        canActivate:[onlyApplicationAdmin]
      },
      {
        path:'update-territory/:id',
        component:AddUpdateTerritoriesComponent
      }
      ,
      {
        path:'territories',
        component:TerritoriesComponent,
        canActivate:[onlyApplicationAdmin]
      },
      {
        path:'stores',
        component:StoresComponent
      },
      {
        path:'add-store',
        component:AddUpdateStoreComponent
      },
      {
        path:'update-store/:id',
        component:AddUpdateStoreComponent
      },
      {
        path:'my-store/:id',
        component:AddUpdateStoreComponent
      },
      {
        path:'add-product',
        component:AddUpdateProductsComponent
      },
      {
        path:'update-product/:id',
        component:AddUpdateProductsComponent
      },
      {
        path:'faq',
        component:FaqsComponent
      },
      {
        path:'newsletters',
        component:NewslettersComponent
      }
      
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }
