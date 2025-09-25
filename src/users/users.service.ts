import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  async create(dto: CreateUserDto) {
    const u1 = await this.usersRepo.findOne({ where: { username: dto.username } });
    if (u1) throw new ConflictException('Username already exists');

    const u2 = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (u2) throw new ConflictException('Email already exists');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({ ...dto, password: hashed });
    return this.usersRepo.save(user);
  }

  findOne(condition: any) {
    return this.usersRepo.findOne({ where: condition });
  }

  findManyBySearch(q: string) {
    return this.usersRepo.find({
      where: [{ username: ILike(`%${q}%`) }, { email: ILike(`%${q}%`) }],
      take: 20,
    });
  }

  async updateOne(condition: any, updates: UpdateUserDto) {
    const user = await this.findOne(condition);
    if (!user) throw new NotFoundException('User not found');
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    Object.assign(user, updates);
    await this.usersRepo.save(user);
    const { password, ...safe } = user as any;
    return safe;
  }

  async removeOne(condition: any) {
    const user = await this.findOne(condition);
    if (!user) throw new NotFoundException('User not found');
    await this.usersRepo.remove(user);
    return { removed: true };
  }

  // helpers for controllers
  async getWishesOfUser(userId: number, wishesRepo?: Repository<any>) {
    // preferable: inject Wishes repo in module; but to keep module boundaries light,
    // we'll query relations via findOne with relations
    const user = await this.usersRepo.findOne({ where: { id: userId }, relations: ['wishes'] });
    return user?.wishes || [];
  }

  async findByUsernamePublic(username: string) {
    const user = await this.usersRepo.findOne({ where: { username } });
    if (!user) throw new NotFoundException('User not found');
    const { password, email, ...publicUser } = user as any; // remove sensitive fields (email sometimes allowed but spec had public DTO without email)
    return publicUser;
  }

  async getWishesByUsername(username: string) {
    const user = await this.usersRepo.findOne({ where: { username }, relations: ['wishes'] });
    if (!user) throw new NotFoundException('User not found');
    return user.wishes || [];
  }
}
