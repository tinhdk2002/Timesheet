import { NgModule } from '@angular/core';

import { ClientsComponent } from './admin/clients/clients.component';
import { TasksComponent } from './admin/tasks/tasks.component';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './admin/users/users.component';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { ProjectComponent } from './project/project.component'; 
import { TimesheetComponent } from './timesheet/timesheet.component';
import { ManageTimesheetComponent } from './manage-timesheet/manage-timesheet.component';
import { appGuard } from './app.guard';
import { InforUserComponent } from './inforUser/inforUser.component';
import { PositionComponent } from './admin/position/postion.component';
import { BranchsComponent } from './admin/branch/branchs.component';

const routes: Routes = [
  {path:'',redirectTo:'login',pathMatch:'full'}, 
  { path: 'login', component: LoginComponent},
  { path:'app',component:LayoutComponent, canActivate:[appGuard] , children:[
    { path: 'admin/clients', component: ClientsComponent, canActivate:[appGuard]  },
    { path: 'admin/users', component: UsersComponent, canActivate:[appGuard]  },
    { path: 'admin/tasks', component: TasksComponent, canActivate:[appGuard]  },
    { path: 'admin/positions', component: PositionComponent, canActivate:[appGuard]  },
    { path: 'admin/branchs', component: BranchsComponent, canActivate:[appGuard]  },
    { path: 'project', component: ProjectComponent, canActivate:[appGuard] },
    { path: 'timesheet',component: TimesheetComponent, canActivate:[appGuard] },
    { path: 'manageTimesheets',component: ManageTimesheetComponent, canActivate:[appGuard]  },
    { path: 'inforUser', component: InforUserComponent, canActivate:[appGuard]},
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
