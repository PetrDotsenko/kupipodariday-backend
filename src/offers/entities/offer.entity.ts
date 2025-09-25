import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity({ name: 'offers' })
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.offers, { eager: true })
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers, { eager: true })
  item: Wish;

  @Column('numeric', { precision: 12, scale: 2 })
  amount: number;

  @Column({ default: false })
  hidden: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
