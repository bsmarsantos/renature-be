import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserInterface } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<UserInterface>) {}

  private logger = new Logger(UsersService.name);

  async createUser(name: string, email: string, password: string): Promise<UserInterface> {
    try {
      const newUser = new this.userModel({name, email, password});
      return await newUser.save();
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findAll(): Promise<UserInterface[]> {
    try {
      return await this.userModel.find({});
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findByEmail(email: string): Promise<UserInterface> {
    try {
      return this.userModel.findOne({ email }).exec();
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findByID(_id: string): Promise<UserInterface> {
    try {
      return await this.userModel.findById(_id).exec();
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
