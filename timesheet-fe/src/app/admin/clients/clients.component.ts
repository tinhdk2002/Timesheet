import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { DialogBoxClientComponent } from './dialog-box-client/dialog-box-client.component';


export interface ClientsData {
  id?: number,
  name: string;
  code: string;
  address: string;
}

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit {
  constructor(private apiService: ApiService, private dialog: MatDialog){}

  displayedColumns: string[] = ['name', 'code', 'address', 'action'];

  @ViewChild(MatTable, { static: true })
  table!: MatTable<any>;

  clients: ClientsData[] = []; // Dữ liệu danh sách user
  dataSource = this.clients;
  
  currentPage: number = 1; // Trang hiện tại
  pageSize: number = 10; // Số lượng user hiển thị trên mỗi trang
  totalPages: number = 1; // Tổng số trang


  ngOnInit(): void {
    this.fetchClients();
  }

  async fetchClients() {
    await this.apiService.getAllClients().subscribe((clients: any) => {
      this.clients = clients;
      this.dataSource = this.clients
    this.totalPages = Math.ceil(this.dataSource.length / this.pageSize);

    });

  }
  get totalPagesClient():number {
    return Math.ceil(this.dataSource.length / this.pageSize)
  }
  get currentPageClient():number {
    return this.currentPage > this.totalPagesClient ? this.totalPagesClient : this.currentPage
  }

  get displayedData(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.dataSource.slice(startIndex, endIndex);
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
    const dialogRef = this.dialog.open(DialogBoxClientComponent, {
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
    this.apiService.postClient(row_obj)
      .subscribe(response => {
        this.dataSource.push({
          id: response.id,
          name: row_obj.name,
          code: row_obj.code,
          address: row_obj.address,
        });

      },
      (err)=> {
        console.error(err.error)
      }
      )

      this.table.renderRows();
    
    
  }
  updateRowData(row_obj: any){
    this.apiService.updateClient(Number(row_obj.id), row_obj).subscribe( 
      response => {
        this.dataSource = this.dataSource.filter((value,key)=>{
          if(value.id == row_obj.id){
            value.name = row_obj.name;
            value.code = row_obj.code;
            value.address = row_obj.address;
          }
          return true;
        });
      },
      (err)=> {
        console.error(err.error)
      }
    )
    this.table.renderRows()
  }
  deleteRowData(row_obj: any){
    this.apiService.deleteClient(row_obj.id).subscribe(
      response => {
        this.dataSource = this.dataSource.filter((value,key)=>{
          return value.id != row_obj.id;
        });
        
      },
      (err) => {
        console.error(err.error)
      }
    )
    this.table.renderRows()
    
  }

 
  
}
