import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import { PositionData } from '../position/postion.component';
import { BranchData } from '../branch/branchs.component';
import { BehaviorSubject } from 'rxjs';

export interface UsersData {
  id?: number,
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  sex: string;
  password?: string;
  projects: any;
  position: any;
  branch: any;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  constructor(private apiService: ApiService, private dialog: MatDialog){}

  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'role', 'sex', 'position', 'branch', 'projects', 'action'];

  @ViewChild(MatTable, { static: true })
  table!: MatTable<any>;

  users: UsersData[] = []; 
  dataSource = new BehaviorSubject<UsersData[]>([]);
  
  currentPage: number = 1;
  pageSize: number = 5; 
  totalPages: number = 1; 


  ngOnInit(): void {
    this.fetchUsers();
  }

  async fetchUsers() {
    await this.apiService.getAllUsers().subscribe((users: any) => {
      this.users = users;
      this.dataSource.next(this.users);
      this.totalPages = Math.ceil(this.users.length / this.pageSize);
    });
  }
  get totalPagesUsers():number {
    return Math.ceil(this.dataSource.value.length / this.pageSize)
  }
  get currentPageUser():number {
    return this.currentPage > this.totalPagesUsers ? this.totalPagesUsers : this.currentPage
  }

  get displayedData(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.dataSource.value.slice(startIndex, endIndex);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    } else (this.currentPage = 1)
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
        this.users.push({
          id: response.id,
          firstName: row_obj.firstName,
          lastName: row_obj.lastName,
          email: row_obj.email,
          role: row_obj.role,
          sex: row_obj.sex,
          projects: row_obj.projects,
          branch: response.branch,
          position: response.position
        });
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages;
        }

        this.totalPages = Math.ceil(this.users.length / this.pageSize);
        this.dataSource.next(this.users); 
        this.table.renderRows();
      },
      (error) => {
        console.error(error.error.message)
      }
      )
  }
  updateRowData(row_obj: any){
    this.apiService.updateUser(Number(row_obj.id), row_obj).subscribe( 
      response => {
        this.users = this.users.map((user) => {
          if (user.id === row_obj.id) {
            return { ...user, ...row_obj };
          }
          return user;
        });
        this.dataSource.next(this.users);
        this.table.renderRows();
      },
      (e) => {
        console.error(e.error.message)
      }
    )
  }


  deleteRowData(row_obj: any){
    this.apiService.deleteUser(row_obj.id).subscribe(
      (response: any) => {
        this.users = this.users.filter(user => user.id !== row_obj.id);
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages;
        }
        this.totalPages = Math.ceil(this.users.length / this.pageSize);
        this.dataSource.next(this.users);
        this.table.renderRows();
      },
      (e) => {
        console.error(e.error.message)
      }
    )

    this.table.renderRows()

  }

 
  
}
