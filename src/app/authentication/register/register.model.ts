import { Phone } from '../../core/user/phone.model';

export class Register {
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  confirmPassword: string;
  phones: Array<Phone>;
  invitationToken?: string;
}
