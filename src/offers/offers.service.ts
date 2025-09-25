import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { WishesService } from '../wishes/wishes.service';
import { Wish } from '../wishes/entities/wish.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private offersRepo: Repository<Offer>,
    private wishesService: WishesService,
  ) {}

  async create(itemId: number, dto: CreateOfferDto, user: User) {
    const wish = await this.wishesService.findOne({ id: itemId });
    if (!wish) throw new NotFoundException('Wish not found');

    if (wish.owner.id === user.id) throw new BadRequestException('Cannot contribute to your own wish');

    const amount = Number(dto.amount);
    if (Number(wish.raised) >= Number(wish.price)) throw new BadRequestException('Wish already fully funded');

    if (Number(wish.raised) + amount > Number(wish.price)) {
      throw new BadRequestException('Amount exceeds wish price');
    }

    const offer = this.offersRepo.create({ user, item: wish, amount, hidden: !!dto.hidden });
    await this.offersRepo.save(offer);

    wish.raised = Number(wish.raised) + amount;
    // save updated raised
    await (this.wishesService as any).wishesRepo.save(wish).catch(() => {}); // eslint-disable-line
    return offer;
  }

  findAll() {
    return this.offersRepo.find();
  }

  findOne(id: number) {
    return this.offersRepo.findOne({ where: { id } });
  }
}
