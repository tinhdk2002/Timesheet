//dialog-box.component.ts
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../api.service';
import { elementAt } from 'rxjs';
import { Action } from 'rxjs/internal/scheduler/Action';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersData } from '../users.component';
import { PositionData } from '../../position/postion.component';
import { BranchData } from '../../branch/branchs.component';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss']
})
export class DialogBoxComponent implements OnInit {
  roles=  ['admin', 'user', 'manager'];
  positions: PositionData[] = [];
  branchs: BranchData[] = [];
  sexs= ['male','female'];

  action:string;
  local_data:any;

  ngOnInit(): void {
    this.getBranchs();
    this.getPositions();
  }

  formUser = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    sex: new FormControl('', Validators.required),
    position: new FormControl('', Validators.required),
    branch: new FormControl('', Validators.required),
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
  
  async getBranchs() {
    await this.apiService.getAllBranchs().subscribe((branchs: any) => {
      this.branchs = branchs
    })
  }

  async getPositions() {
    await this.apiService.getAllPositions().subscribe((positions: any) => {
      this.positions = positions
    })
  }

  doAction(){
    this.dialogRef.close({event:this.action,data:this.local_data});
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

}
