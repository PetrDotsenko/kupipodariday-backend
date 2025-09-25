import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(@InjectRepository(Wishlist) private wishlistsRepo: Repository<Wishlist>) {}

  async findAll() {
    return this.wishlistsRepo.find();
  }

  async create(dto: CreateWishlistDto, user: User, wishRepo?: Repository<Wish>) {
    const wishlist = this.wishlistsRepo.create();
    wishlist.name = dto.name;
    wishlist.image = dto.image || null;
    wishlist.owner = user;
    if (dto.itemsId && dto.itemsId.length) {
      // lazy: create placeholder Wishes by id relation (TypeORM will resolve)
      // Better: inject Wish repo; but keep minimal: set items as array of objects with id
      wishlist.items = dto.itemsId.map((id) => ({ id } as Wish));
    } else {
      wishlist.items = [];
    }
    return this.wishlistsRepo.save(wishlist);
  }

  findOne(condition: any) {
    return this.wishlistsRepo.findOne({ where: condition });
  }

  async updateOne(condition: any, dto: CreateWishlistDto, user: User) {
    const w = await this.findOne(condition);
    if (!w) throw new NotFoundException('Wishlist not found');
    if (w.owner.id !== user.id) throw new ForbiddenException('Only owner can edit');
    if (dto.name) w.name = dto.name;
    if (dto.image !== undefined) w.image = dto.image;
    if (dto.itemsId) w.items = dto.itemsId.map((id) => ({ id } as Wish));
    return this.wishlistsRepo.save(w);
  }

  async removeOne(condition: any, user: User) {
    const w = await this.findOne(condition);
    if (!w) throw new NotFoundException('Wishlist not found');
    if (w.owner.id !== user.id) throw new ForbiddenException('Only owner can delete');
    await this.wishlistsRepo.remove(w);
    return { removed: true };
  }
}
