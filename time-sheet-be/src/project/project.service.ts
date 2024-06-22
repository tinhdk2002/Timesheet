import { All, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { In, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { emit } from 'process';
import { ClientService } from 'src/client/client.service';
import { TaskService } from 'src/task/task.service';
import { NotFoundError } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from 'src/utils/user-role.enum';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private userService: UserService,
    private clientService: ClientService,
    private taskService: TaskService,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    let project = new Project();
    if(!createProjectDto.client || !createProjectDto.code || !createProjectDto.name || !createProjectDto.startAt || !createProjectDto.endAt || !createProjectDto.tasks || !createProjectDto.users)
      throw new BadRequestException()
    project.client = await this.clientService.findOne(createProjectDto.client.id);
    project.name = createProjectDto.name;
    project.code = createProjectDto.code;
    project.startAt = createProjectDto.startAt;
    project.endAt = createProjectDto.endAt;
    const users = [];
    for(const userData of createProjectDto.users) {
      const user =  (await this.userService.findUserById(userData.id))
    if (user)
      {
        users.push(user)
      }
    } 
    project.users = users
    const tasks = [];
    for(const taskData of createProjectDto.tasks) {
     const task =  (await this.taskService.findOne(taskData.id))
     if (task)
      {
        tasks.push(task)
      }
    }
    project.tasks = tasks
    
    return this.projectRepository.save(project);
  }

  async findProjectByClient(clientId: number) {
    return await this.projectRepository.find({
      where: {
        client: {id: clientId}
      }
    })
  }

  async findProjectByManager(userId: number) {
    const user: User = await this.userService.findUserById(+userId)
  
      const isManger =  user.role.includes(UserRole.PROJECT_MANAGER) 
      if(isManger)
        return this.findProjectByUserId(userId)
      else if(user.role.includes(UserRole.ADMIN)){
        return this.projectRepository.createQueryBuilder('project')
        .leftJoinAndSelect('project.client', 'client')
        .leftJoinAndSelect('project.users', 'user')
        .leftJoinAndSelect('project.tasks', 'task')
        .leftJoinAndSelect('project.timesheets', 'time_sheet')
        .getMany()
      }
  }

  async findAll() {
    return await this.projectRepository.find({
      relations:["tasks","users","client","timesheets"]
    });
  }

 async findProjectByUserId(userId: number){
    const user: User = await this.userService.findUserById(userId)
    let arrProject = []
    for(let project of user.projects){
      arrProject.push(await this.findProject(project)) 
    }
   return (arrProject)
  }

  async findProject(user: any){
    return await this.projectRepository.findOne({
      relations: ["tasks","users","client","timesheets"],
      where: {
        id: user.id
      }
    })
  }

  async findOne(id: number) {
    return await this.projectRepository.findOne({
      relations: ["tasks","users","client","timesheets"],
      where: {
        id: id
      }
    });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const project = await this.projectRepository.findOne({where: {id: id}});
    if(!project)
      throw new NotFoundException("Not found Project!")

    if(updateProjectDto.client)
      project.client = await this.clientService.findOne(updateProjectDto.client.id);
    if(updateProjectDto.name)
      project.name = updateProjectDto.name;
    if(updateProjectDto.code)
      project.code = updateProjectDto.code;
    if(updateProjectDto.startAt)
      project.startAt = updateProjectDto.startAt;
    if(updateProjectDto.endAt)
      project.endAt = updateProjectDto.endAt;
    if(updateProjectDto.users){
      const users = [];
      for(const userData of updateProjectDto.users) {
       const user =  (await this.userService.findUserById(userData.id))
       if (user)
        {
          users.push(user)
          console.log(users)
        }
      } 
      project.users = users
    }
    if(updateProjectDto.tasks){
      const tasks = [];
      for(const taskData of updateProjectDto.tasks) {
       const task =  (await this.taskService.findOne(taskData.id))
       if (task)
        {
          tasks.push(task)
        }
      }
      project.tasks = tasks
    }
    return this.projectRepository.save(project);
  }

 async remove(id: number) {
    const project = await this.findOne(id);
    if(!project)
      throw new NotFoundException("Not found Project!")
    this.projectRepository.delete(id)
    return 'Delete Success-';
  }
}
