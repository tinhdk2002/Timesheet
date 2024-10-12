import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Task } from 'src/task/entities/task.entity';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Project } from 'src/project/entities/project.entity';
import { PositionModule } from 'src/admin/position/position.module';
import { BranchModule } from 'src/admin/branch/branch.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Project]), PositionModule, BranchModule],
  providers: [UserService],
  controllers: [UserController],
  exports:[UserService]
})
export class UserModule {}
  