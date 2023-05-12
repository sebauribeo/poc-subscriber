export class Headers {
  'x-country': string;
  'x-commerce': string;
  'x-chref': string;
  'x-rhsref': string;
  'x-cmref': string;
  'x-txref': string;
  'x-prref': string;
  'x-usrtx': string;
  constructor(country: string, commerce: string, channel: string) {
    this['x-country'] = country;
    this['x-commerce'] = commerce;
    this['x-chref'] = channel;
  }
}
