import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos';
import { UsersService } from './users.service';

@Controller('api/v1')
export class UsersController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Post('auth/signup')
  @UsePipes(ValidationPipe)
  signup(@Body() body: SignupDto) {
    this.authService.signup(body);
  }

  @Post('auth/signin')
  @UsePipes(ValidationPipe)
  signin(@Body() body: SignupDto) {
    this.authService.signin(body);
  }
}
