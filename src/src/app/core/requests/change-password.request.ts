export interface ChangePasswordRequest {
  newPassword: {
    first: string;
    second: string;
  };
  oldPassword: string;
}
