import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogBoxProjectComponent } from './dialog-box-project/dialog-box-project.component';
import { ApiService } from '../api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { UntypedFormBuilder } from '@angular/forms';
import { DialogBoxClientComponent } from '../admin/clients/dialog-box-client/dialog-box-client.component';

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
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit {
  constructor(private apiService: ApiService, private dialog: MatDialog){}

  displayedColumns: string[] = ['name', 'code', 'address', 'action'];

  @ViewChild(MatTable, { static: true })
  table!: MatTable<any>;

  projects: ProjectData[] = []; // Dữ liệu danh sách user
  dataSource = this.projects;
  
  currentPage: number = 1; // Trang hiện tại
  pageSize: number = 10; // Số lượng user hiển thị trên mỗi trang
  totalPages: number = 1; // Tổng số trang
  userManage: any = [];
  totalMember: any;
  dataProject: any;
  dataProjects: any = [];

  ngOnInit(): void {
    this.fetchProjects();
  }

  async fetchProjects() {
    // Gọi API hoặc service để lấy danh sách user từ backend
    // Đây là ví dụ giả lập dữ liệu
    let userId = this.apiService.getUserId();
    await this.apiService.getProjectByManager(userId).subscribe((projects: any) => {
      this.projects = projects;
      this.dataSource = this.projects
      this.manageUser(this.dataSource)
      
      this.dataSource.sort((a,b) => {
        return a.client.id - b.client.id
      })
    this.totalPages = Math.ceil(this.dataSource.length / this.pageSize);

    });
  }
  
  manageUser(data: any): any {
    for(let project of data)
      {
        for(let user of project.users)
          {
            if(user.role === 'manager' || user.role === 'admin')
            {
              project.manager = user 
            }
          } 
          if(project.manager === undefined)
             project.manager = project.users[0]
      }
  }

  displayedData(id : number): any[] {
    const data = this.dataSource.filter(project => project.client.id == id)
    return data
  }


  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  openDialog(action: any, obj: any) {
    obj.action = action;
    let dialogRef
    if(action != 'Delete'){
       dialogRef = this.dialog.open(DialogBoxProjectComponent, {
        width: '2500px',
        height: '80vh',
        data:obj
      });
    }
    else{
      dialogRef = this.dialog.open(DialogBoxClientComponent, {
        width: '300px',
        data:obj
      });
    }

    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        this.addRowData(result.data);
      }else if(result.event == 'Update'){
        this.updateRowData(result.data);
      }else if(result.event == 'Delete'){
        this.deleteRowData(result.data);
      }
    });
  }

  addRowData(row_obj: any){
    this.apiService.postProject(row_obj)
      .subscribe(response => {
        console.log(response)
        this.dataSource.push({
          id: response.id,
          startAt: row_obj.startAt,
          endAt:  row_obj.endAt,
          tasks: row_obj.tasks,
          client:  row_obj.client,
          users:  row_obj.users, 
          name: row_obj.name,
          code: row_obj.code,
        });
        this.manageUser(this.dataSource)
      },
      (err) => {
        console.error(err.error)
      })
    
    
  }
  updateRowData(row_obj: any){
    this.apiService.updateProject(Number(row_obj.id), row_obj).subscribe( 
      response => {
        console.log(response)
        this.dataSource = this.dataSource.filter((value,key)=>{
        if(value.id == row_obj.id){
          value.name = row_obj.name;
            value.code = row_obj.code;
            value.startAt = row_obj.startAt;
            value.endAt = row_obj.endAt;
            value.client = row_obj.client;
            value.users = row_obj.users;
            value.tasks = row_obj.tasks;
          }
          this.manageUser(this.dataSource);
          return true;
        });
      },
      (err) => {
        console.error(err.error)
      }
    )
  }
  deleteRowData(row_obj: any){
    this.apiService.deleteProject(row_obj.id).subscribe(
      response => {
        console.log(response)
        this.dataSource = this.dataSource.filter((value,key)=>{
          return value.id != row_obj.id;
        });
      },
      (err) => {
        console.error(err.error)
      }
    )
  }

 
  
}
