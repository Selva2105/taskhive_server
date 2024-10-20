import { randomBytes } from 'crypto';

export class OTPUtils {
  /**
   * Generates a 6-digit OTP using the crypto library for better security.
   * @returns A 6-digit OTP as a string.
   */
  public static generateOTP(): string {
    const otp = randomBytes(3).toString('hex').slice(0, 6);
    return otp;
  }
}
