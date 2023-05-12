import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpModule, INestApplication, ValidationPipe } from '@nestjs/common';
import { AppController } from '../src/app.controller';
import { LoggerService } from '../src/services/logger/logger.service';
import { HttpAdapterHost } from '@nestjs/core';
import { AllExceptionsFilter } from '../src/exception-filters/all-exceptions.filter';

//mocks
import * as validEvent from '../test/mocks/event/valid.json';
import * as invalidEvent from '../test/mocks/event/invalid.json';

const mockJson = jest.fn();
const mockStatus = jest.fn().mockImplementation(() => ({
  json: mockJson
}));
const mockGetRequest = jest.fn().mockImplementation(() => ({
  headers: mockJson,
  url: 'test'
}));
const mockGetResponse = jest.fn().mockImplementation(() => ({
  status: mockStatus
}));
const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
  getRequest: mockGetRequest
}));
const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn()
};

const mockMessage: any = {
  ackId: "asd",
  attributes: validEvent,
  data: null,
  deliveryAttempt: 1,
  id: "56465463543",
  publishTime: null,
  received: null,
  ack: jest.fn(),
  modAck: jest.fn(),
  nack: jest.fn(),
  _handled: '',
  _length: '',
  _subscriber: '',
  length: 0
}

describe('AppController 200 OK (e2e)', () => {
  let app: INestApplication;
  let appController: AppController;

  beforeEach(async () => {
    process.env.ENVIRONMENT = 'test';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [AppController],
      providers: [LoggerService]
    }).compile();

    app = moduleFixture.createNestApplication();
    appController = app.get<AppController>(AppController);
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
    await app.init();
  });


  it('/ SUCCESS', async (done) => {
    await appController.messageHandler(mockMessage);
    done();
  });

});

describe('AppController Failure (e2e)', () => {
  let app: INestApplication;
  let allExceptions: AllExceptionsFilter;
  let appController: AppController;
  let loggerService: LoggerService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [AppController],
      providers: [LoggerService, AllExceptionsFilter]
    }).compile();

    app = moduleFixture.createNestApplication();
    const { httpAdapter } = app.get(HttpAdapterHost);
    appController = app.get<AppController>(AppController);
    allExceptions = app.get<AllExceptionsFilter>(AllExceptionsFilter);
    loggerService = app.get<LoggerService>(LoggerService);
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
    await app.init();
  });

  it('/ Invalid Event', async (done) => {
    mockMessage.attributes = invalidEvent;
    await appController.messageHandler(mockMessage);
    done();
  });

  it('/ (POST) Multiple exceptions', async (done) => {
    allExceptions.catch(new Error('Unknown Error'), mockArgumentsHost);
    allExceptions.catch(new HttpException({ response: { status: 400 } }, null), mockArgumentsHost);
    allExceptions.catch({}, mockArgumentsHost);
    done();
  });

  it('/ Invalid Event', async (done) => {
    jest.spyOn(loggerService, 'error').mockImplementation(() => { throw new Error('Only for testing') })
    try {
      await appController.messageHandler(mockMessage);
    } catch (e) {
      expect(e.message).toEqual('Only for testing')
      done()
    }
  });
});


describe('AppController Failure Production (e2e)', () => {
  let app: INestApplication;
  let allExceptions: AllExceptionsFilter;

  beforeEach(async () => {
    process.env.TUNNELRESPONSE = 'true';
    process.env.ENVIRONMENT = 'production';
    process.env.TIMEZONE = '';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [AppController],
      providers: [LoggerService, AllExceptionsFilter]
    }).compile();

    app = moduleFixture.createNestApplication();
    const { httpAdapter } = app.get(HttpAdapterHost);
    allExceptions = app.get<AllExceptionsFilter>(AllExceptionsFilter);
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
    await app.init();
  });


  it('/ (POST) Unknown exception', async (done) => {
    allExceptions.catch(new Error('Unknown Error'), mockArgumentsHost);
    done();
  });
});
