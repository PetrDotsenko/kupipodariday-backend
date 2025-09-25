import { Controller, Post, UseGuards, Body, Get, Param, Patch, Delete, Request } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { WishesService } from './/wishes.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateWishDto } from './dto/update-wish.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}

  @Post()
  create(@Body() dto: CreateWishDto, @Request() req) {
    return this.wishesService.create(dto, req.user);
  }

  @Get('last')
  findLast() {
    return this.wishesService.getRecent(40);
  }

  @Get('top')
  findTop() {
    return this.wishesService.getPopular(20);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishesService.findOne({ id: Number(id) });
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateWishDto, @Request() req) {
    return this.wishesService.updateOne({ id: Number(id) }, dto, req.user);
  }

  @Delete(':id')
  removeOne(@Param('id') id: number, @Request() req) {
    return this.wishesService.removeOne({ id: Number(id) }, req.user);
  }

  @Post(':id/copy')
  copyWish(@Param('id') id: number, @Request() req) {
    return this.wishesService.copyWish(Number(id), req.user);
  }
}
