export enum ForgotPasswordStep {
  VerifyUser = 0,
  VerifySecurityCode = 1,
  Validating = 2,
  // skipping 2 because security answers aren't built.
  ResetPassword = 3,
  Invalid = 4
}
