import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity({ name: 'wishlists' })
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 250, nullable: true })
  name: string;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists, { eager: true })
  owner: User;

  @ManyToMany(() => Wish, { cascade: true, eager: true })
  @JoinTable({ name: 'wishlist_items' })
  items: Wish[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
