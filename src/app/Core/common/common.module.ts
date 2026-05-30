import { NgModule } from '@angular/core';
import { CommonModule as AngularCommonModule } from '@angular/common';

import { CommonRoutingModule } from './common-routing.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoaderComponent } from './loader/loader.component';


@NgModule({
  declarations: [
  ],
  imports: [
    AngularCommonModule,
    CommonRoutingModule,
  ],
  exports:[]
})
export class CommonFeatureModule { }
