import axios, { AxiosResponse } from 'axios';
import { conf } from './config';
import { Obj } from '../../src/conf/types';

export default class API {
  headers!: { Authorization: string; Accept: string; 'Content-Type': string };
  credentials!: { user_login: string; password: string };

  get_credentials(): { user_login: string; password: string } {
    return this.credentials;
  }

  static login_test(data: { user_login: string; password: string }): Promise<AxiosResponse<any, any>> {
    return axios({
      method: 'post',
      url: `${conf.base_URL}${conf.ENDPOINT.login}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data,
      validateStatus: function (status) {
        return status >= 200 && status < 599; // ignoring negative codes here
      },
    });
  }

  async login(data: { user_login: string; password: string }): Promise<string> {
    this.credentials = data;
    const response = await axios({
      method: 'post',
      url: `${conf.base_URL}${conf.ENDPOINT.login}`,
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    });
    this.headers = {
      Authorization: `Bearer ${response.data.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    return response.data.token;
  }

  async fetch(
    method: 'get' | 'post' | 'patch' | 'delete',
    endpoint: string,
    options?: { headers?: Obj; body?: Obj }
  ): Promise<AxiosResponse<any, any>> {
    return axios({
      method,
      url: `${conf.base_URL}${endpoint}`,
      headers: { ...this.headers, ...options?.headers },
      data: options?.body,
      validateStatus: function (status) {
        return status >= 200 && status < 599; // ignoring negative codes here
      },
    });
  }
}
