import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { DialogBoxTaskComponent } from './dialog-box-task/dialog-box-task.component';



export interface TasksData {
  id?: number,
  name: string;
  archive: string;
  type: string; 
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {
  constructor(private apiService: ApiService, private dialog: MatDialog){}

  displayedColumns: string[] = ['name', 'action'];

  @ViewChild('table1', { static: true }) table1!: MatTable<any>;
  @ViewChild('table2', { static: true }) table2!: MatTable<any>;

  dataSourceCommon:  any;
  dataSourceOther:  any;
  tasks: TasksData[] = []; // Dữ liệu danh sách user
  totalCommon:number =0;
  totalOther:number =0;

  ngOnInit(): void {
    this.fetchTasks();
   
  }

   fetchTasks() {
     this.apiService.getAllTasks().subscribe((tasks: any) => {
      this.tasks = tasks;

    });
     this.apiService.getAllTasksCommon().subscribe((tasks: any) => {
      this.dataSourceCommon = tasks
      this.totalCommon = this.dataSourceCommon.length
    })
    this.apiService.getAllTasksOther().subscribe((tasks: any) => {
      this.dataSourceOther = tasks;
      this.totalOther = this.dataSourceOther.length;

    })
  }


  openDialog(action: any, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxTaskComponent, {
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
      }else if(result.event == 'Archive' || result.event == 'Unarchive'){
        this.archiveRowData(result.data);
      }
    });
  }

  addRowData(row_obj: any){
    this.apiService.postTask(row_obj)
      .subscribe(response => {
        if(row_obj.type == 'common')
        this.dataSourceCommon.push({
          id: response.id,
          name: row_obj.name,
          type: row_obj.type,
          });
        else {
          this.dataSourceOther.push({
            id: response.id,
            name: row_obj.name,
            type: row_obj.type,
          })
        }
        this.table1.renderRows()
        this.table2.renderRows()
        this.fetchTasks()
      },
      (err) => console.error(err.error)
      )
  }

  updateRowData(row_obj: any){
    if(row_obj.type == 'common'){
      this.apiService.updateTask(Number(row_obj.id), row_obj).subscribe( 
        response => {
;
          this.dataSourceCommon = this.dataSourceCommon.filter((value: any ,key: any)=>{
            if(value.id == row_obj.id){
              value.name = row_obj.name;
              value.type = row_obj.type;
              
            }
            return true;
          });
        })
      
    }
    else {
      this.apiService.updateTask(Number(row_obj.id), row_obj).subscribe( 
        response => {
;
          this.dataSourceOther = this.dataSourceOther.filter((value: any ,key: any)=>{
            if(value.id == row_obj.id){
              value.name = row_obj.name;
              value.type = row_obj.type;
            }
            return true;
          });
          this.table1.renderRows()
          this.table2.renderRows()   
        },
        (err) => {
          console.error(err.error)
        }
      )
    }
  }

  archiveRowData(row_obj: any){
    this.apiService.updateTask(Number(row_obj.id), row_obj).subscribe( 
      response => {
        this.dataSourceCommon = this.dataSourceCommon.filter((value: any ,key: any)=>{
          if(value.id == row_obj.id){
            value.name = row_obj.name;
            value.type = row_obj.type;
            value.archive = row_obj.archive;
          }
          this.table1.renderRows();
          this.table2.renderRows();
          return true;
        });
      },
      (err) => {
        console.error(err.error)
      }
    )
   
    
  }


  deleteRowData(row_obj: any){
    
    this.apiService.deleteTask(row_obj.id).subscribe(
      response => {
        if(row_obj.type == 'common'){
          this.dataSourceCommon = this.dataSourceCommon.filter((value: any,key: any)=>{
            return value.id != row_obj.id;
          });
        }
        else {
          this.dataSourceOther = this.dataSourceOther.filter((value: any,key: any)=>{
            return value.id != row_obj.id;
          });
        }
        this.table1.renderRows()
        this.table2.renderRows()
        this.fetchTasks()
      },
      (error) => {
        console.error(error)
      }
    )
    
  }

  
}

