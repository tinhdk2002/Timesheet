import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { first } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogManageTimesheetComponent } from './dialog-manage-timesheet/dialog-manage-timesheet.component';

@Component({
  selector: 'app-manage-timesheet',
  templateUrl: './manage-timesheet.component.html',
  styleUrl: './manage-timesheet.component.css'
})
export class ManageTimesheetComponent {
  dateStart:any;
  dateEnd:any;

  data: any;
  firstDayOfWeek!: Date;
  lastDayOfWeek!: Date;
  firstDayOfMonth!: Date;
  lastDayOfMonth!: Date;
  firstDayOfYear!: Date;
  lastDayOfYear!: Date;

  dataProject: any = [];
  dataSource: any ;
  allCompleteUser: boolean = false;
  allComplete: boolean = false;
  dataLoad: any = [];

  expanded: boolean = false;
  user: any;
  statusSelect: any = 'pending';
  typeSelect:any = 'all';
  showByCanlendar:any = 'month';
  selectProject: any = 'all';


  constructor(private apiService: ApiService,  private dialog: MatDialog){
    this.createDataProjectPending()
    this.dataSource = this.dataProject

  }

   createDataProjectPending(){
     this.apiService.getTimesheetPendingByRole().subscribe((timesheet: any)=> {
        this.data = timesheet;
        this.data.sort((a: any,b: any) => {
          return a.projects.id - b.projects.id
        })
      const projectSet: Set<any> = new Set();
      const userSet: Set<any> = new Set();
      //Create dataProject:
      for(const item of this.data)
        if(!projectSet.has(item.projects.id))
        {
          item.projects.completed = false;
          this.dataProject.push(item.projects)
          projectSet.add(item.projects.id);
        }
        //Add user to dataProject
        for(let project of this.dataProject)
        {
          var userArray = [];
          for(let item of this.data)
          {
            if(item.projects.id == project.id && !userSet.has(item.user.id))
            {
              item.user.completed = false;
              userArray.push(item.user);
              userSet.add(item.user.id);
              project.user = userArray;
            }

          }
          userSet.clear()
        }

        for(let project of this.dataProject){
          var totalTimeProject = 0; 
          for(let user of project.user){
           var timesheetArray = []
           var totalTime = 0
            for(let timesheet of this.data)
            {
              if(user.id == timesheet.user.id && timesheet.projects.id == project.id){
                timesheet.completed = false;
                timesheetArray.push(timesheet)
                user.timesheet = timesheetArray
                totalTime += timesheet.time
                user.totalTime = totalTime
              }
            }
            totalTimeProject += user.totalTime;
            project.totalTime = totalTimeProject
          }
        }

    }) 
  }

  updateDataSource(){
  if(this.data.length === 0)
    {
      this.dataProject = [];
      this.dataSource = [];
    }
  else{
    
  const projectSet: Set<any> = new Set();
  const userSet: Set<any> = new Set();
  for(const item of this.data)
    if(!projectSet.has(item.projects.id))
    {
      item.projects.completed = false;
      this.dataProject.push(item.projects)
      projectSet.add(item.projects.id);
    }
    for(let project of this.dataProject)
    {
      var userArray = [];
      for(let item of this.data)
      {
        if(item.projects.id == project.id && !userSet.has(item.user.id))
        {
          item.user.completed = false;
          userArray.push(item.user);
          userSet.add(item.user.id);
          project.user = userArray;
        }
      }
      userSet.clear()
    }

    for(let project of this.dataProject){
      var totalTimeProject = 0; 
      for(let user of project.user){
       var timesheetArray = []
       var totalTime = 0
        for(let timesheet of this.data)
        {
          if(user.id == timesheet.user.id && timesheet.projects.id == project.id){
            timesheet.completed = false;
            timesheetArray.push(timesheet)
            user.timesheet = timesheetArray
            totalTime += timesheet.time
            user.totalTime = totalTime
          }
        }
        totalTimeProject += user.totalTime;
        project.totalTime = totalTimeProject
      }
    }  
   }
  }

  

  showUsersData(project: any): void{
    project.showUsersData = !project.showUsersData;
  }

  showUserTimesheet(user: any): void{
    user.showTimesheet = !user.showTimesheet;
  }

  showTimesheet(timesheet: any):void {
    timesheet.showData = !timesheet.showData 
  }

  updateAllComplete(user: any, project:any) {
    user.completed = user.timesheet != null && user.timesheet.every((t:any) => t.completed);
    this.updateAllCompleteUser(project);
  }

  someCompleteUser(user:any): boolean {
    if (user.timesheet == null) {
      return false;
    }
    return user.timesheet.filter((t:any) => t.completed).length > 0 && !user.completed;
  }

  setAllUser(e :any, user:any) {
    this.allCompleteUser = e;
      if(user.timesheet == null)
        return;
      user.timesheet.forEach((t:any)=> {t.completed = e} )
  }
  

  updateAllCompleteUser(project: any) {
    project.completed = project.user != null && project.user.every((t:any) => t.completed);
    this.setAllUser(project.completed, project.user)
  }

  someComplete(project:any): boolean {
    if (project.user == null) {
      return false;
    }
    this.someCompleteUser(project.user)
    return project.user.filter((t:any) => t.completed).length > 0 && ! project.completed;
  }

  setAll(completed :any, project:any) {
    project.completed = completed;
      if(project.user == null)
        return;
      
      project.user.forEach((t:any)=> {
        t.completed = completed
        this.setAllUser(completed, t)
      } )
  }

  changeSelectProject(){
    if(this.selectProject == 'all')
      this.dataSource = this.dataProject
    else {
      this.dataSource = [this.selectProject]
    }
  }

  dateFomatYYYYMMDD(date: any): any {
    var today = new Date(date);
    var day: any = today.getDate();
    var month:any = today.getMonth()+1;
    var year:any = today.getFullYear();
    if(day < 10)
      day = '0'+day;
    if(month < 10)
      month = '0'+month; 
    return year+'-'+month+'-'+day; 
  }

  openDialog(action: any, obj: any) {
    const timesheet = obj.filter((timesheet: any) => timesheet.completed)
    obj = {}
    obj.timesheets = timesheet
    obj.action = action;
    const dialogRef = this.dialog.open(DialogManageTimesheetComponent, {
      width: '400px',
      data:obj
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Approval'){
        this.approvalData(result.data);
      }
      if(result.event == 'Reject'){
        this.rejectData(result.data);
      }
    });
  }

  approvalData(data: any) {
    this.apiService.approvalTimesheet(data).subscribe(response => {
      for(let timesheet of data.timesheets){
        this.data = this.data.filter((value: any,key:any)=>{
          return value.id != timesheet.id;
        });
      }
      this.dataSource = [];
      this.dataProject = [];
      this.updateDataSource()
      this.dataSource = this.dataProject
    },
    (err) => {
      console.error(err.error)
    }
    )
  }

  rejectData(data: any) {
    this.apiService.rejectTimesheetLastWeek(data).subscribe(response => 
      {
        for(let timesheet of data.timesheets){
          this.data = this.data.filter((value: any,key:any)=>{
            return value.id != timesheet.id;
          });
        }
        this.dataSource = [];
        this.dataProject = [];
        this.updateDataSource()
        this.dataSource = this.dataProject
      }
      )
  }
}

