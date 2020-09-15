import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { ItemsListComponent } from './items-list/items-list.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CreateItemComponent } from './create-item/create-item.component';

@NgModule({
  declarations: [
    AppComponent,
    EmployeesListComponent,
    ItemsListComponent,
    CheckoutComponent,
    CreateItemComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
