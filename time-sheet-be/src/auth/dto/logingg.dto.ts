import { ApiProperty } from "@nestjs/swagger";

export class LoginGoogleDto {
  @ApiProperty()
  email: string;

}
