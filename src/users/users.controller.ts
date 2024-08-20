import { Body, Session, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize, SerializerInterceptor } from 'src/interceptors/serialize.interceptors';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorators';
@Controller('auth')
@Serialize(UserDto)

export class UsersController {

  constructor(
    private userService: UsersService,
    private authService: AuthService
  ) { }

  @Get('/colors/:color')
  setColor(@Param('color') color: string, @Session() session: any) {
    session.color = color
  }

  @Get('/colors')
  getColor(@Session() session: any) {
    return session.color
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id
    return user
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id
    return user

  }


  // @Get('/whoami')
  // whoAmI(@Session() session: any) {
  //   return this.userService.findOne(session.userId)
  // }

  @Get('/whoami')
  whoAmI(@CurrentUser() user: string) {
    return user
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null 
  }

  // @UseInterceptors(new SerializerInterceptor(UserDto))
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    console.log("handler is running ")
    const user = await this.userService.findOne(Number(id));
    if (!user) return new NotFoundException('user not found')
    return user
  }

  @Get('')
  findUsers(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: number, @Body() body: UpdateUserDto) {
    return this.userService.update(Number(id), body);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.remove(Number(id));
  }
}
