import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { LessThan, MoreThan, Not } from 'typeorm';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
  ) {}

  async create(
    userId: number,
    roomId: number,
    date: string,
    startTime: string,
    endTime: string,
    note: string,
  ): Promise<Booking> {
    const conflict = await this.bookingsRepository.findOne({
      where: {
        room: { id: roomId },
        date,
        status: Not('reject'),
        startTime: LessThan(endTime),
        endTime: MoreThan(startTime),
      },
    });
    if (conflict) throw new BadRequestException('ช่วงเวลานี้ถูกจองแล้ว');

    const booking = this.bookingsRepository.create({
      user: { id: userId },
      room: { id: roomId },
      date,
      startTime,
      endTime,
      note,
    });
    return this.bookingsRepository.save(booking);
  }

  findMyBookings(userId: number): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { user: { id: userId } },
      relations: ['room'],
      order: { createdAt: 'DESC' },
    });
  }

  findAll(): Promise<Booking[]> {
    return this.bookingsRepository.find({
      relations: ['room', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: number, status: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({ where: { id } });
    if (!booking) throw new NotFoundException('ไม่พบการจองนี้');
    booking.status = status;
    return this.bookingsRepository.save(booking);
  }
}
