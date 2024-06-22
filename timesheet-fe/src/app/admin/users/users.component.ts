import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';

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
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  constructor(private apiService: ApiService, private dialog: MatDialog){}

  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'role', 'sex', 'projects', 'action'];

  @ViewChild(MatTable, { static: true })
  table!: MatTable<any>;

  users: UsersData[] = []; // Dữ liệu danh sách user
  dataSource = this.users;
  
  currentPage: number = 1; // Trang hiện tại
  pageSize: number = 5; // Số lượng user hiển thị trên mỗi trang
  totalPages: number = 1; // Tổng số trang


  ngOnInit(): void {
    this.fetchUsers();
  }

  async fetchUsers() {
    // Gọi API hoặc service để lấy danh sách user từ backend
    // Đây là ví dụ giả lập dữ liệu
    await this.apiService.getAllUsers().subscribe((users: any) => {
      this.users = users;
      this.dataSource = this.users

    this.totalPages = Math.ceil(this.dataSource.length / this.pageSize);
      // Xử lý dữ liệu users ở đây nếu cần
    });

    // Tính toán số trang dựa trên tổng số user và số user trên mỗi trang
  }
  get totalPagesUsers():number {
    return Math.ceil(this.dataSource.length / this.pageSize)
  }

  get displayedData(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.dataSource.slice(startIndex, endIndex);
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
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '300px',
      data:obj
    });
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
    
    this.apiService.postUser(row_obj)
      .subscribe((response: any) => {
        this.dataSource.push({
          id: response.id,
          firstName: row_obj.firstName,
          lastName: row_obj.lastName,
          email: row_obj.email,
          role: row_obj.role,
          sex: row_obj.sex,
          projects: row_obj.projects
        });
          
      },
      (error) => {
        console.error(error.error.message)
      }
      )
      this.table.renderRows();
    
  }
  updateRowData(row_obj: any){
    this.apiService.updateUser(Number(row_obj.id), row_obj).subscribe( 
      response => {
        console.log(response)
        this.dataSource = this.dataSource.filter((value: any,key: any)=>{
          if(value.id == row_obj.id){
            value.firstName = row_obj.firstName;
            value.lastName = row_obj.lastName;
            value.email = row_obj.email;
            value.role = row_obj.role;
            value.sex = row_obj.sex;
            value.projects = row_obj.projects;
          }
          return true;
        });
      },
      (e) => {
        console.error(e.error.message)
      }
    )
    this.table.renderRows()

  }


  deleteRowData(row_obj: any){
    this.apiService.deleteUser(row_obj.id).subscribe(
      (response: any) => {
        console.log(response)
        this.dataSource = this.dataSource.filter((value,key)=>{
          return value.id != row_obj.id;
        });
      },
      (e) => {
        console.error(e.error.message)
      }
    )
    this.table.renderRows()

  }

 
  
}
