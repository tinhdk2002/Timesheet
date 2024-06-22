import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { TimeSheetService } from './time-sheet.service';
import { CreateTimeSheetDto } from './dto/create-time-sheet.dto';
import { UpdateTimeSheetDto } from './dto/update-time-sheet.dto';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { UserRole } from 'src/utils/user-role.enum';
import { ApiProperty, ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('time-sheet')
@ApiTags('Timesheet')
@ApiSecurity('JWT-auth')
export class TimeSheetController {
  constructor(private readonly timeSheetService: TimeSheetService) {}

  @Post()
  create(@Body() createTimeSheetDto: CreateTimeSheetDto) {
    return this.timeSheetService.create(createTimeSheetDto);
  }

  @UseGuards(new RoleGuard([UserRole.ADMIN]))
  @Get()
  findAll() {
    return this.timeSheetService.findAll();
  }

  @Get('week')
  findTimesheetByWeek() {
    return this.timeSheetService.findTimesheetByWeek();
  }


  @Get('pending')
  @UseGuards(new RoleGuard([UserRole.PROJECT_MANAGER, UserRole.ADMIN]))
  findTimesheetPending() {
    return this.timeSheetService.findTimesheetPending()
  }

  @Get('approval')
  @UseGuards(new RoleGuard([UserRole.PROJECT_MANAGER, UserRole.ADMIN]))
  findTimesheetApproval() {
    return this.timeSheetService.findTimesheetApproval()
  }
  
  @Get('reject')
  @UseGuards(new RoleGuard([UserRole.PROJECT_MANAGER, UserRole.ADMIN]))
  findTimesheetReject() {
    return this.timeSheetService.findTimesheetReject()
  }

  @Get(':id')
  findTimesheetById(@Param('id') id: string){
    return this.timeSheetService.findOne(+id)
  }
 
  @Get('/user/:id')
  findTimesheetByUserId(@Param('id') id: string){
    return this.timeSheetService.findTimesheetByUser(+id);
  }

  @Put('submit')
  submitTimesheetByWeek(){
    return this.timeSheetService.submitTimesheetByWeek()
  }

  @UseGuards(new RoleGuard([UserRole.PROJECT_MANAGER, UserRole.ADMIN]))
  @Put('approval')
  approvalTimesheet(@Body() data:any){
    return this.timeSheetService.approvalTimesheetByWeek(data)
  }

  @UseGuards(new RoleGuard([UserRole.PROJECT_MANAGER, UserRole.ADMIN]))
  @Put('reject')
  rejectTimesheet(@Body() data:any){
    return this.timeSheetService.rejectTimesheetByWeek(data)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTimeSheetDto: UpdateTimeSheetDto) {
    return this.timeSheetService.update(+id, updateTimeSheetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timeSheetService.remove(+id);
  }

  @Get('/manager/:id')
  getTimeSheetPendingByManager(@Param('id') id: string){
    return this.timeSheetService.getTimeSheetPendingByManager(+id)
  }
}
