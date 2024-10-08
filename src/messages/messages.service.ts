import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../messages/entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  // Guardar un nuevo mensaje
  async createMessage(username: string, message: string): Promise<Message> {
    const newMessage = this.messagesRepository.create({
      username,
      message,
    });
    return this.messagesRepository.save(newMessage);
  }

  // Obtener todos los mensajes
  async getMessages(): Promise<Message[]> {
    return this.messagesRepository.find({
      order: { createdAt: 'ASC' }, // Ordenar por fecha de creación
    });
  }
}
