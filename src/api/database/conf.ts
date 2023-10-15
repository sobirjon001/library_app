import { Role, User } from '../../conf/types';

export const system_roles: Role[] = [
  {
    role_name: 'admin',
    can_read_role: true,
    can_create_role: true,
    can_modify_role: true,
    can_delete_role: true,
    can_read_order: true,
    can_create_order: true,
    can_modify_order: true,
    can_delete_order: true,
    can_read_user: true,
    can_create_user: true,
    can_modify_user: true,
    can_delete_user: true,
    can_read_book: true,
    can_create_book: true,
    can_modify_book: true,
    can_delete_book: true,
    can_read_events: true,
  },
  {
    role_name: 'QA',
    can_read_role: true,
    can_create_role: true,
    can_modify_role: true,
    can_delete_role: true,
    can_read_order: true,
    can_create_order: true,
    can_modify_order: true,
    can_delete_order: true,
    can_read_user: true,
    can_create_user: true,
    can_modify_user: true,
    can_delete_user: true,
    can_read_book: true,
    can_create_book: true,
    can_modify_book: true,
    can_delete_book: true,
    can_read_events: true,
  },
  {
    role_name: 'student',
    can_read_role: false,
    can_create_role: false,
    can_modify_role: false,
    can_delete_role: false,
    can_read_order: false,
    can_create_order: true,
    can_modify_order: false,
    can_delete_order: false,
    can_read_user: false,
    can_create_user: false,
    can_modify_user: false,
    can_delete_user: false,
    can_read_book: true,
    can_create_book: false,
    can_modify_book: false,
    can_delete_book: false,
    can_read_events: false,
  },
  {
    role_name: 'new_hire_applicant',
    can_read_role: false,
    can_create_role: false,
    can_modify_role: false,
    can_delete_role: false,
    can_read_order: false,
    can_create_order: true,
    can_modify_order: false,
    can_delete_order: false,
    can_read_user: false,
    can_create_user: false,
    can_modify_user: false,
    can_delete_user: false,
    can_read_book: false,
    can_create_book: false,
    can_modify_book: false,
    can_delete_book: false,
    can_read_events: false,
  },
];

export const sign_up_roles: string[] = ['student', 'new_hire_applicant'];

export const account_statuses: string[] = ['active', 'new_hire_applicant'];

const qa_logins: string[] = process.env.QA ? process.env.QA.split(',') : [];
const qa_passwords: string[] = process.env.QA_PASSWORD ? process.env.QA_PASSWORD.split(',') : [];
const qa_default_accounts: User[] = [];
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
  qa_default_accounts.push({
    first_name: `Tester_${i}`,
    last_name: 'Account',
    dob: '2000-01-01',
    user_login: qa_login,
    password: qa_password,
    e_mail: `${qa_login}@library.com`,
    phone_number: 1234567891 + i,
  });
});

export const admin_user: User = {
  first_name: 'Admin',
  last_name: 'Account',
  dob: '2000-01-01',
  user_login: process.env.ADMIN as string,
  password: process.env.ADMIN_PASSWORD as string,
  e_mail: `${process.env.ADMIN as string}@library.com`,
  phone_number: 1234567890,
};

export const tester_users: User[] = [...qa_default_accounts];
