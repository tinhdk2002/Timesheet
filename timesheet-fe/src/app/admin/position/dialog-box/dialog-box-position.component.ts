//dialog-box.component.ts
import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../api.service';
import { elementAt } from 'rxjs';
import { Action } from 'rxjs/internal/scheduler/Action';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PositionData } from '../postion.component';

@Component({
  selector: 'app-dialog-box-position',
  templateUrl: './dialog-box-position.component.html',
  styleUrls: ['./dialog-box-position.component.scss']
})
export class DialogBoxPositionComponent {
  name: string = '';
  shortName: string = '';
  code: string = '';

  action:string;
  local_data:any;


  formPosition = new FormGroup({
    name: new FormControl('', Validators.required),
    shortName: new FormControl('', Validators.required),
    code: new FormControl('', [Validators.required]),
  })

  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<DialogBoxPositionComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: PositionData) {
    
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
