import { IsEnum, IsNotEmpty, IsString } from "class-validator"
import { Type } from "../entities/task.entity"
import { ApiProperty } from "@nestjs/swagger"

export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    name: string

    @IsEnum(Type)
    @IsNotEmpty()
    @ApiProperty()
    type: Type

    archive?: boolean
}
 