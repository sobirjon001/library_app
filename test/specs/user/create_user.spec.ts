import { AxiosResponse } from 'axios';
import { Obj, TestPlan, User } from '../../../src/conf/types';
import API from '../../utils/axios';
import { conf } from '../../utils/config';
import { RANDOM, get_random_alphanumeric_in_amount_of, get_random_user, get_value_for, normalize_phone_number } from '../../utils/value_generator';
import { expect } from 'chai';
import { get_some_db_user, query } from '../../utils/mysql';

describe('Creating', () => {
  interface User2 extends User, Obj {}
  const api: API = new API();
  before(async () => {
    await api.login({ user_login: process.env.ADMIN as string, password: process.env.ADMIN_PASSWORD as string });
  });

  describe('new user, positive scenario', () => {
    let new_user: User2;
    let response: AxiosResponse<any, any>;
    let body: Obj = {};
    let db_user: Obj = {};

    const user_keys: string[] = ['user_id', 'first_name', 'last_name', 'dob', 'user_login', 'e_mail', 'phone_number'];

    before(async () => {
      new_user = get_random_user();
      response = await api.fetch('post', conf.ENDPOINT.users, { body: new_user });
      new_user.phone_number = normalize_phone_number(new_user.phone_number);
      expect(response).has.property('data');
      body = response.data;
      db_user = (await query(`select * from users where user_login = ?;`, [new_user.user_login]))[0];
    });

    it("status code is '201'", () => {
      expect(response.status).to.eql(201);
    });

    it('success is true', () => {
      expect(body).has.property('success');
      expect(body.success).to.eql(true);
    });

    it("message equals to 'Successfully created new user'", () => {
      expect(body).has.property('message');
      expect(body.message).to.eql('Successfully created new user');
    });

    describe('correct values input vs database', () => {
      user_keys.forEach((key: string) => {
        if (!['user_id'].includes(key))
          it(key, () => {
            expect(String(new_user[key])).to.eqls(String(db_user[key]));
          });
      });
    });

    describe('correct values database vs responce', () => {
      user_keys.forEach((key: string) => {
        if (!['user_id', 'user_login'].includes(key))
          it(key, () => {
            expect(String(db_user[key])).to.eqls(String(body.data[key]));
          });
      });
    });

    describe('correct values responce vs database', () => {
      user_keys.forEach((key: string) => {
        if (!['user_login'].includes(key))
          it(key, () => {
            expect(String(body.data[key])).to.eqls(String(db_user[key]));
          });
      });
    });
  });

  describe('new user, negative scenario', async () => {
    const length_fields: string[] = ['first_name', 'last_name', 'user_login', 'password'];

    length_fields.forEach((length_field) => {
      describe(`where field '${length_field}' is more that 20 characters`, () => {
        let new_user: User2;
        let response: AxiosResponse<any, any>;
        let body: Obj = {};

        before(async () => {
          new_user = get_random_user();
          new_user[length_field] = get_random_alphanumeric_in_amount_of(21);
          response = await api.fetch('post', conf.ENDPOINT.users, { body: new_user });
          new_user.phone_number = normalize_phone_number(new_user.phone_number);
          expect(response).has.property('data');
          body = response.data;
        });

        it("status code is '403'", () => {
          expect(response.status).to.eql(403);
        });

        it('success is false', () => {
          expect(body).has.property('success');
          expect(body.success).to.eql(false);
        });

        it("message equals to 'invalid json schema'", () => {
          expect(body).has.property('message');
          expect(body.message).to.eql('invalid json schema');
        });

        it('is not saved to database', async () => {
          const db_user_rows = await query(`select * from users where user_login = ?;`, [new_user.user_login]);
          expect(db_user_rows.length).to.eql(0);
        });

        describe('responce body has errors', () => {
          before('at least one', () => {
            expect(body).has.property('errors');
            expect(body.errors).to.be.an('array');
            expect(body.errors).length.greaterThan(0);
          });

          it(`errors.path equals to '${length_field}'`, () => {
            expect(body.errors[0].path).to.eql(length_field);
          });

          it("errors.path equals to 'maxLength'", () => {
            expect(body.errors[0].key).to.eql('maxLength');
          });

          it("errors.message equals to 'must NOT have more than 20 characters'", () => {
            expect(body.errors[0].message).to.eql('must NOT have more than 20 characters');
          });
        });
      });
    });

    const tests: TestPlan[] = [
      {
        title: "where field 'dob' does nott have pattern of 'YYYY-MM-DD'",
        update: [
          {
            property: 'dob',
            value: get_value_for(RANDOM.dob, { date_format: 'MM/DD/YYYY' }),
          },
        ],
        status_code: 403,
        success: false,
        message: 'invalid fields, please fix values',
        data_array_of_strings: ["'dob' has to be 'YYYY-MM-DD' format"],
        db_search_by_key: 'user_login',
      },
      {
        title: "where field 'e_mail' does not have pattern of 'example@example.com'",
        update: [
          {
            property: 'e_mail',
            value: get_value_for(RANDOM.e_mail).replace('@', '@@'),
          },
        ],
        status_code: 403,
        success: false,
        message: 'invalid fields, please fix values',
        data_array_of_strings: ["'e_mail' has to be 'example@example.com' format"],
        db_search_by_key: 'user_login',
      },
      {
        title: "field 'phone_number' does not have pattern of '000-000-0000' or '0000000000' 10 digits in length",
        update: [
          {
            property: 'phone_number',
            value: get_value_for(RANDOM.phone_number).replace('-', '/'),
          },
        ],
        status_code: 403,
        success: false,
        message: 'invalid fields, please fix values',
        data_array_of_strings: ["'phone_number' has to have 10 digits or pattern of '000-000-0000'"],
        db_search_by_key: 'user_login',
      },
      {
        title: "values for field 'user_login'is duplicated/already exist in database",
        update: [
          {
            property: 'user_login',
            value: String(((await get_some_db_user()) as User).user_login),
          },
        ],
        status_code: 409,
        success: false,
        message_matches: /^ER_DUP_ENTRY: Duplicate entry \'[A-Za-z0-9]*\' for key \'user_login\'$/,
        db_search_by_key: 'phone_number',
      },
      {
        title: "values for field 'phone_number'is duplicated/already exist in database",
        update: [
          {
            property: 'phone_number',
            value: String(((await get_some_db_user()) as User).phone_number),
          },
        ],
        status_code: 409,
        success: false,
        message_matches: /^ER_DUP_ENTRY: Duplicate entry \'\d{10}\' for key \'phone_number\'$/,
        db_search_by_key: 'user_login',
      },
      {
        title: "values for field 'e_mail'is duplicated/already exist in database",
        update: [
          {
            property: 'e_mail',
            value: String(((await get_some_db_user()) as User).e_mail),
          },
        ],
        status_code: 409,
        success: false,
        message_matches: /^ER_DUP_ENTRY: Duplicate entry \'[A-Za-z0-9@.]*\' for key \'e_mail\'$/,
        db_search_by_key: 'user_login',
      },
    ];

    tests.forEach((test) => {
      describe(test.title, () => {
        let new_user: User2;
        let response: AxiosResponse<any, any>;
        let body: Obj = {};

        before(async () => {
          new_user = get_random_user();
          test.update?.forEach((update) => {
            new_user[update.property] = update.value;
          });
          response = await api.fetch('post', conf.ENDPOINT.users, { body: new_user });
          new_user.phone_number = normalize_phone_number(new_user.phone_number);
          expect(response).has.property('data');
          body = response.data;
          // console.log(JSON.stringify(body, null, 2));
        });

        if (test.status_code)
          it(`status code is '${test.status_code}'`, () => {
            expect(response.status).to.eql(test.status_code);
          });

        if (test.success)
          it('success is false', () => {
            expect(body).has.property('success');
            expect(body.success).to.eql(test.success);
          });

        if (test.message)
          it("message equals to 'invalid fields, please fix values'", () => {
            expect(body).has.property('message');
            expect(body.message).to.eql('invalid fields, please fix values');
          });

        if (test.message_matches)
          it(`message matches '${test.message_matches}'`, () => {
            expect(body).has.property('message');
            expect(body.message).matches(test.message_matches!);
          });

        if (test.data_array_of_strings)
          it(`data includes message - ${test.data_array_of_strings}`, () => {
            expect(body).has.property('data');
            expect(body.data).to.be.an('array');
            expect(body.data).to.include.members(test.data_array_of_strings!);
          });

        if (test.db_search_by_key)
          it('is not saved to database', async () => {
            const db_user_rows = await query(`select * from users where ${test.db_search_by_key} = ?;`, [new_user[test.db_search_by_key!]]);
            expect(db_user_rows.length).to.eql(0);
          });
      });
    });
  });
});
