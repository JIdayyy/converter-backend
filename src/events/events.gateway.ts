import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventsService } from './events.service';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway(0, {
  cors: true,
})
export class EventsGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleInit
{
  private readonly logger = console;

  constructor(private readonly eventsService: EventsService) {}

  @WebSocketServer() io: Server;

  onModuleInit() {
    this.logger.log('Module initialized');
  }

  afterInit() {
    this.logger.log('Initialized');
  }

  handleConnection(socket: Socket) {
    this.logger.log(`Client id:${socket.id} connected`);
    this.eventsService.handleConnection(socket);
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`Client id:${socket.id} disconnected`);
    this.eventsService.handleDisconnect(socket);
  }

  @SubscribeMessage('ping')
  handleMessage(client: any, data: any) {
    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.debug(`Payload: ${data}`);
    return {
      event: 'pong',
      data: 'Wrong data that will make the test fail',
    };
  }
}
