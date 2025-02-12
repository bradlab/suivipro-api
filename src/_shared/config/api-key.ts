import { Logger } from '@nestjs/common';
import { ApiEnum } from 'app/enum/global.enum';

export interface IApiKey {
  key: string;
  api: string;
}

export abstract class ApiKeyManager {
  static getKeys(app?: ApiEnum): IApiKey | Record<ApiEnum, IApiKey> {
    const logger = new Logger();
    try {
      let key: string, api: string;
      switch (app) {
        case ApiEnum.TMONEY:
          key = process.env.TMONEY_KEY!;
          api = process.env.TMONEY_API!;
          break;

        default:
          break;
      }
      return { key: key!, api: api! };
    } catch (error) {
      logger.error(error.message, 'ERROR::ApiKeyManager.getKeys');
      return undefined as any;
    }
  }
}
