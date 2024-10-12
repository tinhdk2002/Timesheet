import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { DialogBoxPositionComponent} from './dialog-box/dialog-box-position.component';
import { BehaviorSubject } from 'rxjs';

export interface PositionData {
  id?: number,
  name: string;
  shortName: string;
  code: string;
}

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrl: './position.component.css'
})
export class PositionComponent implements OnInit {
  constructor(private apiService: ApiService, private dialog: MatDialog){}

  displayedColumns: string[] = ['name', 'shortName', 'code', 'action'];

  @ViewChild(MatTable, { static: true })
  table!: MatTable<any>;

  positions: PositionData[] = []; 
  
  dataSource = new BehaviorSubject<PositionData[]>([]);;
  
  currentPage: number = 1; 
  pageSize: number = 5; 
  totalPages: number = 1; 


  ngOnInit(): void {
    this.fetchPositions();
  }

  async fetchPositions() {
    await this.apiService.getAllPositions().subscribe((positions: PositionData[]) => {
      this.positions = positions;
      this.dataSource.next(this.positions)

    this.totalPages = Math.ceil(this.positions.length / this.pageSize);
    });

  }
  get totalPagesPosition():number {
    return Math.ceil(this.dataSource.value.length / this.pageSize)
  }
  get currentPagePosition():number {
    return this.currentPage > this.totalPagesPosition ? this.totalPagesPosition : this.currentPage
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
    const dialogRef = this.dialog.open(DialogBoxPositionComponent, {
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
    this.apiService.postPosition(row_obj)
      .subscribe((response: any) => {
        this.positions.push({
          id: response.id,
          name: row_obj.name,
          shortName: row_obj.shortName,
          code: row_obj.code
        });
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages;
        }

        this.totalPages = Math.ceil(this.positions.length / this.pageSize);
        this.dataSource.next(this.positions); 
        this.table.renderRows();
      },
      (error) => {
        console.error(error.error.message)
      }
      )
    
  }
  updateRowData(row_obj: any){
    this.apiService.updatePosition(Number(row_obj.id), row_obj).subscribe( 
      response => {
        this.positions = this.positions.map((position)=>{
          if(position.id == row_obj.id){
            return { ...position, ...response };
          }
          return true;
        });
        this.dataSource.next(this.positions);
        this.table.renderRows();
      },
      (e) => {
        console.error(e.error.message)
      }
    )
  }

  deleteRowData(row_obj: any){
    this.apiService.deletePosition(row_obj.id).subscribe(
      (response: any) => {
        this.positions = this.positions.filter(position => position.id !== row_obj.id)
        this.dataSource.next(this.positions);
        this.table.renderRows();
      },
      (e) => {
        console.error(e.error.message)
      }
    )
    this.table.renderRows()
  }

 
  
}
