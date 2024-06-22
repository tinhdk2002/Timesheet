//dialog-box.component.ts
import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../api.service';
import { elementAt } from 'rxjs';
import { Action } from 'rxjs/internal/scheduler/Action';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface UsersData {
  id?: number,
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  sex: string;
  password?: string;
  projects: any;
}


@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss']
})
export class DialogBoxComponent {

  firstName: any;
  lastName: any;
  email: any;
  roles=  ['admin', 'user', 'manager'];
  sexs= ['male','female'];
  selectedOption: string = '';
  selecterSex: string = '';
  password: string = '';

  action:string;
  local_data:any;

  formUser = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    sex: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
  })

  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: UsersData) {
    
    this.local_data = {...data};
    this.action = this.local_data.action;
    if(this.action == 'Add'){
      this.local_data.sex = '';
      this.local_data.role = '';
    }
  }
  

  doAction(){
    this.dialogRef.close({event:this.action,data:this.local_data});
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

}
