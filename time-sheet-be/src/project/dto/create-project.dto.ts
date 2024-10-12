import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDate, IsJSON, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Client } from "src/client/entities/client.entity";
import { Task } from "src/task/entities/task.entity";
import { User } from "src/user/entities/user.entity";
import { Unique } from "typeorm";

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    code: string
    
    @IsDate()
    @IsNotEmpty()
    @ApiProperty()
    startAt: Date;

    @IsDate()
    @IsNotEmpty()
    @ApiProperty()
    endAt: Date;

    @IsNotEmpty()
    @ApiProperty()
    client: Client;

    @IsArray()
    @IsNotEmpty()
    @ApiProperty()
    users: User[];

    @IsArray()
    @IsNotEmpty()
    @ApiProperty()
    tasks: Task[];
} 
  