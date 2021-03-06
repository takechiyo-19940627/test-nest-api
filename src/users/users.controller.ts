import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  HttpException,
} from '@nestjs/common';
import { CreateUserDTO, LoginUserDTO } from './users.dto';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDTO: CreateUserDTO) {
    if (this.usersService.findUserByScreenName(createUserDTO.screenName)) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: `Screen name '${createUserDTO.screenName}' is already taken.`,
        },
        409,
      );
    }
    try {
      await this.usersService.register(createUserDTO);
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Internal Server Error',
        },
        500,
      );
    }
    return;
  }

  @Post('login')
  async login(@Body() loginUserDTO: LoginUserDTO): Promise<User> {
    let user: User;
    try {
      user = await this.usersService.loginUser(
        loginUserDTO.screenName,
        loginUserDTO.password,
      );
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Internal Server Error',
        },
        500,
      );
    }
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User Not Found',
        },
        404,
      );
    }
    return user;
  }
}
