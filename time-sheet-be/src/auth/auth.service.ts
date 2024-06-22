import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NotFoundError } from 'rxjs';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService:JwtService
        ){}

    async signIn(
        email: string,
        pass: string
        ): Promise<{ acces_token: string }>{
        const user = await this.userService.findEmail(email)
        if(user?.password !== pass){
            throw new UnauthorizedException('Wrong password!')
        }
        const { password, ...payload} = user;

        return {
            acces_token: await this.jwtService.signAsync(payload)
        };
    }

    async signInGoogle(email: string): Promise< {acces_token: string}>{
        const user = await this.userService.findEmail(email)
        if(!user) {
            throw new NotFoundException('Does not exist account!')
        }
        const {password, ...payload} = user;

        return {
            acces_token: await this.jwtService.signAsync(payload)
        }
    }
}
