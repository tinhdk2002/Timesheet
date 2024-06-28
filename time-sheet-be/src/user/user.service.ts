import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { And, Like, Or, Repository, UpdateDateColumn } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundError } from 'rxjs';
import e from 'express';
import { UserRole } from 'src/utils/user-role.enum';
import { Project } from 'src/project/entities/project.entity';
import { ProjectService } from 'src/project/project.service';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
      ) {}
    create(createUserDto: CreateUserDto) {
        let user: User = new User();
        user.email = createUserDto.email; 
        user.firstName = createUserDto.firstName;
        user.lastName = createUserDto.lastName;
        user.password = createUserDto.password;
        user.sex = createUserDto.sex;
        if(createUserDto.role)
            user.role = createUserDto.role
        return this.userRepository.save(user)
        .catch((e) => {
            //Key (email)=(admin@gmail.com) already exists.
            if (/(email)[\s\S]+(already exists)/.test(e.detail)) {
              throw new BadRequestException(
                'Account with this email already exists.',
              );
            }
            return e;
          });
      } 
    
    async update(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
       const user: User = await this.findUserById(userId)
        if(!user)
            throw new NotFoundException('Not found user')

        
        if(updateUserDto.firstName)
            user.firstName = updateUserDto.firstName
        if(updateUserDto.email)
            user.email = updateUserDto.email
        if(updateUserDto.lastName)
            user.lastName = updateUserDto.lastName
        if(updateUserDto.password)
            user.password = updateUserDto.password
        if(updateUserDto.role)
            user.role = updateUserDto.role;
        this.userRepository.save(user)
        return user
    }

    findUserById(userId: number){
        return this.userRepository.findOneOrFail({ 
            relations: ['projects']
            ,where: {id: userId}})
    }

    findUserByName(name: string){
        return this.userRepository.findOneOrFail({ where:  {
            firstName: Like(`%${name}%`),
            lastName: Like(`%${name}%`)
        }  })
    }

    findEmail(email: string){
        return this.userRepository.findOneOrFail(
            {
                relations: ['projects']
                ,where: {email: email}
        })
    }
     
    async findAll() {
        const users = await this.userRepository.find({
            relations:['projects']
        })
        return users
    }

    async delete(userId: number){
        const user: User = await this.findUserById(userId)
        if(!user)
            throw new NotFoundException('Not found user')
        return this.userRepository.delete(userId)
    }

    findTimesheetByUser(userId: number){
        return this.userRepository.findOneOrFail({
            relations:['timesheet'],
            where: {id: userId}
        })
    }
}
