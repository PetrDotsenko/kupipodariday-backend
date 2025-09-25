import { Controller, Post, UseGuards, Body, Get, Param, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OffersService } from './offers.service';

@UseGuards(AuthGuard('jwt'))
@Controller('offers')
export class OffersController {
  constructor(private offersService: OffersService) {}

  @Post()
  create(@Body() dto: CreateOfferDto, @Request() req) {
    return this.offersService.create(dto.itemId, dto, req.user);
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(Number(id));
  }
}
