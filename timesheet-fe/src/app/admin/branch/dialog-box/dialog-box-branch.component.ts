//dialog-box.component.ts
import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../api.service';
import { elementAt } from 'rxjs';
import { Action } from 'rxjs/internal/scheduler/Action';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BranchData } from '../branchs.component';

@Component({
  selector: 'app-dialog-box-branch',
  templateUrl: './dialog-box-branch.component.html',
  styleUrls: ['./dialog-box-branch.component.scss']
})
export class DialogBoxBranchComponent {

  name: string = '';
  displayName: string = '';
  code: string = '';

  action:string;
  local_data:any;

  formBranch = new FormGroup({
    name: new FormControl('', Validators.required),
    displayName: new FormControl('', Validators.required),
    code: new FormControl('', [Validators.required]),
  })

  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<DialogBoxBranchComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: BranchData) {
    
    this.local_data = {...data};
    this.action = this.local_data.action;
  }
  

  doAction(){
    this.dialogRef.close({event:this.action,data:this.local_data});
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

}
