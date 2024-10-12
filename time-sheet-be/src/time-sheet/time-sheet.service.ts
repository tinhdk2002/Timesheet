import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTimeSheetDto } from './dto/create-time-sheet.dto';
import { UpdateTimeSheetDto } from './dto/update-time-sheet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeSheet } from './entities/time-sheet.entity';
import { Between, Repository } from 'typeorm';
import { ProjectService } from 'src/project/project.service';
import { StatusTS } from './ultis/status.enum';
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
      if (createTimeSheetDto.time > 0 && createTimeSheetDto.time <= 24)
        timesheet.time = createTimeSheetDto.time;
      else 
        throw new BadRequestException('Time must be greater than 0 and less than 24 hours')
      timesheet.tasks = tasks
      timesheet.note = createTimeSheetDto.note;
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

  async findAll() { 
    return await this.timesheetRepository.find(
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
  
    return await this.timesheetRepository.find({
      where: {
        date: Between(this.formatDate(startOfWeek), this.formatDate(endOfWeek)),
      }
    })
  }

  async findOne(id: number) {
    let timesheet =  await this.timesheetRepository.find(({
      relations:['tasks', 'projects'],
      where: {id: id}
    }))
    if (!timesheet) {
      throw new NotFoundException(`Not found timesheet #${id}`)
    }
    return timesheet
  }

  async findTimesheetByUser(userId: number) {
    return await this.timesheetRepository.find({
      relations:['projects','user','tasks'],
      where: {
        user: {id: userId}
      }
    })
  }
  
  async getTimeSheetPendingByManager(userId: number){
    const user: User = await this.userService.findUserById(+userId)
  
      const isManger =  user.role.includes(UserRole.PROJECT_MANAGER || UserRole.ADMIN) 
      if(isManger)
        return  this.findTimesheetByProject(userId)
      else if(user.role.includes(UserRole.ADMIN)){
        return  this.findTimesheetPending()
      }
  }

  async findTimesheetByProject(userId : number){
    const projects: any = await this.projectService.findProjectsByUserId(userId)
    let arrTimesheet = []
    let arrTimesheetPending = []
    for(let project of projects){
      arrTimesheet.push(...project.timesheets)
    }
    for(let ts of arrTimesheet)
      if(ts.status == 'pending')
        arrTimesheetPending.push(await this.findTimesheet(ts.id))
      return arrTimesheetPending
  }

  async findTimesheet(timesheetID: any){
    let timesheet =  await this.timesheetRepository.findOne({
      relations: ['projects', 'tasks','user'],
      where: {
        id: timesheetID
      }
    })
    if (!timesheet) {
      throw new NotFoundException(`Not found timesheet #${timesheetID}`);
    }
    return timesheet
  }


  async findTimesheetPending(){
    return await this.timesheetRepository.find({
      relations: ['projects', 'tasks','user'],
      where:{
        status: StatusTS.PENDING}
    })
  }

  async findTimesheetApproval(){
    return await this.timesheetRepository.find({
      relations: ['projects', 'tasks','user'],
      where:{
        status: StatusTS.APPROVE}
    })
  }

   async findTimesheetReject(){
    return await this.timesheetRepository.find({
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
    
    if(data.timesheets)
      for(let timesheet of data.timesheets)
        if(timesheet.status === StatusTS.PENDING)
        {
          timesheet.status = StatusTS.APPROVE
        }
    return await this.timesheetRepository.save(data.timesheets)
    }
    
  async rejectTimesheetByWeek(data){
    if(data.date) {
      data.date = data.date
    }
    else { 
      data.date = new Date() 
    }

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
    return await this.timesheetRepository.save(timesheet)
  }

  async remove(id: number) {
    let timesheet = await this.findOne(id)
    if(!timesheet) {
      throw new NotFoundException(`Not found timesheet ${id}`)
    }
    return await this.timesheetRepository.delete(id)
  }
}
