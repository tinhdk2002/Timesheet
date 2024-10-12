import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { DialogInforBoxComponent } from './dialog-box/dialog-box.component';
import { UsersData } from '../admin/users/users.component';


@Component({
  selector: 'app-infor-user',
  templateUrl: './inforUser.component.html',
  styleUrl: './inforUser.component.css'
})
export class InforUserComponent implements OnInit {
  constructor(private apiService: ApiService, private dialog: MatDialog){}

  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'role', 'sex', 'position', 'branch','projects', 'action'];

  @ViewChild(MatTable, { static: true })
  table!: MatTable<any>;

  user: UsersData = {
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    sex: '',
    projects: '',
    position: '',
    branch: ''
  };

  dataSource: UsersData = this.user;


  ngOnInit(): void {
    this.fetchUsers();
  }

  async fetchUsers() {
    await this.apiService.getUserById().subscribe((user: any) => {
      this.user = user;
      this.dataSource = this.user;
    });
    
  }

  get displayedData(): any {
    return this.dataSource
  }


  openDialog(action: any, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogInforBoxComponent, {
      width: '300px',
      data:obj
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        this.updateRowData(result.data);
      }
    });
  }

  updateRowData(row_obj: any){
    this.apiService.updateUser(Number(row_obj.id), row_obj).subscribe( 
      response => {
        this.dataSource.firstName =  row_obj.firstName;
        this.dataSource.lastName =  row_obj.lastName;
        this.dataSource.email =  row_obj.email;
        this.dataSource.role =  row_obj.role;
        this.dataSource.sex =  row_obj.sex;
        this.dataSource.projects =  row_obj.projects;
        this.dataSource.branch = response.branch;
        this.dataSource.position = response.position;
        this.dataSource.password =  row_obj.password;
      },
      (e) => {
        console.error(e.error.message)
      }
    )

  }
}