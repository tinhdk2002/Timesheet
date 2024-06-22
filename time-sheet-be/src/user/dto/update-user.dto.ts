// create-user.dto.ts

import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { UserRole } from 'src/utils/user-role.enum';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName?: string;

  @IsNotEmpty()
  @IsString()
  lastName?: string;

  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsString()
  password?: string;

  sex?: string;

  role?:UserRole[];
}
