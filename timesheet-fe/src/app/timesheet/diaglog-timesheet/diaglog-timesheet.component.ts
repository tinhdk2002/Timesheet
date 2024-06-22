import {  AfterContentChecked, Component, Inject, OnInit, Optional } from '@angular/core';
import { ApiService } from '../../api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsersData } from '../../admin/users/users.component';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';

export interface TimesheetData {
  id?: string;
  note: string;
  time: number;
  type: string;
  date: string;
  start: string;
  tasks: any;
  user:any;
}



@Component({
  selector: 'app-diaglog-timesheet',
  templateUrl: './diaglog-timesheet.component.html',
  styleUrl: './diaglog-timesheet.component.css'
})
export class DiaglogTimesheetComponent implements OnInit{
  note: any;
  time: any;
  type: any;
  date: any;
  start: any;
  tasks: any;

  selected:any;
  user: UsersData | undefined;

  id: any;

  action!: string;
  local_data:any;
  selectedType: any = 'Normal working hours';
  
  formTimesheet= new FormGroup({
    project: new FormControl('',Validators.required),
    task: new FormControl('',Validators.required),
    note: new FormControl('',Validators.required),
    time: new FormControl('',Validators.required),
    type: new FormControl('',Validators.required),
  })

  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<DiaglogTimesheetComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: UsersData,
    
    ) {
        this.apiService.getUserById().subscribe((users: any) => {
          this.user = users
          this.local_data.user = this.user
          this.selectedType = this.local_data.type
        })
      this.local_data = {...data};
          this.action = this.local_data.action;
      if(this.local_data.projects !== undefined){
        this.apiService.getProjectId(this.local_data.projects.id).subscribe(project => {
          this.tasks = project.tasks
        })
      }
        
  }


  ngOnInit(): void {
    
  }

  


  doAction(){
    this.local_data.type = this.selectedType;
    this.local_data.date = this.dateFomatYYYYMMDD(this.local_data.date)
    this.dialogRef.close({event:this.action,data:this.local_data});
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

  projectChange(event:any){
    this.apiService.getProjectId(event.value.id).subscribe(project => {
      this.tasks = project.tasks
    this.local_data.tasks = this.tasks[0];
    })
  }

  dateFomatYYYYMMDD(date: any): any {
    var today = new Date(date);
    var day: any = today.getDate();
    var month:any = today.getMonth()+1;
    var year:any = today.getFullYear();
    if(day < 10)
      day = '0'+day;
    if(month < 10)
      month = '0'+month; 
    return year+'-'+month+'-'+day; 
  }
}