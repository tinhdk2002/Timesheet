import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { UserRole } from 'src/utils/user-role.enum';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('project')
@ApiTags('Project')
@ApiSecurity('JWT-auth')

export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(new RoleGuard([UserRole.ADMIN, UserRole.PROJECT_MANAGER]))
  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @UseGuards(new RoleGuard([UserRole.ADMIN, UserRole.PROJECT_MANAGER]))
  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(+id);
  }

  @Get('/client/:id')
  findByClient(@Param('id')id: string){
      return this.projectService.findProjectByClient(+id)
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }

  @Get('/projectByManager/:id')
  findProjectByManager(@Param('id') id:string) {
    return this.projectService.findProjectByManager(+id)
  }
}
