import { AxiosResponse } from 'axios';
import API from '../../utils/axios';
import { conf } from '../../utils/config';
import {
  get_available_tester_credentials,
  get_random_object_from,
  get_total_pages_from,
  return_tester_credentials,
} from '../../utils/value_generator';
import { expect } from 'chai';
import { Obj } from '../../../src/conf/types';

describe('Get', () => {
  const api: API = new API();

  before(async () => {
    await api.login(await get_available_tester_credentials());
  });

  after(async () => {
    await return_tester_credentials(api.get_credentials().user_login);
  });

  describe('all users omitting pagination', () => {
    let response: AxiosResponse<any, any>;
    let body: Obj = {};

    before(async () => {
      response = await api.fetch('get', conf.ENDPOINT.users);
      expect(response).has.property('data');
      body = response.data;
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

    const pagination_properties: string[] = [
      'requested_number_of_items_per_page',
      'requested_page_number',
      'number_of_available_records',
      'current_page',
      'total_available_pages',
      'number_of_records_fetched',
    ];

    pagination_properties.forEach((desired) => {
      it(`'${desired}' pagination property present in payload`, () => {
        expect(body).has.property(desired);
      });
    });

    describe('users return data has at least one user', () => {
      let random_user: Obj = {};
      before(() => {
        expect(body).has.property('data');
        expect(body.data).length.greaterThan(0);
        random_user = <Obj>get_random_object_from(body.data);
      });

      const user_properties: string[] = ['user_id', 'first_name', 'last_name', 'dob', 'user_login', 'e_mail', 'phone_number'];

      user_properties.forEach((desired) => {
        it(`and '${desired}' property present`, () => {
          expect(random_user).has.property(desired);
        });
      });
    });
  });

  describe('all users', () => {
    const pagination_tests_for_number_of_records_per_page: number[] = [100, 50, 25, 5, 2, 1];

    pagination_tests_for_number_of_records_per_page.forEach((records_per_page) => {
      describe(`with '${records_per_page}' records rep page`, () => {
        let number_of_records: number;
        let response: AxiosResponse<any, any>;
        let body: Obj = {};

        before(async () => {
          response = await api.fetch('get', conf.ENDPOINT.users, {
            page: 1,
            items_per_page: records_per_page,
          });
          expect(response).has.property('data');
          body = response.data;
          expect(body).has.property('number_of_available_records');
          number_of_records = body.number_of_available_records;
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

        describe('pagination field', () => {
          it(`'requested_number_of_items_per_page' property should equal '${records_per_page}'`, () => {
            expect(body).has.property('requested_number_of_items_per_page');
            expect(body.requested_number_of_items_per_page).to.eql(records_per_page);
          });

          it(`returned number or records in data should not exceed '${records_per_page}'`, () => {
            expect(body).has.property('data');
            expect(body.data).to.be.an('array');
            expect(body.data).length.lessThanOrEqual(records_per_page);
          });

          it(`'requested_page_number' property should equal '1'`, () => {
            expect(body).has.property('requested_page_number');
            expect(body.requested_page_number).to.eql(1);
          });

          it(`'number_of_available_records' property should equal '1'`, () => {
            expect(body).has.property('number_of_available_records');
            expect(body.number_of_available_records).to.eql(number_of_records);
          });

          it(`'current_page' property should equal '1'`, () => {
            expect(body).has.property('current_page');
            expect(body.current_page).to.eql(1);
          });

          it(`'total_available_pages' property should be correct`, () => {
            expect(body).has.property('total_available_pages');
            expect(body.total_available_pages).to.eql(get_total_pages_from(number_of_records, records_per_page));
          });

          it(`'number_of_records_fetched' property should be correct`, () => {
            expect(body).has.property('requested_number_of_items_per_page');
            expect(body.number_of_records_fetched).to.eql(number_of_records < records_per_page ? number_of_records : records_per_page);
          });
        });
      });
    });
  });
});
