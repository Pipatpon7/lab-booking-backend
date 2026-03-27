import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookingsService } from './bookings.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Request as ExpressRequest } from 'express';

interface AuthRequest extends ExpressRequest {
  user: { userId: number; email: string; role: string };
}

@Controller('bookings')
@UseGuards(AuthGuard('jwt'))
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  create(
    @Request() req: AuthRequest,
    @Body()
    body: {
      roomId: number;
      date: string;
      startTime: string;
      endTime: string;
      note: string;
    },
  ) {
    return this.bookingsService.create(
      req.user.userId,
      body.roomId,
      body.date,
      body.startTime,
      body.endTime,
      body.note,
    );
  }

  @Get('my')
  getMyBookings(@Request() req: AuthRequest) {
    return this.bookingsService.findMyBookings(req.user.userId);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  findAll() {
    return this.bookingsService.findAll();
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('admin')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.bookingsService.updateStatus(+id, body.status);
  }
}
