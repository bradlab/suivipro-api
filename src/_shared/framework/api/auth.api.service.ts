/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AxiosRest, restInitializer } from 'framework/rest.adapter';
import { IEvent } from 'app/abstract/generic.event';

class GenericAuthAPI {
  private axiosAdapter: AxiosRest<any>;
  private _apiUrl: string;

  private API_HEADERS = {
    'x-api-key': undefined as any,
  };

  constructor(path?: string) {
    const { apiHeader, apiUrl, axiosAdapter } = restInitializer<any>(path);
    this.API_HEADERS = apiHeader!;
    this._apiUrl = apiUrl!;
    this.axiosAdapter = axiosAdapter!;
  }

  async signin(data: any) {
    return this.axiosAdapter.post(`${this._apiUrl}/signin`, data, {
      headers: this.API_HEADERS,
    });
  }

  async addAccess(rules: any) {
    return this.axiosAdapter.post(`${this._apiUrl}/access.groups/bulk`, rules, {
      headers: this.API_HEADERS,
    });
  }

  async tokenLogin(token: string, permission?: string) {
    const headers = {
      ...this.API_HEADERS,
      'x-permission': permission,
      Authorization: `Bearer ${token}`,
    };

    const response = await this.axiosAdapter.get(
      `${this._apiUrl}/auth/token.signin`,
      {
        headers: headers,
      },
    );

    return response;
  }
}

@Injectable()
export class CoreAPIService implements OnApplicationBootstrap {
  api: GenericAuthAPI;
  event: IEvent;

  onApplicationBootstrap(): void {
    this.api = new GenericAuthAPI();
  }
}
