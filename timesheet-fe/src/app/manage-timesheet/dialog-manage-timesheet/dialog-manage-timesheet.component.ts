import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogBoxComponent } from '../../admin/users/dialog-box/dialog-box.component';
import * as CircularJSON from 'circular-json';

@Component({
  selector: 'app-dialog-manage-timesheet',
  templateUrl: './dialog-manage-timesheet.component.html',
  styleUrl: './dialog-manage-timesheet.component.css'
})
export class DialogManageTimesheetComponent {
  note: string;
  action: string;
  local_data:any;

  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data= {...data};
    this.action = this.local_data.action;
    this.note = this.local_data.timesheets[0].note;
  }

  doAction(){

    for(let timesheets of this.local_data.timesheets){
      const {timesheet,...rest} = timesheets.user
      timesheets.user = rest;

      const {user, ...rest2} = timesheets.projects
      timesheets.projects = rest2;
    }
    this.dialogRef.close({event:this.action,data:this.local_data});
  }

  closeDialog(){

    this.dialogRef.close({event:'Cancel'});
  }
}
