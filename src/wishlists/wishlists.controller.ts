import { Controller, Get, Post, UseGuards, Body, Param, Patch, Delete, Request } from '@nestjs/common';
import { WishlistsService } from './/wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Request() req) {
    return this.wishlistsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateWishlistDto, @Request() req) {
    return this.wishlistsService.create(dto, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishlistsService.findOne({ id: Number(id) });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: CreateWishlistDto, @Request() req) {
    return this.wishlistsService.updateOne({ id: Number(id) }, dto, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: number, @Request() req) {
    return this.wishlistsService.removeOne({ id: Number(id) }, req.user);
  }
}
