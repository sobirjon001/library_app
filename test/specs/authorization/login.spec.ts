import { AxiosResponse } from 'axios';
import { Obj } from '../../../src/conf/types';
import API from '../../utils/axios';
import { expect } from 'chai';

describe('Login feature', () => {
  describe('With invalid credentials', () => {
    let response: AxiosResponse<any, any>;
    let body: Obj = {};
    before(async function () {
      response = await API.login_test({
        user_login: process.env.ADMIN as string,
        password: 'invalid_password',
      });
      expect(response).has.property('data');
      body = response.data;
    });

    it('status code is 401', () => {
      expect(response.status).to.eql(401);
    });

    it('success is false', () => {
      expect(body).has.property('success');
      expect(body.success).to.eql(false);
    });

    it("message equals to 'Invalid user_login or password'", () => {
      expect(body).has.property('message');
      expect(body.message).to.eql('Invalid user_login or password');
    });
  });

  describe('With valid credentials', () => {
    let response: AxiosResponse<any, any>;
    let body: Obj = {};
    before(async () => {
      response = await API.login_test({
        user_login: process.env.ADMIN as string,
        password: process.env.ADMIN_PASSWORD as string,
      });
      expect(response).has.property('data');
      body = response.data;
    });

    it('status code is 200', () => {
      expect(response.status).to.eql(200);
    });

    it('success is true', () => {
      expect(body).has.property('success');
      expect(body.success).to.eql(true);
    });

    it("message equals to 'Login successfull'", () => {
      expect(body).has.property('message');
      expect(body.message).to.eql('Login successfull');
    });

    it('token provided', () => {
      expect(body).has.property('token');
      expect(body.token).length.greaterThan(0);
    });
  });
});
