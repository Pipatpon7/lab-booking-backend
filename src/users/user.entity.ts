import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from '../bookings/booking.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'student' }) // 'student' | 'admin'
  role: string;

  @Column()
  fullName: string;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
}
