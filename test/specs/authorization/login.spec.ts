import API from '../../utils/axios';
import { TestPlan, generic_mocha_test_with_api_call } from '../../utils/helper';

describe('Login feature', () => {
  const tests: TestPlan[] = [
    {
      title: 'With invalid credentials',
      login_credentials: {
        user_login: process.env.ADMIN as string,
        password: 'invalid_password',
      },
      status_code: 401,
      success: false,
      message: 'Invalid user_login or password',
    },
    {
      title: 'With valid credentials',
      login_credentials: {
        user_login: process.env.ADMIN as string,
        password: process.env.ADMIN_PASSWORD as string,
      },
      status_code: 200,
      success: true,
      body_has_properties: ['token'],
    },
  ];

  tests.forEach((test) => generic_mocha_test_with_api_call(test, new API()));
});
