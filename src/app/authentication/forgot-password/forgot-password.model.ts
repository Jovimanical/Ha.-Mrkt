import { ForgotPasswordStep } from './forgot-password-step.enum';

export class ForgotPassword {
  hasError?: boolean;
  errorMessage?: string;
  forgotPasswordStep?: ForgotPasswordStep;
  passwordRecoveryToken?: string;
  userId?: string;
  email?: string;
  verificationCode?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}
