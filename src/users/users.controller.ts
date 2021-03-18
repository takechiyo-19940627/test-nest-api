import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  HttpException,
} from '@nestjs/common';
import { CreateUserDTO } from './users.dto';
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
}
