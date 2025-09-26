import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindOptionsWhere } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  private sanitize(user: User | null): UserWithoutPassword | null {
    if (!user) return null;

    const { password, ...rest } = user as any;
    return rest as UserWithoutPassword;
  }

  async create(dto: CreateUserDto) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({ ...dto, password: hashed });
    try {
      const saved = await this.usersRepo.save(user);
      return this.sanitize(saved);
    } catch (err: unknown) {

      const e: any = err;
      if (e && e.code === '23505') {
        throw new ConflictException('User with same email or username already exists');
      }
      throw err;
    }
  }

  findOne(condition: FindOptionsWhere<User>) {
    return this.usersRepo.findOne({ where: condition });
  }

  async findByUsernameWithPassword(username: string) {
    return this.usersRepo.findOne({
      where: { username },
      select: ['id', 'username', 'password', 'email', 'avatar', 'about', 'createdAt', 'updatedAt'],
    });
  }

  findManyBySearch(q: string) {
    return this.usersRepo.find({
      where: [{ username: ILike(`%${q}%`) }, { email: ILike(`%${q}%`) }],
      take: 20,
    });
  }

  async updateOne(condition: FindOptionsWhere<User>, updates: UpdateUserDto) {
    const user = await this.findOne(condition);
    if (!user) throw new NotFoundException('User not found');
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    Object.assign(user, updates);
    const saved = await this.usersRepo.save(user);
    return this.sanitize(saved);
  }

  async removeOne(condition: FindOptionsWhere<User>) {
    const user = await this.findOne(condition);
    if (!user) throw new NotFoundException('User not found');
    await this.usersRepo.remove(user);
    return { removed: true };
  }

  async getWishesOfUser(userId: number) {
    const user = await this.usersRepo.findOne({ where: { id: userId }, relations: ['wishes'] });
    return user?.wishes || [];
  }

  async findByUsernamePublic(username: string) {
    const user = await this.usersRepo.findOne({ where: { username } });
    if (!user) throw new NotFoundException('User not found');
    return this.sanitize(user);
  }

  async getWishesByUsername(username: string) {
    const user = await this.usersRepo.findOne({ where: { username }, relations: ['wishes'] });
    if (!user) throw new NotFoundException('User not found');
    return user.wishes || [];
  }
}
