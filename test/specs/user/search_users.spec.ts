import { AxiosResponse } from 'axios';
import { Obj, TestPlan } from '../../../src/conf/types';
import API from '../../utils/axios';
import { get_available_tester_credentials, return_tester_credentials } from '../../utils/value_generator';
import { conf } from '../../utils/config';
import { expect } from 'chai';
import { get_some_db_user } from '../../utils/mysql';

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

  describe('negative scenarios', () => {
    const tests: TestPlan[] = [
      {
        title: 'with query parameter all absent',
      },
      {
        title: "with query parameter all equl to '*'",
        query: [
          {
            parameter: 'user_id',
            value: '*',
          },
          {
            parameter: 'user_login',
            value: '*',
          },
          {
            parameter: 'e_mail',
            value: '*',
          },
          {
            parameter: 'phone_number',
            value: '*',
          },
          {
            parameter: 'first_name',
            value: '*',
          },
          {
            parameter: 'last_name',
            value: '*',
          },
        ],
        data_property_string: [
          {
            property: 'invalid_values',
            value: 'all query parameters are empty or *, at least one has to have value',
          },
        ],
      },
      {
        title: "with query parameter 'user_id' equl to '*'",
        query: [
          {
            parameter: 'user_id',
            value: '*',
          },
        ],
        data_property_string: [
          {
            property: 'invalid_values',
            value: 'all query parameters are empty or *, at least one has to have value',
          },
        ],
      },
      {
        title: "with query parameter 'user_login' equl to '*'",
        query: [
          {
            parameter: 'user_login',
            value: '*',
          },
        ],
        data_property_string: [
          {
            property: 'invalid_values',
            value: 'all query parameters are empty or *, at least one has to have value',
          },
        ],
      },
      {
        title: "with query parameter 'e_mail' equl to '*'",
        query: [
          {
            parameter: 'e_mail',
            value: '*',
          },
        ],
        data_property_string: [
          {
            property: 'invalid_values',
            value: 'all query parameters are empty or *, at least one has to have value',
          },
        ],
      },
      {
        title: "with query parameter 'phone_number' equl to '*'",
        query: [
          {
            parameter: 'phone_number',
            value: '*',
          },
        ],
        data_property_string: [
          {
            property: 'invalid_values',
            value: 'all query parameters are empty or *, at least one has to have value',
          },
        ],
      },
      {
        title: "with query parameter 'first_name' and 'last_name' equl to '*'",
        query: [
          {
            parameter: 'first_name',
            value: '*',
          },
          {
            parameter: 'last_name',
            value: '*',
          },
        ],
        data_property_string: [
          {
            property: 'invalid_values',
            value: 'all query parameters are empty or *, at least one has to have value',
          },
        ],
      },
      {
        title: 'with not acceptable query parameters',
        query: [
          {
            parameter: 'first_names',
            value: 'Enabler',
          },
          {
            parameter: 'nick_name',
            value: 'Some_random_value',
          },
        ],
        data_property_string: [
          {
            property: 'not_acceptable_query_parameters',
            value: ['first_names', 'nick_name'],
          },
        ],
      },
    ];

    tests.forEach((test) => {
      describe(test.title, () => {
        let response: AxiosResponse<any, any>;
        let body: Obj;

        before(async () => {
          let query_parameter: string = '';
          if (test.query) {
            test.query.forEach((query) => {
              query_parameter += `&${query.parameter}=${query.value}`;
            });
            query_parameter = `?${query_parameter.substring(1)}`;
          }
          response = await api.fetch('get', `${conf.ENDPOINT.search_users}${query_parameter}`);
          expect(response).has.property('data');
          body = response.data;
          expect(body).has.property('data');
        });

        it("status code is '403'", () => {
          expect(response.status).to.eql(403);
        });

        it('success is false', () => {
          expect(body).has.property('success');
          expect(body.success).to.eql(false);
        });

        it("message equals to 'invalid querry parameter'", () => {
          expect(body).has.property('message');
          expect(body.message).to.eql('invalid querry parameter');
        });

        describe('data has instruction about', () => {
          it('available_query_parameters', () => {
            expect(body).has.property('data');
            expect(body.data).has.property('available_query_parameters');
            expect(body.data.available_query_parameters).to.be.an('array');
            expect(body.data.available_query_parameters).includes.members([
              'user_id',
              'user_login',
              'e_mail',
              'phone_number',
              'first_name',
              'last_name',
            ]);
          });

          test.data_property_string?.forEach((data_property) => {
            it(data_property.property, () => {
              expect(body).has.property('data');
              expect(body.data).has.property(data_property.property);
              if (Array.isArray(data_property.value)) {
                expect(body.data[data_property.property]).to.be.an('array');
                expect(body.data[data_property.property]).length.greaterThan(0);
                expect(body.data[data_property.property]).include.members(data_property.value);
              } else expect(body.data[data_property.property]).to.eql(data_property.value);
            });
          });
        });
      });
    });
  });
});
