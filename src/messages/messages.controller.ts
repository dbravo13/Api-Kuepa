import { Controller, Get, Post, Body } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { PusherService } from 'src/pusher/pusher.service';

@Controller('messages')
export class MessagesController {
  constructor(
    private messagesService: MessagesService,
    private pusherService: PusherService,
  ) {
    // Inyectamos el servicio de Pusher
  }

  // Ruta POST para enviar mensajes
  @Post('create')
  async createMessage(
    @Body('username') username: string,
    @Body('message') message: string,
  ) {
    // Guardar el mensaje en la base de datos
    const savedMessage = await this.messagesService.createMessage(
      username,
      message,
    );

    // Enviar el mensaje a Pusher
    await this.pusherService.trigger('chat', 'message', {
      username: savedMessage.username,
      message: savedMessage.message,
    });

    // Retornar el mensaje guardado
    return savedMessage;
  }

  // Ruta GET para obtener mensajes
  @Get()
  async getMessages() {
    return this.messagesService.getMessages();
  }
}
