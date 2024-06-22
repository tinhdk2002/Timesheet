import { IsDate, IsEnum, IsNotEmpty, IsString } from "class-validator"
import { StatusTS } from "../ultis/status.enum"
import { Project } from "src/project/entities/project.entity"
import { Task } from "src/task/entities/task.entity"
import { ApiProperty } from "@nestjs/swagger"
import { User } from "src/user/entities/user.entity"

export class CreateTimeSheetDto {
    @IsString()
    @ApiProperty()
    note: string

    @IsString()
    @ApiProperty()
    time: number

    @IsString()
    @ApiProperty()
    type: string

    @IsNotEmpty()
    @ApiProperty()
    projects: Project

    @IsNotEmpty()
    @ApiProperty()
    tasks: Task

    @IsString()
    @ApiProperty()
    date: Date

    @IsEnum(StatusTS)
    @ApiProperty()
    status?: StatusTS

    @IsNotEmpty()
    @ApiProperty()
    user: User
}
