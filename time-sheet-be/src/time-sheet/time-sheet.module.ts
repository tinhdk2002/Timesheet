import { Module } from '@nestjs/common';
import { TimeSheetService } from './time-sheet.service';
import { TimeSheetController } from './time-sheet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeSheet } from './entities/time-sheet.entity';
import { ProjectModule } from 'src/project/project.module';
import { TaskModule } from 'src/task/task.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([TimeSheet]), ProjectModule, TaskModule, UserModule],
  controllers: [TimeSheetController],
  providers: [TimeSheetService],
})
export class TimeSheetModule {}
