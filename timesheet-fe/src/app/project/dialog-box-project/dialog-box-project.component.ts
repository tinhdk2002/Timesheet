import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { ApiService } from '../../api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogBoxClientComponent } from '../../admin/clients/dialog-box-client/dialog-box-client.component';
import { MatTable } from '@angular/material/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface ProjectData {
  id?: number,
  name: string;
  code: string;
  startAt: Date;
  endAt: Date;
  tasks: any;
  client: any;
  users: any; 
  manager?: any;
}



@Component({
  selector: 'app-dialog-box-project',
  templateUrl: './dialog-box-project.component.html',
  styleUrl: './dialog-box-project.component.css'
})

export class DialogBoxProjectComponent implements OnInit{

  
  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<DialogBoxClientComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ProjectData) {
    this.local_data = {...data};
    this.action = this.local_data.action;
  }


  userList: any[] = []; // Danh sách user
  selectedMembers: any[] = []; // Danh sách các member đã chọn
  clientList: any[] = [];
  tasks: any[] = [];
  selectedTasks: any[] = [];

  name: any;
  code: any;
  address: any;
  client: any;

  action:string;
  local_data:any;
  show: boolean =  false;
  searchUser: any;

  formProject = new FormGroup({
    client: new FormControl('',Validators.required),
    projectName: new FormControl('',Validators.required),
    projectCode: new FormControl('',Validators.required),
    projectStart: new FormControl('',Validators.required),
    projectEnd: new FormControl('',Validators.required),
  })
  
  @ViewChild('table1', { static: true }) table1!: MatTable<any>;
  @ViewChild('table2', { static: true }) table2!: MatTable<any>;



  ngOnInit(): void { 
    this.fetchData();

  }
   fetchData() {
    
     this.apiService.getAllUsers().subscribe((users: any) => {
      this.userList = users;
      if(this.action == 'Update')
        for(let user of this.local_data.users)
          this.addMember(user)
    
    })
     this.apiService.getAllClients().subscribe((clients: any) => {
      this.clientList = clients
    })
     this.apiService.getAllTasks().subscribe((tasks: any) => {
      this.tasks = tasks
      if(this.action == 'Update')
        for(let task of this.local_data.tasks)
          this.addTask(task)
    })
  }

  doAction(){
    this.local_data.users = this.selectedMembers
    this.local_data.tasks = this.selectedTasks
    this.dialogRef.close({event:this.action,data:this.local_data});
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }


  addMember(member: any) {
    // Thêm user vào danh sách các member đã chọn
    this.userList = this.userList.filter(user => user.id != member.id)
    this.selectedMembers.push(member);
  }

  showMember(){
    this.show = !this.show;

  } 

  removeMember(member: any) { 
    // Xóa member khỏi danh sách các member đã chọn
    const index = this.selectedMembers.indexOf(member);
    if (index !== -1) {
      this.selectedMembers.splice(index, 1);
    }
    this.userList.push(member)
  }

  addTask(task: any){
      this.selectedTasks.push(task);
      this.tasks = this.tasks.filter(t => t.id != task.id); 
      this.table1.renderRows()
      this.table2.renderRows()
  }
  
  removeTask(task: any){
    this.tasks.push(task)
    this.selectedTasks = this.selectedTasks.filter(t => t.id != task.id);
    this.table1.renderRows()
    this.table2.renderRows()

  }

}
