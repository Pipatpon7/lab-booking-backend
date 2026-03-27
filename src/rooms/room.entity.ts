import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from '../bookings/booking.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // เช่น "Lab 101"

  @Column()
  capacity: number; // จำนวนคนสูงสุด

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Booking, (booking) => booking.room)
  bookings: Booking[];
}
