import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTimeSheetDto } from './dto/create-time-sheet.dto';
import { UpdateTimeSheetDto } from './dto/update-time-sheet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/project/entities/project.entity';
import { TimeSheet } from './entities/time-sheet.entity';
import { Between, Not, Repository } from 'typeorm';
import { ProjectService } from 'src/project/project.service';
import { TaskService } from 'src/task/task.service';
import { time } from 'console';
import { StatusTS } from './ultis/status.enum';
import e from 'express';
import { NotContains } from 'class-validator';
import { NotFoundError } from 'rxjs';
import { start } from 'repl';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { UserRole } from 'src/utils/user-role.enum';

@Injectable()
export class TimeSheetService {
  constructor(
    @InjectRepository(TimeSheet)
    private timesheetRepository: Repository<TimeSheet>,
    private projectService: ProjectService,
    private userService: UserService,
  ){}

  async create(createTimeSheetDto: CreateTimeSheetDto) {
    let timesheet = new TimeSheet();
   
    let isTaskOfProject = false;
    var projects
    var tasks
    projects = (await this.projectService.findOne(createTimeSheetDto.projects.id))

    timesheet.projects = projects
        
 
    for(let task of timesheet.projects.tasks){
      if(createTimeSheetDto.tasks.id === task.id)
        {
          isTaskOfProject = true
          tasks =task
        }
    }
    if(isTaskOfProject)
    {
      timesheet.tasks = tasks
      timesheet.note = createTimeSheetDto.note;
      timesheet.time = createTimeSheetDto.time;
      timesheet.type = createTimeSheetDto.type;
      timesheet.user = createTimeSheetDto.user;

      if(timesheet.projects.endAt < createTimeSheetDto.date) 
        throw new BadRequestException(`Over time of project (end: ${timesheet.projects.endAt}) `)
      if(timesheet.projects.startAt > createTimeSheetDto.date)
        throw new BadRequestException(`start: ${timesheet.projects.startAt}`)
      timesheet.date = createTimeSheetDto.date;
      console.log(timesheet)
      return this.timesheetRepository.save(timesheet);
    } 
    throw new BadRequestException();

  }

  findAll() { 
    return this.timesheetRepository.find(
      {
        relations:['tasks', 'projects','user'],
      }
    );
  }

  formatDate (date){
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return new Date(year, month-1, day);
  };

  async findTimesheetByWeek(date = new Date()) {    
    const currentDate = date;
    const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1)));
    const endOfWeek = new Date(currentDate.setDate(startOfWeek.getDate() + 6));
    
    console.log(startOfWeek)
    console.log(endOfWeek)

    return await this.timesheetRepository.find({
      where: {
        date: Between(this.formatDate(startOfWeek), this.formatDate(endOfWeek)),
        
      }
    })
  }

  findOne(id: number) {
    return this.timesheetRepository.find(({
      relations:['tasks', 'projects'],
      where: {id: id}
    }))
  }

  findTimesheetByUser(userId: number) {
    return this.timesheetRepository.find({
      relations:['projects','user','tasks'],
      where: {
        user: {id: userId}
      }
    })
  }
  
  async getTimeSheetPendingByManager(userId: number){
    const user: User = await this.userService.findUserById(+userId)
  
      const isManger =  user.role.includes(UserRole.PROJECT_MANAGER) 
      if(isManger)
        return  this.findTimesheetByProject(userId)
      else if(user.role.includes(UserRole.ADMIN)){
        return  this.findTimesheetPending()
      }
  }

  async findTimesheetByProject(userId : number){
    const projects: any = await this.projectService.findProjectByUserId(userId)
    let arrTimesheet = []
    let arrTimesheetPending = []
    for(let project of projects){
      arrTimesheet.push(...project.timesheets)
    }
    for(let ts of arrTimesheet)
      if(ts.status == 'pending')
        arrTimesheetPending.push(await this.findTimesheet(ts))
      return arrTimesheetPending
  }

  findTimesheet(timesheet: any){
    return this.timesheetRepository.findOne({
      relations: ['projects', 'tasks','user'],
      where: {
        id: timesheet.id
      }
    })
  }


  findTimesheetPending(){
    return this.timesheetRepository.find({
      relations: ['projects', 'tasks','user'],
      where:{
        status: StatusTS.PENDING}
    })
  }

  findTimesheetApproval(){
    return this.timesheetRepository.find({
      relations: ['projects', 'tasks','user'],
      where:{
        status: StatusTS.APPROVE}
    })
  }

  findTimesheetReject(){
    return this.timesheetRepository.find({
      relations: ['projects', 'tasks','user'],
      where:{
        status: StatusTS.REJECT}
    })
  }

  async submitTimesheetByWeek(){
    const timeSheetInWeek = await this.findTimesheetByWeek()   
    for(const timesheet of timeSheetInWeek)
     if(timesheet.status === StatusTS.NEW)
      timesheet.status = StatusTS.PENDING

    return await this.timesheetRepository.save(timeSheetInWeek)
    }


  async approvalTimesheetByWeek(data){
    if(data.date)
      data.date = data.date
    else  data.date = new Date();
    const currentDate = new Date(data.date);
    const lastWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
    const timeSheetInWeek = await this.findTimesheetByWeek(lastWeek)   
    
    if(data.timesheets)
      for(let timesheet of data.timesheets)
        if(timesheet.status === StatusTS.PENDING)
        {
          timesheet.status = StatusTS.APPROVE
        }
    // for(const timesheet of timeSheetInWeek)
    //   if(timesheet.status === StatusTS.PENDING)
    //     {
    //       timesheet.status = StatusTS.APPROVE
    //     }
    return await this.timesheetRepository.save(data.timesheets)
    }
    
  async rejectTimesheetByWeek(data){
    if(data.date)
      data.date = data.date
    else data.date = new Date()
    const currentDate = new Date(data.date);
    const lastWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
    const timeSheetInWeek = await this.findTimesheetByWeek(lastWeek)   
    if(data.timesheets)
      for(let timesheet of data.timesheets)
        if(timesheet.status === StatusTS.PENDING)
          timesheet.status = StatusTS.REJECT
    return await this.timesheetRepository.save(data.timesheets)
    }

   async update(id: number, updateTimeSheetDto: UpdateTimeSheetDto) {
    const timesheet = await this.timesheetRepository.findOne({ where: { id: id}})
    if (!timesheet)
      throw new NotFoundException('Not found timesheet')
    if(updateTimeSheetDto.note)
      timesheet.note = updateTimeSheetDto.note; 
    if(updateTimeSheetDto.type)
      timesheet.type = updateTimeSheetDto.type;
    if(updateTimeSheetDto.projects)
      timesheet.projects = updateTimeSheetDto.projects;
    if(updateTimeSheetDto.tasks)
      timesheet.tasks = updateTimeSheetDto.tasks;
    if(updateTimeSheetDto.time)
      timesheet.time = updateTimeSheetDto.time;
    if(updateTimeSheetDto.user)
      timesheet.user = updateTimeSheetDto.user;


    this.timesheetRepository.save(timesheet)
    return { success: true, message: 'Update successful' };
  }

  remove(id: number) {
    this.timesheetRepository.delete(id)
    return { success: true, message: 'Delete successful' };
  }
}
