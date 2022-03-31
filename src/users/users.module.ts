import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UserSchema } from './interfaces/user.schema';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])
  ],
  controllers: [UsersController],
  providers: [
    AuthService,
    UsersService
  ]
})
export class UsersModule {}
