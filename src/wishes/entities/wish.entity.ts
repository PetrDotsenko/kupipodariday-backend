import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';

@Entity({ name: 'wishes' })
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 250 })
  name: string;

  @Column({ nullable: true })
  link: string;

  @Column({ nullable: true })
  image: string;

  @Column('numeric', { precision: 12, scale: 2, default: 0 })
  price: number;

  @Column('numeric', { precision: 12, scale: 2, default: 0 })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes, { eager: true })
  owner: User;

  @Column({ length: 1024, nullable: true })
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({ type: 'int', default: 0 })
  copied: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
