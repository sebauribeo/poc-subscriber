import { Controller } from '@nestjs/common';
import { Message } from '@google-cloud/pubsub';
import { AttributesDTO } from './dto/attributes.dto';
import { Headers } from './models/headers';
import { LoggerService } from './services/logger/logger.service';
import { EventPattern } from '@nestjs/microservices';
import { validate } from 'class-validator';
import { DataDTO } from './dto/data.dto';

@Controller()
export class AppController {
  constructor(
    private logger: LoggerService,
  ) { }

  @EventPattern(process.env.GCLOUD_PUBSUB_SUBCRIPTION_NAME)
  async messageHandler(message: Message) {
    const start = process.hrtime();
    let headers: Headers;
    let primaryId: string;
    try {
      const attributes = new AttributesDTO(message.attributes as unknown as AttributesDTO);
      const data = JSON.parse(message.data.toString()) as unknown as DataDTO;
      const validateData = await validate(data);
      const validateAttributes = await validate(attributes);
      if (validateAttributes.length === 0 && validateData.length === 0) {
        primaryId = attributes.entityId;
        this.logger.info(headers, `START: ${start[1]} - MessageId: ${message.id}`, primaryId);
        this.logger.info(headers, { attributes, data }, primaryId);
        const finish = process.hrtime(start);
        this.logger.info(headers, `FINISH: ${start[1]} - MessageId: ${message.id} on ${finish[0]}s ${String(Math.floor((finish[1]) / (1000 * 1000))).padStart(3, '0')}ms`, primaryId);
      } else {
        this.logger.error(headers, { [`Invalid message ${message.id}`]: validateAttributes.map((error) => error.constraints) }, primaryId);
        this.logger.error(headers, { [`Invalid message ${message.id}`]: validateData.map((error) => error.constraints) }, primaryId);
      }
      message.ack();
    } catch (e) {
      this.logger.error(headers, e.message, primaryId);
    }
  }
}
