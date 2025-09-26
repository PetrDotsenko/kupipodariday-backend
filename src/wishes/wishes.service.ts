import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(@InjectRepository(Wish) private wishesRepo: Repository<Wish>) {}

  async create(dto: CreateWishDto, owner: User) {
    const w = this.wishesRepo.create({ ...dto, price: Number(dto.price), raised: 0, owner });
    return this.wishesRepo.save(w);
  }

  findOne(condition: FindOptionsWhere<Wish>) {
    return this.wishesRepo.findOne({ where: condition, relations: ['offers'] });
  }

  getRecent(take = 40) {
    return this.wishesRepo.find({ order: { createdAt: 'DESC' }, take });
  }

  getPopular(take = 20) {
    return this.wishesRepo.find({ order: { copied: 'DESC' }, take });
  }

  async updateOne(condition: FindOptionsWhere<Wish>, updates: UpdateWishDto, user: User) {
    const wish = await this.findOne(condition);
    if (!wish) throw new NotFoundException('Wish not found');
    if (wish.owner.id !== user.id) throw new ForbiddenException('Only owner can edit');

    if (updates.price !== undefined && wish.offers && wish.offers.length > 0) {
      throw new BadRequestException('Cannot change price when offers exist');
    }

    Object.assign(wish, updates);
    return this.wishesRepo.save(wish);
  }

  async removeOne(condition: FindOptionsWhere<Wish>, user: User) {
    const wish = await this.findOne(condition);
    if (!wish) throw new NotFoundException('Wish not found');
    if (wish.owner.id !== user.id) throw new ForbiddenException('Only owner can delete');
    if (wish.offers && wish.offers.length > 0) throw new BadRequestException('Cannot delete wish with offers');
    await this.wishesRepo.remove(wish);
    return wish;
  }

  async copyWish(id: number, user: User) {
    const wish = await this.findOne({ id });
    if (!wish) throw new NotFoundException('Wish not found');
    const copy = this.wishesRepo.create({
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
      owner: user,
      raised: 0,
    });
    wish.copied = Number(wish.copied) + 1;
    await this.wishesRepo.save(wish);
    return this.wishesRepo.save(copy);
  }
}
