import * as CryptoJS from 'crypto-js';

const SECRET_KEY = 'gregregregregregre'; // 🔑 Change this to env config

export class EncryptionUtil {
  static encrypt(userId: string | number): string {
    return CryptoJS.AES.encrypt(userId.toString(), SECRET_KEY).toString();
  }

  static decrypt(cipherText: string): string {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}