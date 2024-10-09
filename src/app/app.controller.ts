import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PusherService } from 'src/pusher/pusher.service';

@Controller()
export class AppController {
  public constructor(
    private readonly appService: AppService,
    private readonly pusherService: PusherService,
  ) {}

  @Get()
  public getHello(): string {
    return this.appService.getHello();
  }
}
