import { Component, Inject, Optional } from '@angular/core';
import { ApiService } from '../../../api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface TasksData {
  id?: number,
  name: string;
  archive: string;
  type: string; 
}

@Component({
  selector: 'app-dialog-box-task',
  templateUrl: './dialog-box-task.component.html',
  styleUrl: './dialog-box-task.component.css'
})
export class DialogBoxTaskComponent {

  name: any;

  action:string;
  local_data:any;

  formTask= new FormGroup({
    name: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required)

  })

  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<DialogBoxTaskComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: TasksData) {
    this.local_data = {...data};
    this.action = this.local_data.action;
  }
  

  doAction(){
    if(this.action == 'Archive' || this.action == 'Unarchive')
    {
      this.local_data.archive = !this.local_data.archive
    }
    this.dialogRef.close({event:this.action,data:this.local_data});

  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

}
