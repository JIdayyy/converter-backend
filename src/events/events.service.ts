import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class EventsService {
  private readonly connectedClients: Map<string, Socket> = new Map();

  handleConnection(socket: Socket): void {
    const clientId = socket.id;
    this.connectedClients.set(clientId, socket);

    socket.on('disconnect', () => {
      this.connectedClients.delete(clientId);
    });

    // Handle other events and messages from the client
  }

  handleEvent(event: string, data: any): void {
    console.log('Event:', event, 'Data:', data);
    this.connectedClients.forEach((socket) => {
      socket.emit(event, data);
    });
  }
}
