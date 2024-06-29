import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { DialogInforBoxComponent } from './dialog-box/dialog-box.component';

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
  selector: 'app-infor-user',
  templateUrl: './inforUser.component.html',
  styleUrl: './inforUser.component.css'
})
export class InforUserComponent implements OnInit {
  constructor(private apiService: ApiService, private dialog: MatDialog){}

  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'role', 'sex', 'projects', 'action'];

  @ViewChild(MatTable, { static: true })
  table!: MatTable<any>;

  user: UsersData = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    sex: '',
    projects: []
  }; // Dữ liệu danh sách user
  dataSource: UsersData[] = [this.user];
  
  currentPage: number = 1; // Trang hiện tại
  pageSize: number = 5; // Số lượng user hiển thị trên mỗi trang
  totalPages: number = 1; // Tổng số trang


  ngOnInit(): void {
    this.fetchUsers();
  }

  async fetchUsers() {
    // Gọi API hoặc service để lấy danh sách user từ backend
    // Đây là ví dụ giả lập dữ liệu
    await this.apiService.getUserById().subscribe((user: any) => {
      this.user = user;
      this.dataSource[0] = this.user;
      // Xử lý dữ liệu users ở đây nếu cần
    });

    // Tính toán số trang dựa trên tổng số user và số user trên mỗi trang
  }

  get displayedData(): any[] {
    return this.dataSource
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
    this.table.renderRows();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
    this.table.renderRows();
  }

  openDialog(action: any, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogInforBoxComponent, {
      width: '300px',
      data:obj
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        console.log(result.data)
        this.updateRowData(result.data);
      }
    });
  }

  updateRowData(row_obj: any){
    this.apiService.updateUser(Number(row_obj.id), row_obj).subscribe( 
      response => {
        
        this.dataSource = this.dataSource.filter((value: any,key: any)=>{
          if(value.id == row_obj.id){
            value.firstName = row_obj.firstName;
            value.lastName = row_obj.lastName;
            value.email = row_obj.email;
            value.role = row_obj.role;
            value.sex = row_obj.sex;
            value.projects = row_obj.projects;
            value.password = row_obj.password;
          }
          return true;
        });
      },
      (e) => {
        console.error(e.error.message)
      }
    )

  }
}