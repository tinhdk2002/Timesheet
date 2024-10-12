import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { UserRole } from 'src/utils/user-role.enum';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('task')
@ApiTags('Task')
@ApiSecurity('JWT-auth')

@UseGuards(new RoleGuard([UserRole.ADMIN, UserRole.PROJECT_MANAGER]))
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('')
  create(
    @Body() createTaskDto: CreateTaskDto
    ) {
    return this.taskService.create(createTaskDto, );
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get('/common')
  findTaskCommon(){
    return this.taskService.findAllTypeCommon()
  }

  @Get('/other')
  findTaskOther(){
    return this.taskService.findAllTypeOther()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }

  @Get('filter')
  filterTask(@Body() name: string){
    return this.taskService.filterTask(name)
  }
}
