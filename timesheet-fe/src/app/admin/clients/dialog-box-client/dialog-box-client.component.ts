import { Component, Inject, Optional } from '@angular/core';
import { ApiService } from '../../../api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface ClientsData {
  id?: number,
  name: string;
  code: string;
  address: string;
}

@Component({
  selector: 'app-dialog-box-client',
  templateUrl: './dialog-box-client.component.html',
  styleUrl: './dialog-box-client.component.css'
})
export class DialogBoxClientComponent {
  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<DialogBoxClientComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ClientsData) {
    this.local_data = {...data};
    this.action = this.local_data.action;
  }

  name: any;
  code: any;
  address: any;
  action:string;
  local_data:any;

  formClient = new FormGroup({
    name: new FormControl('', Validators.required),
    code: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
  });

  doAction(){
    this.dialogRef.close({event:this.action,data:this.local_data});
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }
}

