import { Controller, Get, Post, Body } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { PusherService } from 'src/pusher/pusher.service';

@Controller('messages')
export class MessagesController {
  constructor(
    private messagesService: MessagesService,
    private pusherService: PusherService,
  ) {}

  @Post('create')
  async createMessage(
    @Body('username') username: string,
    @Body('message') message: string,
  ) {
    const savedMessage = await this.messagesService.createMessage(
      username,
      message,
    );

    await this.pusherService.trigger('chat', 'message', {
      username: savedMessage.username,
      message: savedMessage.message,
    });

    return savedMessage;
  }

  @Get()
  async getMessages() {
    return this.messagesService.getMessages();
  }
}
