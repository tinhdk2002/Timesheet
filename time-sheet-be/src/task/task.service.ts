import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, Type } from './entities/task.entity';
import { AlreadyHasActiveConnectionError, Like, Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    ) {}

  async create(createTaskDto: CreateTaskDto) {
    let task = new Task();
    task.name = createTaskDto.name;
    task.type = createTaskDto.type;
    task.archive = false;

    return this.taskRepository.save(task)
  }

  async findAll() {
    return await this.taskRepository.find();
  }

  async findAllTypeCommon() {
    return await this.taskRepository.find(
      {
        where: {type: Type.COMMON}
      }
    )
  }

  async findAllTypeOther() {
    return await this.taskRepository.find(
      {
        where: {type: Type.OTHER}
      }
    )
  }

  async findOne(id: number) {
    let task =  await this.taskRepository.findOne({ where: {id: id}});
    if (!task) {
      throw new NotFoundException(`Not found task #${id}`);
    }
    return task
  }

  
  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id: id}})
    
    if (!task)
      throw new NotFoundException("Dont found task")
    if(updateTaskDto.name)
      task.name = updateTaskDto.name;
    if(updateTaskDto.type)
        task.type = updateTaskDto.type;
      task.archive = updateTaskDto.archive;
    this.taskRepository.save(task)
    return task 
  }

  remove(id: number) {
    return this.taskRepository.delete(id);
  }

  async filterTask(name: string){
    return await this.taskRepository.find({where: {name: Like(`%${name}%`)}})
  }
}
