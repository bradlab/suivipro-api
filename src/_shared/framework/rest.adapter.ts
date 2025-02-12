/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpException } from '@nestjs/common';
// import axios from 'axios';
import { FetcherParam, IFetcher } from 'app/abstract/generic.rest';
import { ApiEnum } from 'app/enum';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiKeyManager, IApiKey } from 'config/api-key';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function restInitializer<T>(path?: string) {
  const apis = <IApiKey>ApiKeyManager.getKeys(ApiEnum.TMONEY);
  const axiosAdapter = new AxiosRest<T>(axios);
  let apiHeader = {
    'x-api-key': undefined as any,
  };

  if (apis?.key && apis?.api) {
    const apiUrl = path ? `${apis.api}/${path}` : apis.api;
    apiHeader = {
      'x-api-key': apis.key ?? 'api key',
    };
    return { axiosAdapter, apiHeader, apiUrl };
  }
  return {};
}

interface AxiosInstance {
  get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse>;
  post(
    url: string,
    data: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse>;
  put(
    url: string,
    data: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse>;
  patch(
    url: string,
    data: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse>;
  delete(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse>;
}

export class AxiosRest<T> implements IFetcher<T> {
  constructor(private readonly axios: AxiosInstance) {}

  private async getResponse(rep: Promise<AxiosResponse>) {
    return rep
      .then((res) => res.data)
      .catch((error: AxiosError) => {
        if (error.response)
          throw new HttpException(error.response?.data!, error.response?.status);
        throw error;
      });
  }

  async get(url: string, config?: FetcherParam) {
    return await this.getResponse(this.axios.get(url, config));
  }

  async post(url: string, data: any, config?: FetcherParam) {
    return await this.getResponse(this.axios.post(url, data, config));
  }

  async login(url: string, data: any, config?: FetcherParam) {
    return await this.getResponse(this.axios.post(url, data, config));
  }

  async put(url: string, data: any, config?: FetcherParam) {
    return await this.getResponse(this.axios.put(url, data, config));
  }

  async delete(url: string, config?: FetcherParam) {
    return await this.getResponse(this.axios.delete(url, config));
  }

  async patch(url: string, data: any, config?: FetcherParam) {
    return await this.getResponse(this.axios.patch(url, data, config));
  }
}
