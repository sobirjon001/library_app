import { config } from 'dotenv';
import { Obj, User } from '../../src/conf/types';

config();

const qa_logins: string[] = process.env.QA ? process.env.QA.split(',') : [];
const qa_passwords: string[] = process.env.QA_PASSWORD ? process.env.QA_PASSWORD.split(',') : [];
const tester_users: { available: boolean; user: User }[] = [];
qa_logins.forEach((qa_login: string, i: number): void => {
  let qa_password: string = '';
  if (qa_passwords.length === 1) {
    qa_password = qa_passwords[0];
  } else if (qa_passwords.length > 1 && qa_passwords.length < i + 1) {
    throw new Error(
      `If you using more than one password for .env.QA, 
    then please provide comma separated passwords for each comma separated QA, 
    or just use one same password for all QA`
    );
  } else {
    qa_password = qa_passwords[i];
  }
  tester_users.push({
    available: true,
    user: {
      first_name: `Tester_${i}`,
      last_name: 'Account',
      dob: '2000-01-01',
      user_login: qa_login,
      password: qa_password,
      e_mail: `${qa_login}@library.com`,
      phone_number: 1234567891 + i,
    },
  });
});

const admin_user: User = {
  first_name: 'Admin',
  last_name: 'Account',
  dob: '2000-01-01',
  user_login: process.env.ADMIN as string,
  password: process.env.ADMIN_PASSWORD as string,
  e_mail: `${process.env.ADMIN as string}@library.com`,
  phone_number: 1234567890,
};

const storage: Obj = {};

export const conf = {
  base_URL: `http://localhost:${process.env.HTTP_PORT}`,
  ENDPOINT: {
    login: '/api/users/login',
    decode: '/api/users/decode',
    users: '/api/users',
  },
  admin_user,
  tester_users,

  storage,
};
