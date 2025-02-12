/* eslint-disable @typescript-eslint/no-explicit-any */

import { CustomMethod } from 'domain/types';

export interface FetcherParam<D = any> {
  url?: string;
  method?: CustomMethod | string;
  baseURL?: string;
  headers?: {
    'Content-Type'?: string;
    Accept?: string;
    Authorization?: string;
    'x-api-key'?: string;
    'x-permission'?: string;
  };
  params?: any;
  data?: D;
  timeout?: number;
  timeoutErrorMessage?: string;
  withCredentials?: boolean;
}

export interface IFetcher<T> {
  get(url: string, init?: FetcherParam): Promise<T | T[]>;
  post(url: string, data: any, init?: FetcherParam): Promise<T | T[] | any>;
  login?(url: string, data: any, init?: FetcherParam): Promise<any>;
  patch(url: string, data: any, init?: FetcherParam): Promise<T | T[]>;
  put?(url: string, data: any, init?: FetcherParam): Promise<T | T[]>;
  delete(url: string, init?: FetcherParam): Promise<boolean>;
}
