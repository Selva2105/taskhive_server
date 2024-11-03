import { randomBytes } from 'crypto';

export class OTPUtils {
  /**
   * Generates a 6-digit numeric OTP using the crypto library for better security.
   * @returns A 6-digit numeric OTP as a string.
   */
  public static generateOTP(): string {
    const otp = randomBytes(3).readUIntBE(0, 3) % 1000000;
    return otp.toString().padStart(6, '0');
  }
}
