export type RegisterForm = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  phone: string;
};

export type ActivateForm = {
  username: string;
  otp: string;
};

export type LoginForm = {
  username: string;
  password: string;
};
