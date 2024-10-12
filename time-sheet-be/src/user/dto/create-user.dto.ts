import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { Branch } from 'src/admin/branch/entities/branch.entity';
import { Position } from 'src/admin/position/entities/position.entity';
import { UserRole } from 'src/utils/user-role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;

  @IsEnum(UserRole)
  @ApiProperty()
  role?:UserRole[];

  @ApiProperty()
  sex: string;

  @ApiProperty()
  position: Position;

  @ApiProperty()
  branch: Branch;
}
