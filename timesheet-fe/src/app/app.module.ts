import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientsComponent } from './admin/clients/clients.component';
import { TasksComponent } from './admin/tasks/tasks.component';
import { UsersComponent } from './admin/users/users.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


import { DialogBoxComponent } from './admin/users/dialog-box/dialog-box.component';
import { DialogBoxClientComponent } from './admin/clients/dialog-box-client/dialog-box-client.component';
import { DialogBoxTaskComponent } from './admin/tasks/dialog-box-task/dialog-box-task.component';
import { ProjectComponent } from './project/project.component';
import { DialogBoxProjectComponent } from './project/dialog-box-project/dialog-box-project.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import {MAT_DATE_FORMATS, provideNativeDateAdapter} from '@angular/material/core';
import { MY_DATE_FORMATS } from './my-date-format';
import { DiaglogTimesheetComponent } from './timesheet/diaglog-timesheet/diaglog-timesheet.component';
import { MatSelectModule } from '@angular/material/select';
import { ManageTimesheetComponent } from './manage-timesheet/manage-timesheet.component';
import { DialogManageTimesheetComponent } from './manage-timesheet/dialog-manage-timesheet/dialog-manage-timesheet.component';
import { InforUserComponent } from './inforUser/inforUser.component';
import { DialogInforBoxComponent } from './inforUser/dialog-box/dialog-box.component';


@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    ClientsComponent,
    TasksComponent,
    UsersComponent,
    DialogBoxComponent,
    LoginComponent,
    DialogBoxClientComponent,
    DialogBoxTaskComponent,
    ProjectComponent,
    DialogBoxProjectComponent,
    TimesheetComponent,
    DiaglogTimesheetComponent,
    ManageTimesheetComponent,
    DialogManageTimesheetComponent,
    InforUserComponent,
    DialogInforBoxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule, 
    FormsModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  providers: [
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
  ],
  bootstrap: [AppComponent] 
})
export class AppModule { }
