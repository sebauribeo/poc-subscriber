import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PubSubServer } from './transports/pubSub/PubSubServer';
import { AllExceptionsFilter } from './exception-filters/all-exceptions.filter';
import * as helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    strategy: new PubSubServer(),
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.use(helmet());

  await app.startAllMicroservicesAsync();
  const port = process.env.PORT;
  await app.listen(port);
  logger.log(`Server Start Port ${port}`);
}
bootstrap();
