import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) {}

  findAll(): Promise<Room[]> {
    return this.roomsRepository.find({ where: { isActive: true } });
  }
  findAllAdmin(): Promise<Room[]> {
    // ไม่ filter isActive เพื่อให้ admin เห็นทุกห้อง
    return this.roomsRepository.find();
  }

  async findOne(id: number): Promise<Room> {
    if (isNaN(id)) {
      throw new BadRequestException('ID ของห้องต้องเป็นตัวเลขเท่านั้น');
    }
    const room = await this.roomsRepository.findOne({ where: { id } });
    if (!room) throw new NotFoundException('ไม่พบห้องนี้');
    return room;
  }

  create(data: Partial<Room>): Promise<Room> {
    const room = this.roomsRepository.create(data);
    return this.roomsRepository.save(room);
  }

  async update(id: number, data: Partial<Room>): Promise<Room> {
    await this.roomsRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.roomsRepository.update(id, { isActive: false });
    return { message: 'ลบห้องสำเร็จ' };
  }
}
