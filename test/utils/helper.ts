import { AxiosResponse } from 'axios';
import { Obj } from '../../src/conf/types';
import API from './axios';
import { expect } from 'chai';

export interface Credentials {
  user_login: string;
  password: string;
}

export interface TestPlan extends Obj {
  title: string;

  // Input values
  login_credentials?: Credentials;
  update?: { [key: string]: string };
  query?: { [key: string]: string };

  // Validation values
  status_code?: number;
  success?: boolean;
  message?: string;
  message_matches?: RegExp;
  body_has_properties?: string[];
  body_does_not_has_properties?: string[];
  data_validation?: string | string[] | Obj;
  db_search_by_key?: string;
  pagination?: {
    requested_number_of_items_per_page?: number;
    requested_page_number: number;
    number_of_available_records: number;
    current_page: number;
    total_available_pages: number;
    number_of_records_fetched: number;
  };
}

const get_query_parameters = (test: TestPlan): string => {
  let query_parameter: string = '';
  if (test.query) {
    Object.keys(test.query).forEach((key) => {
      query_parameter += `&${key}=${test.query![key]}`;
    });
    return `?${query_parameter.substring(1)}`;
  } else {
    return query_parameter;
  }
};

export const generic_mocha_test_with_api_call = async (api: API, method: 'get' | 'post' | 'patch' | 'delete', endpoint: string, test: TestPlan) => {
  describe(test.title, () => {
    let response: AxiosResponse<any, any>;
    let body: Obj;

    before(async () => {
      if (test.login_credentials) await api.login(test.login_credentials);
      response = await api.fetch(method, `${endpoint}${get_query_parameters(test)}`);
      expect(response).has.property('data');
      body = response.data;
    });

    if (test.status_code)
      it(`status code is '${test.status_code}'`, () => {
        expect(response.status).to.eql(test.status_code);
      });

    if (typeof test.success === 'boolean')
      it('success is false', () => {
        expect(body).has.property('success');
        expect(body.success).to.eql(false);
      });

    if (test.message)
      it(`message equals to '${test.message}'`, () => {
        expect(body).has.property('message');
        expect(body.message).to.eql(test.message);
      });

    test.body_has_properties?.forEach((desired) => {
      it(`response body has '${desired}' property`, () => {
        expect(body).has.property(desired);
        expect(body[desired]).is.not.null;
      });
    });

    test.body_does_not_has_properties?.forEach((not_desired) => {
      it(`response body does not has '${not_desired}' property`, () => {
        expect(body).does.not.has.property(not_desired);
      });
    });

    if (test.data_validation) {
      if (typeof test.data_validation === 'string') {
        it(`data equal to '${test.data_validation}`, () => {
          expect(body).has.property('data');
          expect(body.data).to.eql(test.data_validation);
        });
      } else if (Array.isArray(test.data_validation)) {
        it(`data equal to array '${test.data_validation}`, () => {
          expect(body).has.property('data');
          expect(body.data).to.be.an('array');
          expect(body.data).to.include.members(test.data_validation as string[]);
        });
      } else {
        describe('data has elements:', () => {
          Object.keys(test.data_validation as Obj).forEach((key) => {
            it(`'${key}'='${(test.data_validation as Obj)[key]}`, () => {
              expect(body.data).has.property(key);
              if (Array.isArray((test.data_validation as Obj)[key])) {
                expect(body.data[key]).to.be.an('array');
                expect(body.data[key]).length.greaterThan(0);
                expect(body.data[key]).include.members((test.data_validation as Obj)[key]);
              } else expect(body.data[key]).to.eql((test.data_validation as Obj)[key]);
            });
          });
        });
      }
    }
  });
};

export const generic_mocha_test = async (response: AxiosResponse<any, any>, test: TestPlan) => {
  const body: Obj = response.data;

  if (test.status_code)
    it(`status code is '${test.status_code}'`, () => {
      expect(response.status).to.eql(test.status_code);
    });

  if (test.success)
    it('success is false', () => {
      expect(body).has.property('success');
      expect(body.success).to.eql(false);
    });

  if (test.message)
    it(`message equals to '${test.message}'`, () => {
      expect(body).has.property('message');
      expect(body.message).to.eql(test.message);
    });

  test.body_has_properties?.forEach((desired) => {
    it(`response body has '${desired}' property`, () => {
      expect(body).has.property(desired);
      expect(body[desired]).is.not.null;
    });
  });

  test.body_does_not_has_properties?.forEach((not_desired) => {
    it(`response body does not has '${not_desired}' property`, () => {
      expect(body).does.not.has.property(not_desired);
    });
  });

  if (test.data_validation) {
    if (typeof test.data_validation === 'string') {
      it(`data equal to '${test.data_validation}`, () => {
        expect(body).has.property('data');
        expect(body.data).to.eql(test.data_validation);
      });
    } else if (Array.isArray(test.data_validation)) {
      it(`data equal to array '${test.data_validation}`, () => {
        expect(body).has.property('data');
        expect(body.data).to.be.an('array');
        expect(body.data).to.include.members(test.data_validation as string[]);
      });
    } else {
      describe('data has elements:', () => {
        Object.keys(test.data_validation as Obj).forEach((key) => {
          it(`'${key}'='${(test.data_validation as Obj)[key]}`, () => {
            expect(body.data).has.property(key);
            if (Array.isArray((test.data_validation as Obj)[key])) {
              expect(body.data[key]).to.be.an('array');
              expect(body.data[key]).length.greaterThan(0);
              expect(body.data[key]).include.members((test.data_validation as Obj)[key]);
            } else expect(body.data[key]).to.eql((test.data_validation as Obj)[key]);
          });
        });
      });
    }
  }
};
