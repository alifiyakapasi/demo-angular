import { Routes } from '@angular/router';
import { CommonComponent } from './common/common.component';
import { FormFieldsComponent } from './form-fields/form-fields.component';
import { TableGridComponent } from './table-grid/table-grid.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { ImagesComponent } from './images/images.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CombineLatestComponent } from './combine-latest/combine-latest.component';
import { RetryComponent } from './retry/retry.component';

export const routes: Routes = [
  { path: '', component: CommonComponent },
  { path: 'home', component: CommonComponent },
  { path: 'user', component: DropdownComponent },
  { path: 'table', component: TableGridComponent },
  { path: 'settings', component: DashboardComponent },
  { path: 'about', component: FormFieldsComponent },
  { path: 'images', component: ImagesComponent },
  { path: 'retry', component: RetryComponent },
  { path: 'combineLatest', component: CombineLatestComponent },
  { path: 'widgets/widget1', component: FormFieldsComponent },
  { path: 'widgets/widget2', component: CommonComponent },
  { path: 'widgets/widget3', component: TableGridComponent },
  {
    path: '**',
    redirectTo: '',
  },
];