import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { LoginGoogleDto } from './dto/logingg.dto';

@Controller('auth')
@ApiTags('Login')
@Public()

export class AuthController {
    constructor(private authService: AuthService){}

    @Post("login")
    signIn(@Body() signInDto: LoginDto){
        return this.authService.signIn(signInDto.email, signInDto.password)
    }

    @Post("loginGG")
    signInGoogle(@Body() signInGoogleDto: LoginGoogleDto){
        return this.authService.signInGoogle(signInGoogleDto.email)
    }
}
