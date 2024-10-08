import { Controller, Get, Post, Body } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  // Ruta POST para enviar mensajes
  @Post()
  async createMessage(
    @Body('username') username: string,
    @Body('message') message: string,
  ) {
    return this.messagesService.createMessage(username, message);
  }

  // Ruta GET para obtener mensajes
  @Get()
  async getMessages() {
    return this.messagesService.getMessages();
  }
}
