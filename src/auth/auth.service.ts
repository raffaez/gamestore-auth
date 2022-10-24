import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { User } from 'src/user/user.entity';

import { UserService } from './../user/user.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService){}

  async login(user: User){
    const payload = { sub: user.id, email: user.email };

    return {
      token: this.jwtService.sign(payload),
    }
  }
    
  async validateUser(email: string, password: string) {
    let user: User;
    try{
      user = await this.userService.findOneOrFail({ where: { email }});
    } catch(error){
      return null;
    }

    const isPasswordValid = compareSync(password, user.password);
    if(!isPasswordValid) return null;

    return user;
  }
}
