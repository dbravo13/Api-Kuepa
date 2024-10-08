import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PusherService } from 'src/pusher/pusher.service';

@Controller()
export class AppController {
  // Constructor único para recibir ambos servicios
  public constructor(
    private readonly appService: AppService,
    private readonly pusherService: PusherService, // Agregar pusherService aquí
  ) {}

  @Get()
  public getHello(): string {
    return this.appService.getHello();
  }

  @Post('messages')
  async messages(
    @Body('username') username: string,
    @Body('message') message: string,
  ) {
    await this.pusherService.trigger('chat', 'message', {
      username,
      message,
    });

    return [];
  }
}
