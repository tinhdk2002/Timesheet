import { IsDate, IsEnum, IsNotEmpty, IsString } from "class-validator"
import { StatusTS } from "../ultis/status.enum"
import { Project } from "src/project/entities/project.entity"
import { Task } from "src/task/entities/task.entity"
import { ApiProperty } from "@nestjs/swagger"
import { User } from "src/user/entities/user.entity"

export class CreateTimeSheetDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    note: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    time: number

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    type: string

    @IsNotEmpty()
    @IsNotEmpty()
    @ApiProperty()
    projects: Project

    @IsNotEmpty()
    @IsNotEmpty()
    @ApiProperty()
    tasks: Task

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    date: Date

    @IsEnum(StatusTS)
    @IsNotEmpty()
    @ApiProperty()
    status?: StatusTS

    @IsNotEmpty()
    @ApiProperty()
    user: User
}
