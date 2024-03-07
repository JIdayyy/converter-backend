import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EventsService } from './events.service';

@Module({
  imports: [],
  controllers: [],
  providers: [EventsGateway, EventsService],
  exports: [EventsService],
})
export class EventsModule {}
