import { Phone } from '../../core/user/phone.model';

export class Register {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  agreement: boolean;
  mobile: string;
  country_code: string;
  invitationToken?: string;
}
