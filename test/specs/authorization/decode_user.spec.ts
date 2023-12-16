import { AxiosResponse } from 'axios';
import API from '../../utils/axios';
import { conf } from '../../utils/config';
import { expect } from 'chai';
import { Obj } from '../../../src/conf/types';
import { query } from '../../utils/mysql';

const api = new API();

describe('Decode user', () => {
  let response: AxiosResponse<any, any>;
  let body: Obj = {};
  const user_keys: string[] = ['user_id', 'first_name', 'last_name', 'dob', 'user_login', 'e_mail', 'phone_number'];
  let db_user: Obj = {};
  before(async () => {
    await api.login({ user_login: process.env.ADMIN as string, password: process.env.ADMIN_PASSWORD as string });
    response = await api.fetch('get', conf.ENDPOINT.decode);
    expect(response.status).to.eql(200);
    expect(response).has.property('data');
    body = response.data;
    const db_response_rows = await query(`select * from users where user_login = ?;`, [process.env.ADMIN as string]);
    expect(db_response_rows).length.greaterThan(0);
    db_user = db_response_rows[0];
  });

  it('status code is 200', () => {
    expect(response.status).to.eql(200);
  });

  it('success is true', () => {
    expect(body).has.property('success');
    expect(body.success).to.eql(true);
  });

  it("message equals to 'Decode successfull'", () => {
    expect(body).has.property('message');
    expect(body.message).to.eql('Decode successfull');
  });

  user_keys.forEach((key: string) => {
    it(`correct ${key}`, () => {
      expect(String(body.data[key])).to.eqls(String(db_user[key]));
    });
  });
});
