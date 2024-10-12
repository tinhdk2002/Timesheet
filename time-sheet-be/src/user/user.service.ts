import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { PositionService } from 'src/admin/position/position.service';
import { BranchService } from 'src/admin/branch/branch.service';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private positionService: PositionService,
        private branchService: BranchService,
      ) {}
    async create(createUserDto: CreateUserDto) {
        let user: User = new User();
        user.email = createUserDto.email; 
        user.firstName = createUserDto.firstName;
        user.lastName = createUserDto.lastName;
        user.password = createUserDto.password;
        user.sex = createUserDto.sex;
        let branch = await this.branchService.findOne(createUserDto.branch.id);
        if (!branch) {
            throw new BadRequestException(`Branch not found`);
        }
        let position = await this.positionService.findOne(createUserDto.position.id);
        if (!position) {
            throw new BadRequestException('Position not found');
        } 
        user.branch = branch
        user.position = position
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

    async findUserById(userId: number){
        let user = await this.userRepository.findOne({ 
            relations: ['projects', 'position', 'branch']
            ,where: {id: userId}})
        if (!user) {
            throw new NotFoundException(`Not found user id ${userId}`);
        } 
        return user
    }

    async findUserByName(name: string){
        let user = await this.userRepository.findOne({ where: {
            firstName: Like(`%${name}%`),
            lastName: Like(`%${name}%`)
        }})
        if (!user) {
            throw new NotFoundException(`Not found user name ${name}`);
        }
        return user
    }

    async findEmail(email: string){
        let user = await this.userRepository.findOne(
            {
                relations: ['projects', 'position', 'branch']
                ,where: {email: email}
        })
        if (!user) {
            throw new NotFoundException(`Not found user email ${email}`);
        }
        return user
    }
     
    async findAll() {
        const users = await this.userRepository.find({
            relations:['projects', 'position', 'branch']
        })
        return users
    }

    async delete(userId: number){
        const user: User = await this.findUserById(userId)
        if(!user)
            throw new NotFoundException('Not found user')
        return this.userRepository.delete(userId)
    }

    async findTimesheetByUser(userId: number){
        let user = await this.userRepository.findOne({
            relations:['timesheet'],
            where: {id: userId}
        })
        if (!user) {
            throw new NotFoundException('Not found user!')
        }
        return user
    }
}
