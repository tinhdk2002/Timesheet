import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { DialogBoxBranchComponent} from './dialog-box/dialog-box-branch.component';

export interface BranchData {
  id?: number,
  name: string;
  displayName: string;
  code: string;
}

@Component({
  selector: 'app-branchs',
  templateUrl: './branchs.component.html',
  styleUrl: './branchs.component.css'
})
export class BranchsComponent implements OnInit {
  constructor(private apiService: ApiService, private dialog: MatDialog){}

  displayedColumns: string[] = ['name', 'displayName', 'code', 'action'];

  @ViewChild(MatTable, { static: true })
  table!: MatTable<any>;

  branchs: BranchData[] = []; 
  dataSource = this.branchs;
  
  currentPage: number = 1; 
  pageSize: number = 5; 
  totalPages: number = 1; 


  ngOnInit(): void {
    this.fetchUsers();
  }

  async fetchUsers() {
    await this.apiService.getAllBranchs().subscribe((branchs: BranchData[]) => {
      this.branchs = branchs;
      this.dataSource = this.branchs

    this.totalPages = Math.ceil(this.dataSource.length / this.pageSize);
    });

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
    const dialogRef = this.dialog.open(DialogBoxBranchComponent, {
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
    
    this.apiService.postBranch(row_obj)
      .subscribe((response: any) => {
        this.dataSource.push({
          id: response.id,
          name: row_obj.name,
          displayName: row_obj.displayName,
          code: row_obj.code
        });
          
      },
      (error) => {
        console.error(error.error.message)
      }
      )
      this.table.renderRows();
    
  }
  updateRowData(row_obj: any){
    this.apiService.updateBranch(Number(row_obj.id), row_obj).subscribe( 
      response => {
        this.dataSource = this.dataSource.filter((value: any, key: any)=>{
          if(value.id == row_obj.id){
            value.name = row_obj.name;
            value.displayName = row_obj.displayName;
            value.code = row_obj.code;
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
    this.apiService.deleteBranch(row_obj.id).subscribe(
      (response: any) => {
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
