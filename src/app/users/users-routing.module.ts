import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';
import { FORM_MODE } from '../core/enums/form-mode.enum';


const routes: Routes = [
  { path: 'users', data: { breadcrumb: 'users.itself' }, children: [
      { path: '',  pathMatch: 'full', component: UserListComponent },
      { path: 'create',  pathMatch: 'full', component: UserFormComponent, data: { breadcrumb: 'global.new',
        formMode: FORM_MODE.Create } },
      { path: 'edit/:id',  pathMatch: 'full', component: UserFormComponent, data: { breadcrumb: 'global.edit',
        formMode: FORM_MODE.Edit } },
      { path: 'view/:id',  pathMatch: 'full', component: UserFormComponent, data: { breadcrumb: 'global.view',
        formMode: FORM_MODE.View } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
