export interface IUser {
  userName: string;
  password: string;
  eMail?: string;
}

export interface IUpdateUserForm {
  title: string;
  label: string;
  placeholder: string;
  value: string;
  password: string;
  rules: any[];
  type: string;
}
