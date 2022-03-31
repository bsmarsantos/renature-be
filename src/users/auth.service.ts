import { BadRequestException, Injectable, Logger, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// DTOS
import { SigninDto, SignupDto } from './dtos';

// INTERFACES
import { UserInterface } from './interfaces/user.interface';

// SERVICES
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserInterface>,
    private readonly usersService: UsersService
  ) { }

  private logger = new Logger(AuthService.name);

  async signup(newUser: SignupDto): Promise<UserInterface> {
    // * See if email is in use
    const foundUser = await this.usersService.findByEmail(newUser.email);

    if (foundUser) {
      throw new BadRequestException('Email is already in use.');
    }

    // * Hash the user password
    // Generate a salt
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password together
    const hash = (await scrypt(newUser.password, salt, 32)) as Buffer;

    // Join the hashed result and the salt together
    const hashedPassword = `${ salt }.${ hash.toString('hex') }`;

    // * Create a new user and save it
    const createdUser = await this.usersService.createUser(newUser.name, newUser.email, hashedPassword);

    // * Return the new created user
    return createdUser;
  }

  async signin(user: SigninDto): Promise<UserInterface> {
    // * See if email exists
    const foundUser = await this.usersService.findByEmail(user.email);

    if (!foundUser) {
      throw new NotFoundException('User not found.');
    }

    // * Password comparison
    // Get salt and hash
    const [salt, storedHash] = foundUser.password.split('.');

    // Hash the given password with the salt
    const hash = (await scrypt(user.password, salt, 32)) as Buffer;

    // Compare hashed given password with stored hashed password
    if (storedHash !== hash.toString('hex')) {
      // Password is not the same
      throw new BadRequestException('Password is incorrect.');
    }

    // Password is ok, login user
    return foundUser;
  }
}
