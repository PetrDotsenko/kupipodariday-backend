import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { WishesService } from './wishes.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Request as ExpressRequest } from 'express';

@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}

  @Get('last')
  findLast() {
    return this.wishesService.getRecent(40);
  }

  @Get('top')
  findTop() {
    return this.wishesService.getPopular(20);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateWishDto, @Request() req: ExpressRequest) {
    return this.wishesService.create(dto, (req as any).user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishesService.findOne({ id: Number(id) });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateWishDto, @Request() req: ExpressRequest) {
    return this.wishesService.updateOne({ id: Number(id) }, dto, (req as any).user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  removeOne(@Param('id') id: number, @Request() req: ExpressRequest) {
    return this.wishesService.removeOne({ id: Number(id) }, (req as any).user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/copy')
  copyWish(@Param('id') id: number, @Request() req: ExpressRequest) {
    return this.wishesService.copyWish(Number(id), (req as any).user);
  }
}
