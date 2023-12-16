import { AxiosResponse } from 'axios';
import { Obj } from '../../../src/conf/types';
import API from '../../utils/axios';
import { get_available_tester_credentials, return_tester_credentials } from '../../utils/value_generator';
import { conf } from '../../utils/config';
import { expect } from 'chai';
import { get_some_db_user } from '../../utils/mysql';
import { TestPlan, generic_mocha_test_with_api_call } from '../../utils/helper';

describe('Searchin users', () => {
  const api: API = new API();

  before('login', async () => {
    await api.login(await get_available_tester_credentials());
  });

  after('log out', async () => {
    await return_tester_credentials(api.get_credentials().user_login);
  });

  describe('positive scenarios by query parameter', () => {
    const query_parameters: string[] = ['user_id', 'user_login', 'e_mail', 'phone_number', 'first_name', 'last_name'];

    query_parameters.forEach((query_parameter) => {
      describe(query_parameter, () => {
        let db_user: Obj;
        let response: AxiosResponse<any, any>;
        let body: Obj;
        let user: Obj;

        before(async () => {
          db_user = await get_some_db_user();
          response = await api.fetch('get', `${conf.ENDPOINT.search_users}?${query_parameter}=${db_user[query_parameter]}`);
          expect(response).has.property('data');
          body = response.data;
          expect(body).has.property('data');
          expect(body.data).to.be.an('array');
          expect(body.data).length.greaterThan(0);
          user = body.data[0];
        });

        it("status code is '200'", () => {
          expect(response.status).to.eql(200);
        });

        it('success is true', () => {
          expect(body).has.property('success');
          expect(body.success).to.eql(true);
        });

        it("message equals to 'successfull request'", () => {
          expect(body).has.property('message');
          expect(body.message).to.eql('successfull request');
        });

        const user_properties: string[] = ['user_id', 'first_name', 'last_name', 'dob', 'user_login', 'e_mail', 'phone_number'];

        user_properties.forEach(async (property) => {
          it(`and '${property}' property present and matches databse value`, () => {
            expect(user).has.property(property);
            expect(user[property]).to.eql(db_user[property]);
          });
        });
      });
    });
  });

  describe('negative scenarios', async () => {
    const tests: TestPlan[] = [
      {
        title: 'with query parameter all absent',
        status_code: 403,
        success: false,
        message: 'invalid querry parameter',
      },
      {
        title: "with query parameter all equl to '*'",
        query: { user_id: '*', user_login: '*', e_mail: '*', phone_number: '*', first_name: '*', last_name: '*' },
        status_code: 403,
        success: false,
        message: 'invalid querry parameter',
        data_validation: {
          invalid_values: 'all query parameters are empty or *, at least one has to have value',
          available_query_parameters: ['user_id', 'user_login', 'e_mail', 'phone_number', 'first_name', 'last_name'],
        },
      },
      {
        title: "with query parameter 'user_id' equl to '*'",
        query: { user_id: '*' },
        status_code: 403,
        success: false,
        message: 'invalid querry parameter',
        data_validation: {
          invalid_values: 'all query parameters are empty or *, at least one has to have value',
          available_query_parameters: ['user_id', 'user_login', 'e_mail', 'phone_number', 'first_name', 'last_name'],
        },
      },
      {
        title: "with query parameter 'user_login' equl to '*'",
        query: { user_login: '*' },
        status_code: 403,
        success: false,
        message: 'invalid querry parameter',
        data_validation: {
          invalid_values: 'all query parameters are empty or *, at least one has to have value',
          available_query_parameters: ['user_id', 'user_login', 'e_mail', 'phone_number', 'first_name', 'last_name'],
        },
      },
      {
        title: "with query parameter 'e_mail' equl to '*'",
        query: { e_mail: '*' },
        status_code: 403,
        success: false,
        message: 'invalid querry parameter',
        data_validation: {
          invalid_values: 'all query parameters are empty or *, at least one has to have value',
          available_query_parameters: ['user_id', 'user_login', 'e_mail', 'phone_number', 'first_name', 'last_name'],
        },
      },
      {
        title: "with query parameter 'phone_number' equl to '*'",
        query: { phone_number: '*' },
        status_code: 403,
        success: false,
        message: 'invalid querry parameter',
        data_validation: {
          invalid_values: 'all query parameters are empty or *, at least one has to have value',
          available_query_parameters: ['user_id', 'user_login', 'e_mail', 'phone_number', 'first_name', 'last_name'],
        },
      },
      {
        title: "with query parameter 'first_name' and 'last_name' equl to '*'",
        query: { first_name: '*', last_name: '*' },
        status_code: 403,
        success: false,
        message: 'invalid querry parameter',
        data_validation: {
          invalid_values: 'all query parameters are empty or *, at least one has to have value',
          available_query_parameters: ['user_id', 'user_login', 'e_mail', 'phone_number', 'first_name', 'last_name'],
        },
      },
      {
        title: 'with not acceptable query parameters',
        query: { first_names: 'Enabler', nick_name: 'Some_random_value' },
        status_code: 403,
        success: false,
        message: 'invalid querry parameter',
        data_validation: {
          not_acceptable_query_parameters: ['first_names', 'nick_name'],
          available_query_parameters: ['user_id', 'user_login', 'e_mail', 'phone_number', 'first_name', 'last_name'],
        },
      },
      // ****************************** Not found users  **************************
      {
        title: "with query parameter 'user_id' equl to '9999999'",
        query: { user_id: '9999999' },
        status_code: 404,
        success: false,
        message: 'No records found',
      },
      {
        title: "with query parameter 'user_login' equl to 'Does_not_exist'",
        query: { user_login: 'Does_not_exist' },
        status_code: 404,
        success: false,
        message: 'No records found',
      },
      {
        title: "with query parameter 'e_mail' equl to 'does_not@exist.here'",
        query: { e_mail: 'does_not@exist.here' },
        status_code: 404,
        success: false,
        message: 'No records found',
      },
      {
        title: "with query parameter 'phone_number' equl to '999-999-9999'",
        query: { phone_number: '999-999-9999' },
        status_code: 404,
        success: false,
        message: 'No records found',
      },
      {
        title: "with query parameter 'first_name' equl to 'Does_not_exist'",
        query: { first_name: 'Does_not_exist' },
        status_code: 404,
        success: false,
        message: 'No records found',
      },
      {
        title: "with query parameter 'last_name' equl to 'Does_not_exist'",
        query: { last_name: 'Does_not_exist' },
        status_code: 404,
        success: false,
        message: 'No records found',
      },
    ];

    tests.forEach(async (tests) => await generic_mocha_test_with_api_call(api, 'get', conf.ENDPOINT.search_users, tests));
  });
});
