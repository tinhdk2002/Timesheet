import { Inject, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';
import { ClientModule } from './client/client.module';
import { ProjectModule } from './project/project.module';
import { AuthGuard } from './auth/guard/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { TimeSheetModule } from './time-sheet/time-sheet.module';
import { BranchModule } from './admin/branch/branch.module';
import { PositionModule } from './admin/position/position.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true, envFilePath:['.local.env']}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'), 
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD') || "",
        synchronize: configService.get<boolean>('DATABASE_SYNC'), 
        logging: configService.get<boolean>('DATABASE_LOGGING'),
        database: configService.get('DATABASE_NAME'),
        autoLoadEntities: true,
      }),  
    }),
    UserModule,
    TaskModule,
    AuthModule,
    ProjectModule,
    ClientModule,
    TimeSheetModule,
    BranchModule,
    PositionModule
  ], 
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }
],
})
export class AppModule {}
