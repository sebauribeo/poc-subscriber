import { IsEnum, IsString } from 'class-validator';

export class AttributesDTO {
  @IsString()

  eventId: string;

  @IsEnum(['fileCreated'], {
    message: `Event is not valid [fileCreated]`
  })
  @IsString()
  eventType: string;

  @IsString()
  entityId: string;

  @IsString()

  entityType: string;

  @IsString()

  timestamp: string;

  @IsString()

  datetime: string;

  @IsString()

  version: string;

  @IsString()

  country: string;

  @IsString()

  commerce: string;

  @IsString()

  channel: string;

  @IsString()

  domain: string;

  @IsString()

  capability: string;

  @IsString()

  mimeType: string;

  @IsString()

  source: string;

  constructor(attributes: AttributesDTO) {
    this.eventId = attributes.eventId;
    this.eventType = attributes.eventType;
    this.entityId = attributes.entityId;
    this.entityType = attributes.entityType;
    this.timestamp = attributes.timestamp;
    this.datetime = attributes.datetime;
    this.version = attributes.version;
    this.country = attributes.country;
    this.commerce = attributes.commerce;
    this.channel = attributes.channel;
    this.domain = attributes.domain;
    this.capability = attributes.capability;
    this.mimeType = attributes.mimeType;
    this.source = attributes.source;
  }
}