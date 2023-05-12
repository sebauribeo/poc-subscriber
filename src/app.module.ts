import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggerService } from './services/logger/logger.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [LoggerService]
})
export class AppModule { }
