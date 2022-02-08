import { EncryptStorage } from 'encrypt-storage';

const options ={
    prefix: '@HAStorage',
  }
// Example of secret_key variable in an .env file
// const encryptStorage = new EncryptStorage(process.env.SECRET_KEY, options);
export const HAEncryptStorage = new EncryptStorage('secret-key-house-Africa-@testing0092', options);