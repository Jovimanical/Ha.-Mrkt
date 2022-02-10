export class User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  company: string;
  username: string;
  address: string;
  website: string;
  bio: string;
  isActive: boolean;
  isVerifyRequired: boolean;
  roles: Array<string>;
  mobile: string;
  profileImage: string;
  isOAuth: boolean;
}
