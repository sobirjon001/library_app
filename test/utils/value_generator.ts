import { User, GetValueOptions } from '../../src/conf/types';
import moment from 'moment';
import { conf } from './config';

const alphabets: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const numbers: string = '0123456789';

export enum RANDOM {
  first_name,
  last_name,
  dob,
  user_login,
  password,
  e_mail,
  phone_number,
}

const get_random_character_from = (input: string | string[]): string => {
  const i = Math.floor(Math.random() * input.length);
  if (typeof input === 'string') {
    return input.slice(i, i + 1);
  } else {
    return input[i];
  }
};

export const get_random_alphabets_in_amount_of = (n: number): string => {
  let result: string = '';
  for (let i = 0; i < n; i++) {
    result += get_random_character_from(alphabets);
  }
  return result;
};

export const get_random_numbers_in_amount_of = (n: number): string => {
  let result: string = '';
  for (let i = 0; i < n; i++) {
    result += get_random_character_from(numbers);
  }
  return result;
};

export const get_random_alphanumeric_in_amount_of = (n: number): string => {
  let result: string = '';
  // for (let i = 0; i < n; i++) {
  for (let _i of Array(n)) {
    result = result + get_random_character_from(Math.random() > 0.5 ? numbers : alphabets);
  }
  return result;
};

export const get_value_for = (instruction: RANDOM, options?: Partial<GetValueOptions>): string => {
  let value: string = '';
  if (options && options.get) {
    value = conf.storage[options.get];
  } else {
    switch (instruction) {
      case RANDOM.first_name:
      case RANDOM.last_name:
        value = `FAKE${get_random_alphanumeric_in_amount_of(16)}`;
        break;
      case RANDOM.dob:
        const age: number = options && options.age ? options.age : process.env.MIN_AGE ? parseInt(process.env.MIN_AGE) : 40;
        const date_format: 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'YYYYMMDD' = options && options.date_format ? options.date_format : 'YYYY-MM-DD';
        const day = moment();
        day.subtract(age, 'years');
        day.subtract(Math.floor(Math.random() * 11), 'months');
        day.subtract(Math.floor(Math.random() * 28), 'days');
        value = day.format(date_format);
        break;
      case RANDOM.user_login:
      case RANDOM.password:
        value = get_random_alphanumeric_in_amount_of(20);
        break;
      case RANDOM.e_mail:
        const e_mail_name: string = options && options.e_mail_name ? options.e_mail_name : get_random_alphanumeric_in_amount_of(12);
        const e_mail_domain: string = options && options.e_mail_domain ? options.e_mail_domain : 'library.com';
        value = `${e_mail_name}@${e_mail_domain}`;
        break;
      case RANDOM.phone_number:
        value = `${get_random_numbers_in_amount_of(3)}-${get_random_numbers_in_amount_of(3)}-${get_random_numbers_in_amount_of(4)}`;
        break;
    }
    if (options && options.save) {
      conf.storage[options.save] = value;
    }
  }
  return value;
};

export const get_random_user = (): User => {
  const user_login: string = get_value_for(RANDOM.user_login);
  return {
    first_name: get_value_for(RANDOM.first_name),
    last_name: get_value_for(RANDOM.last_name),
    dob: get_value_for(RANDOM.dob, { age: parseInt(process.env.MIN_AGE as string) }),
    user_login,
    password: get_value_for(RANDOM.password),
    e_mail: get_value_for(RANDOM.e_mail, { e_mail_name: user_login, e_mail_domain: 'mochatest.org' }),
    phone_number: get_value_for(RANDOM.phone_number),
  };
};

export const normalize_phone_number = (phone_number: string | number): string => {
  return typeof phone_number === 'string' ? phone_number.replace(/-/g, '') : String(phone_number);
};
