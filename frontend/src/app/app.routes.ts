import { Routes } from '@angular/router';
import { DepartmentListComponent } from './components/department-list/department-list';
import { DepartmentFormComponent } from './components/department-form/department-form';

export const routes: Routes = [
  { path: '', redirectTo: 'departments', pathMatch: 'full' },
  { path: 'departments', component: DepartmentListComponent },
  { path: 'departments/new', component: DepartmentFormComponent },
  { path: 'departments/:id/edit', component: DepartmentFormComponent },
];
