import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerIntl } from '@angular/material/datepicker';
import { ApiService } from '../api.service';
import { MatDialog } from '@angular/material/dialog';
import { DiaglogTimesheetComponent } from './diaglog-timesheet/diaglog-timesheet.component';

export interface TimesheetData {
  id?: string;
  note: string;
  time: number;
  type: string;
  date: string;
  tasks: any;
  status?: any;
  projects: any;
  user: any;
}

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrl: './timesheet.component.css'
})
export class TimesheetComponent implements OnInit {
  selectedDate: Date = new Date(); 
  selectedTab: any;
  dateFormControl = new FormControl(this.selectedDate);
  currentTime:any = this.dateFomatMMDYYYY(new Date());
  dataSource: any[] = [
    {
      "id": 103,
      "note": "Create API",
      "time": 8,
      "type": "Normal working time",
      "date": "2024-03-04",
      "status": "new",
      "tasks": {
        "id": 1,
        "name": "Kaiser",
        "type": "common",
        "archive": true
      },
      "projects": {
        "id": 22,
        "name": "test",
        "code": "abcdef",
        "startAt": "2024-02-27",
        "endAt": "2024-03-04"
      },
      "user": {
        
      }
    },
      {
        "id": 104,
        "note": "Create API",
        "time": 8,
        "type": "Normal working time",
        "date": "2024-03-03",
        "status": "new",
        "tasks": {
          "id": 1,
          "name": "Kaiser",
          "type": "common",
          "archive": true
        },
        "projects": {
          "id": 22,
          "name": "test",
          "code": "abcdef",
          "startAt": "2024-02-27",
          "endAt": "2024-03-04"
        }
      },
      {
        "id": 105,
        "note": "Create API",
        "time": 8,
        "type": "Normal working time",
        "date": "2024-03-04",
        "status": "new",
        "tasks": {
          "id": 1,
          "name": "Kaiser",
          "type": "common",
          "archive": true
        },
        "projects": {
          "id": 22,
          "name": "test",
          "code": "abcdef",
          "startAt": "2024-02-27",
          "endAt": "2024-03-04"
        },
      },
      
  ]

  daysOfWeek: string[] = [ 'Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


  startDate = new Date();
  
  constructor(
    private apiService: ApiService,
    private dialog: MatDialog
    
    ) {
    this.updateSelectedDate();
  } 


  ngOnInit(): void {
    this.getDataSource();
  }
  getDataSource(){
    this.apiService.getTimesheetByUser().subscribe((timesheets : any ) => {
      this.dataSource = timesheets
    })
  }


  updateSelectedDate() {
    const dayIndex = this.selectedDate.getDay();
      this.selectedTab = dayIndex;
  }

  dateFomatMMDYYYY(date: any): any {
    var today = new Date(date);
    var day: any = today.getDate();
    var month:any = today.getMonth()+1;
    var year:any = today.getFullYear();
    if(day < 10)
      day = '0'+day;
    if(month < 10)
      month = '0'+month; 
    return month+'/'+day+'/'+year; 
  }

  
  showDatePicker() {
      this.currentTime = this.dateFomatMMDYYYY(this.selectedDate);
      this.dateFormControl.setValue(this.selectedDate);
      this.updateSelectedDate();

    }

  showToday(){
    this.selectedDate = new Date(); 
    this.showDatePicker()
  }

  tabChanged(event: any) {
    const selectedTabIndex = event; 
    const today = new Date(this.currentTime);
    const newDate = new Date(today);


    if (selectedTabIndex === 0) {
      newDate.setDate(today.getDate() - today.getDay())
      this.selectedDate = newDate;
    } else {
      // Nếu không phải tab cuối cùng, selectedDate sẽ là ngày trong tuần tương ứng với tab được chọn
      const diff = today.getDay() - selectedTabIndex;
      newDate.setDate(today.getDate() - diff);
      this.selectedDate = newDate;
    }

    this.dateFormControl.setValue(this.selectedDate);
    this.showDatePicker()
  }

  prevDate() {
    if(this.selectedTab != 0){
      const today = this.selectedDate.getDate() - 1
      this.selectedDate.setDate(today);
      this.updateSelectedDate(); 
    }
  }

  nextDate() {
    if(this.selectedTab != 6){
      const today = this.selectedDate.getDate() +1
      this.selectedDate.setDate(today);
      this.updateSelectedDate(); 
    }
  }

  upperCaseFirstLetter(text: any){
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  openDialog(action: any, obj: any) {
    obj.action = action;
    let dialogRef = this.dialog.open(DiaglogTimesheetComponent, {
        width: '400px',
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
    this.apiService.postTimesheet(row_obj).subscribe((response:any) => {
        this.dataSource.push({
          note: row_obj.note,
          time: row_obj.time,
          type: row_obj.type,
          date: this.dateFomatMMDYYYY(row_obj.date),
          tasks: row_obj.tasks,
          status: 'new',
          projects: row_obj.projects,
          id: response.id
        });
      },
      (err) => {
        console.error(err.error)
      }
      )
    
  }
  updateRowData(row_obj: any){
    this.apiService.updateTimesheet(Number(row_obj.id), row_obj).subscribe( 
      response => {

        this.dataSource = this.dataSource.filter((value,key)=>{
          if(value.id == row_obj.id){
            value.note = row_obj.note;
            value.time = row_obj.time;
            value.type = row_obj.type;
            value.date = this.dateFomatMMDYYYY(row_obj.date);
            value.status = row_obj.status;
            value.tasks = row_obj.tasks;
            value.projects = row_obj.projects;
            
          }
          return true;
        });
      },
      (err) => {
        console.error(err.error)
      }
    )
    
  }
  deleteRowData(row_obj: any){
    this.apiService.deleteTimesheet(row_obj.id).subscribe(
      response => {

        this.dataSource = this.dataSource.filter((value,key)=>{
          return value.id != row_obj.id;
        });
      },
      (err) => {
        console.error(err.error)
      }
    )
    
    
  }

  submitTimesheet() {
    this.apiService.submitTimesheetWeek().subscribe(response => {
      this.getDataSource()
    },
    (err) => {
      console.error(err.error)
    }
    )
  }
}
