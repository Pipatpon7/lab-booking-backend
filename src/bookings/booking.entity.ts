import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Room } from '../rooms/room.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookings)
  user: User;

  @ManyToOne(() => Room, (room) => room.bookings)
  room: Room;

  @Column()
  date: string; // เช่น "2025-04-27"

  @Column()
  startTime: string; // เช่น "09:00"

  @Column()
  endTime: string; // เช่น "11:00"

  @Column({ default: 'pending' }) // 'pending' | 'approved' | 'rejected'
  status: string;

  @Column({ nullable: true })
  note: string;

  @CreateDateColumn()
  createdAt: Date;
}
