import { Controller, Get, Patch, UseGuards, Request, Body, Post, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  findOwn(@Request() req) {
    return this.usersService.findOne({ id: req.user.id });
  }

  @Patch('me')
  update(@Request() req, @Body() dto: UpdateUserDto) {
    return this.usersService.updateOne({ id: req.user.id }, dto);
  }

  @Get('me/wishes')
  getOwnWishes(@Request() req) {
    return this.usersService.getWishesOfUser(req.user.id);
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findByUsernamePublic(username);
  }

  @Get(':username/wishes')
  getWishes(@Param('username') username: string) {
    return this.usersService.getWishesByUsername(username);
  }

  @Post('find')
  findMany(@Body() dto: FindUsersDto) {
    return this.usersService.findManyBySearch(dto.query);
  }
}
