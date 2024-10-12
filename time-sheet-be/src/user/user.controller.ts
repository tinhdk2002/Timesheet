import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { UserRole } from 'src/utils/user-role.enum';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorator/public.decorator';

@Controller('user')
@ApiTags('User')
@ApiSecurity('JWT-auth')
export class UserController {
    constructor(private readonly userService: UserService) {}
    
@UseGuards(new RoleGuard([UserRole.ADMIN, UserRole.PROJECT_MANAGER]))
@Get() 
findAll() {
    return this.userService.findAll()
}

@Get(':userId')
findUserById(@Param('userId') userId: number){
    return this.userService.findUserById(userId)
}

@Get('email/:email')
findUserByEmail(@Param('email') email: string){
    return this.userService.findEmail(email)
}

@UseGuards(new RoleGuard([UserRole.ADMIN]))
@Post()  
createUser(@Body() createUserDto: CreateUserDto) {
    return  this.userService.create(createUserDto) 
}
 
@Put(':id')
updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto)
}

@UseGuards(new RoleGuard([UserRole.ADMIN]))
@Delete(':id')
deleteUser(@Param('id') id:number ){
    return  this.userService.delete(id)
   
}
}
